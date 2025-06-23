// Placeholder for useChatState custom hook (if not using Zustand or similar)
// This would encapsulate logic for managing messages, loading, errors etc.
// For M3, we might implement this or choose a store like Zustand.

import { useState, useCallback } from 'react';
import { Message } from '../components/MessageList'; // Assuming Message type is here
import {
    fetchAIResponse,
    AIQueryRequest,
    AIQueryResponse,
    AIErrorResponse
} from '../services/aiAssistantService';

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: AIErrorResponse | null;
  currentConversationId?: string;
}

// A simple unique ID generator for messages
const generateUniqueId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const useChatState = (initialMessages: Message[] = [], initialConversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AIErrorResponse | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(initialConversationId);

  // Load messages from localStorage on init (simplified)
  // In a real app, this would be more robust, perhaps in a useEffect with one-time exec
  useState(() => {
    try {
      const storedMessages = localStorage.getItem('aiChatHistory');
      if (storedMessages) {
        const parsedMessages: Message[] = JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp) // Ensure timestamp is a Date object
        }));
        setMessages(parsedMessages);
      }
      const storedConvId = localStorage.getItem('aiChatConversationId');
      if (storedConvId) {
        setCurrentConversationId(storedConvId);
      }
    } catch (e) {
      console.error("Failed to load chat history from localStorage", e);
    }
  });

  const saveChatState = (newMessages: Message[], convId?: string) => {
    localStorage.setItem('aiChatHistory', JSON.stringify(newMessages));
    if (convId) {
      localStorage.setItem('aiChatConversationId', convId);
    }
  };

  const addMessage = useCallback((message: Message, convIdToSave?: string) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, message];
      saveChatState(updatedMessages, convIdToSave || currentConversationId);
      return updatedMessages;
    });
  }, [currentConversationId]);


  const sendMessage = useCallback(async (queryText: string, userId: string) => {
    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: generateUniqueId(),
      text: queryText,
      sender: 'user',
      timestamp: new Date(),
    };
    addMessage(userMessage); // Add user message immediately

    const requestPayload: AIQueryRequest = {
      user_id: userId, // This needs to be sourced from app's auth state
      query_text: queryText,
      conversation_id: currentConversationId,
      context: {
        // Prepare conversation history for the backend (e.g., last N messages)
        conversation_history: messages.slice(-5).map(m => ({ // Send last 5 messages as history
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
        })),
        // ui_location: "TBD_from_app_context" // This would be passed in or obtained globally
      }
    };

    try {
      const aiResponse: AIQueryResponse = await fetchAIResponse(requestPayload);

      const assistantMessage: Message = {
        id: aiResponse.response_id || generateUniqueId(),
        text: aiResponse.assistant_response.text_response,
        sender: 'assistant',
        timestamp: new Date(aiResponse.timestamp),
        // structured_data: aiResponse.assistant_response.structured_data, // For future use
        // sources: aiResponse.assistant_response.sources, // For future use
      };
      addMessage(assistantMessage, aiResponse.conversation_id);

      if (aiResponse.conversation_id && aiResponse.conversation_id !== currentConversationId) {
        setCurrentConversationId(aiResponse.conversation_id);
      }

    } catch (apiError) {
      const err = apiError as AIErrorResponse;
      setError(err);
      // Optionally add a system error message to the chat
      const systemErrorMessage: Message = {
        id: generateUniqueId(),
        text: `Error: ${err.message || 'Failed to get response from assistant.'}`,
        sender: 'system',
        timestamp: new Date(),
      };
      addMessage(systemErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [messages, addMessage, currentConversationId]); // Include currentConversationId in dependencies

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(undefined);
    setError(null);
    localStorage.removeItem('aiChatHistory');
    localStorage.removeItem('aiChatConversationId');
     // Optionally add a system message like "Chat cleared"
    const systemMessage: Message = {
        id: generateUniqueId(),
        text: "Chat history cleared.",
        sender: 'system',
        timestamp: new Date(),
      };
    addMessage(systemMessage);


  }, [addMessage]);


  return {
    messages,
    isLoading,
    error,
    sendMessage,
    currentConversationId,
    clearChat, // Expose clearChat
  };
};
