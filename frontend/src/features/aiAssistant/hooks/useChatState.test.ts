import { renderHook, act } from '@testing-library/react'; // For testing hooks
import { useChatState } from './useChatState';
import * as apiService from '../services/aiAssistantService'; // To mock fetchAIResponse
import { Message } from '../components/MessageList';

// Mock the aiAssistantService
jest.mock('../services/aiAssistantService');
const mockFetchAIResponse = apiService.fetchAIResponse as jest.MockedFunction<typeof apiService.fetchAIResponse>;

describe('useChatState', () => {
  let mockLocalStorage: Record<string, string>;

  beforeEach(() => {
    // Clear mocks and localStorage for each test
    mockFetchAIResponse.mockClear();

    mockLocalStorage = {};
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => mockLocalStorage[key] || null);
    jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((key, value) => {
      mockLocalStorage[key] = value as string;
    });
    jest.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementation((key) => {
      delete mockLocalStorage[key];
    });
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original implementations
  });

  it('initializes with empty messages, no loading, no error, and undefined conversationId', () => {
    const { result } = renderHook(() => useChatState());
    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.currentConversationId).toBeUndefined();
  });

  it('loads messages and conversationId from localStorage on init', () => {
    const storedMessages: Message[] = [
      { id: 's1', text: 'Stored message', sender: 'user', timestamp: new Date() }
    ];
    const storedConvId = 'stored-conv-id';
    mockLocalStorage['aiChatHistory'] = JSON.stringify(storedMessages);
    mockLocalStorage['aiChatConversationId'] = storedConvId;

    const { result } = renderHook(() => useChatState());

    // Need to stringify/parse for timestamp comparison if not exact object
    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].text).toBe('Stored message');
    expect(result.current.currentConversationId).toBe(storedConvId);
  });


  it('sendMessage successfully adds user message, calls API, and adds assistant message', async () => {
    const mockApiResponse: apiService.AIQueryResponse = {
      conversation_id: 'conv-123-new',
      response_id: 'resp-abc',
      assistant_response: { text_response: 'AI says hello!' },
      timestamp: new Date().toISOString(),
    };
    mockFetchAIResponse.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useChatState());

    await act(async () => {
      result.current.sendMessage('User query', 'user-007');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.messages.length).toBe(2);

    const userMsg = result.current.messages[0];
    expect(userMsg.text).toBe('User query');
    expect(userMsg.sender).toBe('user');

    const assistantMsg = result.current.messages[1];
    expect(assistantMsg.text).toBe('AI says hello!');
    expect(assistantMsg.sender).toBe('assistant');
    expect(assistantMsg.id).toBe(mockApiResponse.response_id);

    expect(result.current.currentConversationId).toBe('conv-123-new');
    expect(mockFetchAIResponse).toHaveBeenCalledTimes(1);
    expect(mockFetchAIResponse).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'user-007',
      query_text: 'User query',
      // conversation_id should be undefined initially if not loaded from localStorage
    }));

    // Check localStorage
    expect(JSON.parse(mockLocalStorage['aiChatHistory']).length).toBe(2);
    expect(mockLocalStorage['aiChatConversationId']).toBe('conv-123-new');
  });

  it('sendMessage handles API error and adds system error message', async () => {
    const mockApiError: apiService.AIErrorResponse = {
      error_code: 'API_DOWN',
      message: 'The AI service is unavailable.',
    };
    mockFetchAIResponse.mockRejectedValue(mockApiError);

    const { result } = renderHook(() => useChatState());

    await act(async () => {
      result.current.sendMessage('Another query', 'user-008');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(mockApiError);
    expect(result.current.messages.length).toBe(2); // User message + System error message

    const userMsg = result.current.messages[0];
    expect(userMsg.text).toBe('Another query');
    expect(userMsg.sender).toBe('user');

    const systemErrorMsg = result.current.messages[1];
    expect(systemErrorMsg.sender).toBe('system');
    expect(systemErrorMsg.text).toContain('Error: The AI service is unavailable.');
  });

  it('clearChat clears messages, conversationId, error, and localStorage', async () => {
    // Setup initial state with some messages
    const initialMessages: Message[] = [
        { id: 'm1', text: 'Hello', sender: 'user', timestamp: new Date() }
    ];
    const initialConvId = 'conv-to-clear';
    mockLocalStorage['aiChatHistory'] = JSON.stringify(initialMessages);
    mockLocalStorage['aiChatConversationId'] = initialConvId;

    const { result } = renderHook(() => useChatState(initialMessages, initialConvId));

    // Verify initial state is loaded (optional, but good for sanity)
    // Note: useChatState's useState(() => {...}) for localStorage loading is tricky to test
    // without triggering re-renders directly. For this test, we assume initialMessages are set.
    // To truly test the load-then-clear, the hook would need a re-render after init.
    // For simplicity, we'll assume initialMessages prop sets the state for this test run.
    act(() => {
        result.current.clearChat();
    });

    // Messages should contain only the "Chat history cleared." system message
    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].sender).toBe('system');
    expect(result.current.messages[0].text).toBe('Chat history cleared.');

    expect(result.current.currentConversationId).toBeUndefined();
    expect(result.current.error).toBeNull();

    expect(mockLocalStorage['aiChatHistory']).toBeDefined(); // It now contains the system message
    const storedAfterClear = JSON.parse(mockLocalStorage['aiChatHistory']);
    expect(storedAfterClear.length).toBe(1);
    expect(storedAfterClear[0].text).toBe('Chat history cleared.');

    expect(mockLocalStorage['aiChatConversationId']).toBeUndefined(); // Should be removed
  });

  it('sends conversation history with the API request', async () => {
    const initialMessages: Message[] = [
      { id: 'hist1', text: 'First user message', sender: 'user', timestamp: new Date(Date.now() - 10000) },
      { id: 'hist2', text: 'First AI response', sender: 'assistant', timestamp: new Date(Date.now() - 5000) },
    ];
     mockLocalStorage['aiChatHistory'] = JSON.stringify(initialMessages); // Prime localStorage for loading

    mockFetchAIResponse.mockResolvedValue({ // Dummy success response
      conversation_id: 'conv-hist-test',
      response_id: 'resp-hist-test',
      assistant_response: { text_response: 'Acknowledged history.' },
      timestamp: new Date().toISOString(),
    });

    // Hook will load from localStorage due to `useState` behavior
    const { result, rerender } = renderHook(() => useChatState());

    // Wait for any effects from initial render / localStorage load if they were async (they are sync here)
    // Forcing a re-render can sometimes help if state updates from useEffect are involved
    // act(() => { rerender(); }); // Not strictly needed here as useState init is sync

    await act(async () => {
      result.current.sendMessage('New query with history', 'user-hist-test');
    });

    expect(mockFetchAIResponse).toHaveBeenCalledTimes(1);
    const calledWithPayload = mockFetchAIResponse.mock.calls[0][0] as apiService.AIQueryRequest;

    expect(calledWithPayload.context?.conversation_history).toBeDefined();
    expect(calledWithPayload.context?.conversation_history?.length).toBe(2); // Based on initialMessages
    expect(calledWithPayload.context?.conversation_history?.[0].role).toBe('user');
    expect(calledWithPayload.context?.conversation_history?.[0].content).toBe('First user message');
    expect(calledWithPayload.context?.conversation_history?.[1].role).toBe('assistant');
    expect(calledWithPayload.context?.conversation_history?.[1].content).toBe('First AI response');
  });

  it('sendContextualQuery successfully adds user message, calls API with context, and adds assistant message', async () => {
    const mockApiResponse: apiService.AIQueryResponse = {
      conversation_id: 'conv-ctx-456',
      response_id: 'resp-ctx-def',
      assistant_response: { text_response: 'AI explains contextually!' },
      timestamp: new Date().toISOString(),
    };
    mockFetchAIResponse.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useChatState());
    const contextualQuery = "Explain 'gasLimit'";
    const userId = 'user-ctx-001';
    const context: apiService.RequestContext = {
      ui_location: 'deployment_settings/explain_parameter_gasLimit',
      // field_id: 'gasLimit' // field_id is not explicitly in RequestContext yet, but ui_location implies it
    };

    await act(async () => {
      result.current.sendContextualQuery(contextualQuery, userId, context);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.messages.length).toBe(2); // User (contextual) message + Assistant message

    const userMsg = result.current.messages[0];
    expect(userMsg.text).toBe(contextualQuery);
    expect(userMsg.sender).toBe('user');

    const assistantMsg = result.current.messages[1];
    expect(assistantMsg.text).toBe('AI explains contextually!');
    expect(assistantMsg.sender).toBe('assistant');

    expect(result.current.currentConversationId).toBe('conv-ctx-456');
    expect(mockFetchAIResponse).toHaveBeenCalledTimes(1);
    const calledWithPayload = mockFetchAIResponse.mock.calls[0][0] as apiService.AIQueryRequest;
    expect(calledWithPayload.user_id).toBe(userId);
    expect(calledWithPayload.query_text).toBe(contextualQuery);
    expect(calledWithPayload.context?.ui_location).toBe(context.ui_location);
    // expect(calledWithPayload.context?.field_id).toBe(context.field_id); // If field_id were added to DTO
  });

  it('isAssistantTyping state is handled correctly during sendMessage and sendContextualQuery', async () => {
    mockFetchAIResponse.mockImplementation(async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 50));
      return {
        conversation_id: 'conv-typing-test',
        response_id: 'resp-typing-test',
        assistant_response: { text_response: 'Done typing.' },
        timestamp: new Date().toISOString(),
      };
    });

    const { result } = renderHook(() => useChatState());

    // Test with sendMessage
    let promiseSendMessage = null;
    act(() => {
      promiseSendMessage = result.current.sendMessage('Test typing for send', 'user-typing-1');
      // Immediately after calling, before await, isAssistantTyping should be true
      expect(result.current.isAssistantTyping).toBe(true);
    });
    await act(async () => { await promiseSendMessage; });
    expect(result.current.isAssistantTyping).toBe(false);

    // Reset for next call
    mockFetchAIResponse.mockClear();
    act(() => { result.current.clearChat(); }); // Clear messages and typing state

    // Test with sendContextualQuery
    let promiseSendContextualQuery = null;
    act(() => {
      promiseSendContextualQuery = result.current.sendContextualQuery('Test typing for contextual', 'user-typing-2', {ui_location: 'test'});
      expect(result.current.isAssistantTyping).toBe(true);
    });
    await act(async () => { await promiseSendContextualQuery; });
    expect(result.current.isAssistantTyping).toBe(false);
  });

});
