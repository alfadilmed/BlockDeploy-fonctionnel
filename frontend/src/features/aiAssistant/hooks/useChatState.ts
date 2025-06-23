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
  isAssistantTyping: boolean; // New state for typing indicator
  error: AIErrorResponse | null;
  currentConversationId?: string;
}

// A simple unique ID generator for messages
const generateUniqueId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const useChatState = (initialMessages: Message[] = [], initialConversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Overall loading for user submission
  const [isAssistantTyping, setIsAssistantTyping] = useState<boolean>(false); // Specific for AI "typing"
  const [error, setError] = useState<AIErrorResponse | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(initialConversationId);

  // Load messages from localStorage on init
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
    setIsAssistantTyping(true); // Assistant starts "typing"

    const requestPayload: AIQueryRequest = {
      user_id: userId,
      query_text: queryText,
      conversation_id: currentConversationId,
      context: {
        // Send last 9 previous messages (excluding current user msg, as it's already added to local state)
        // Backend might have different strategy for including current query in its own history/context for LLM
        conversation_history: messages.slice(-10, -1).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
        })),
        // ui_location would be passed from AssistantChatPanel or a context provider
      }
    };

    try {
      const aiResponse: AIQueryResponse = await fetchAIResponse(requestPayload);

      const assistantMessage: Message = {
        id: aiResponse.response_id || generateUniqueId(),
        text: aiResponse.assistant_response.text_response,
        sender: 'assistant',
        timestamp: new Date(aiResponse.timestamp),
        sources: aiResponse.assistant_response.sources, // Pass sources here
      };
      addMessage(assistantMessage, aiResponse.conversation_id);

      if (aiResponse.conversation_id && aiResponse.conversation_id !== currentConversationId) {
        setCurrentConversationId(aiResponse.conversation_id);
      }

    } catch (apiError) {
      const err = apiError as AIErrorResponse;
      setError(err);
      const systemErrorMessage: Message = {
        id: generateUniqueId(),
        text: `Error: ${err.message || 'Failed to get response from assistant.'}`,
        sender: 'system',
        timestamp: new Date(),
      };
      addMessage(systemErrorMessage);
    } finally {
      setIsLoading(false);
      setIsAssistantTyping(false); // Assistant stops "typing"
    }
  }, [messages, addMessage, currentConversationId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(undefined);
    setError(null);
    setIsAssistantTyping(false); // Ensure typing indicator is off
    localStorage.removeItem('aiChatHistory');
    localStorage.removeItem('aiChatConversationId');
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
    isAssistantTyping,
    error,
    sendMessage,
    currentConversationId,
    clearChat,
    sendContextualQuery: useCallback(async (queryText: string, userId: string, context?: Partial<RequestContext>) => {
        setIsLoading(true);
        setError(null);
        const userMessage: Message = {
          id: generateUniqueId(),
          text: queryText,
          sender: 'user',
          timestamp: new Date(),
        };
        addMessage(userMessage);
        setIsAssistantTyping(true);

        const requestPayload: AIQueryRequest = {
          user_id: userId,
          query_text: queryText,
          conversation_id: currentConversationId,
          context: {
            conversation_history: messages.slice(-10, -1).map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            })),
            ui_location: context?.ui_location,
            deployment_id: context?.deployment_id,
            current_configuration: context?.current_configuration,
          }
        };

        try {
          const aiResponse: AIQueryResponse = await fetchAIResponse(requestPayload);
          const assistantMessage: Message = {
            id: aiResponse.response_id || generateUniqueId(),
            text: aiResponse.assistant_response.text_response,
            sender: 'assistant',
            timestamp: new Date(aiResponse.timestamp),
            sources: aiResponse.assistant_response.sources,
            // feedback: null, // Initial feedback state for new assistant messages
          };
          addMessage(assistantMessage, aiResponse.conversation_id);
          if (aiResponse.conversation_id && aiResponse.conversation_id !== currentConversationId) {
            setCurrentConversationId(aiResponse.conversation_id);
          }
        } catch (apiError) {
          const err = apiError as AIErrorResponse;
          setError(err);
          const systemErrorMessage: Message = {
            id: generateUniqueId(),
            text: `Error: ${err.message || 'Failed to get response from assistant.'}`,
            sender: 'system',
            timestamp: new Date(),
          };
          addMessage(systemErrorMessage);
        } finally {
          setIsLoading(false);
          setIsAssistantTyping(false);
        }
    }, [messages, addMessage, currentConversationId]),

    handleMessageFeedback: useCallback((messageId: string, feedbackType: 'like' | 'dislike') => {
      setMessages(prevMessages => {
        const updatedMessages = prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, feedback: feedbackType } : msg
        );
        // Persist updated messages with feedback to localStorage
        saveChatState(updatedMessages, currentConversationId);
        return updatedMessages;
      });
      console.log(`Feedback for message ${messageId}: ${feedbackType}`);
      // In a real application, this feedback would be sent to a backend endpoint.
    }, [currentConversationId]), // Removed `messages` from dependency array as it's part of `setMessages`'s closure
  };
};
