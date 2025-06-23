import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom'; // if not globally configured

import AssistantChatPanel from './AssistantChatPanel';
import * as useChatStateHook from '../hooks/useChatState'; // To mock useChatState
import * as aiService from '../services/aiAssistantService'; // To potentially mock service if hook doesn't cover all

// Mock the useChatState hook
const mockSendMessage = jest.fn();
const mockClearChat = jest.fn();

const mockUseChatState = useChatStateHook.useChatState as jest.MockedFunction<typeof useChatStateHook.useChatState>;

jest.mock('../hooks/useChatState', () => ({
  useChatState: jest.fn(),
}));


describe('AssistantChatPanel', () => {
  beforeEach(() => {
    // Reset mocks for each test
    mockSendMessage.mockClear();
    mockClearChat.mockClear();
    mockUseChatState.mockReturnValue({
      messages: [],
      isLoading: false,
      error: null,
      sendMessage: mockSendMessage,
      currentConversationId: undefined,
      clearChat: mockClearChat,
    });
  });

  it('renders correctly when open', () => {
    render(<AssistantChatPanel />);
    expect(screen.getByText('AI Assistant')).toBeInTheDocument(); // Header
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument(); // Input
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    expect(screen.getByTitle('Clear Chat History')).toBeInTheDocument();
    expect(screen.getByTitle('Close Panel')).toBeInTheDocument();
  });

  it('toggles panel visibility', () => {
    render(<AssistantChatPanel />);

    // Initially open
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    const closeButton = screen.getByTitle('Close Panel');
    fireEvent.click(closeButton);

    // Now closed, only toggle button should be visible
    expect(screen.queryByText('AI Assistant')).not.toBeInTheDocument();
    const openButton = screen.getByTitle('Open AI Assistant');
    expect(openButton).toBeInTheDocument();
    expect(openButton).toHaveTextContent('💬');

    // Reopen
    fireEvent.click(openButton);
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  });

  it('calls sendMessage when a message is submitted', () => {
    render(<AssistantChatPanel />);
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    fireEvent.change(input, { target: { value: 'Test query from panel' } });
    fireEvent.click(sendButton);

    expect(mockSendMessage).toHaveBeenCalledWith('Test query from panel', 'mock_user_id_123');
  });

  it('displays messages from useChatState', () => {
    const testMessages = [
      { id: 'm1', text: 'User says hi', sender: 'user' as const, timestamp: new Date() },
      { id: 'm2', text: 'AI says hello', sender: 'assistant' as const, timestamp: new Date() },
    ];
    mockUseChatState.mockReturnValue({
      messages: testMessages,
      isLoading: false,
      error: null,
      sendMessage: mockSendMessage,
      currentConversationId: 'conv1',
      clearChat: mockClearChat,
    });

    render(<AssistantChatPanel />);
    expect(screen.getByText('User says hi')).toBeInTheDocument();
    expect(screen.getByText('AI says hello')).toBeInTheDocument();
  });

  it('displays error message from useChatState', () => {
    const testError: aiService.AIErrorResponse = {
      error_code: 'TEST_ERROR',
      message: 'This is a test error message.',
    };
    mockUseChatState.mockReturnValue({
      messages: [],
      isLoading: false,
      error: testError,
      sendMessage: mockSendMessage,
      currentConversationId: undefined,
      clearChat: mockClearChat,
    });

    render(<AssistantChatPanel />);
    expect(screen.getByText('Error:')).toBeInTheDocument();
    expect(screen.getByText(testError.message)).toBeInTheDocument();
    expect(screen.getByText(`(Code: ${testError.error_code})`)).toBeInTheDocument();
  });

  it('calls clearChat when clear chat button is clicked', () => {
    render(<AssistantChatPanel />);
    const clearButton = screen.getByTitle('Clear Chat History');
    fireEvent.click(clearButton);
    expect(mockClearChat).toHaveBeenCalledTimes(1);
  });

  it('MessageInput is disabled when isLoading is true', () => {
    mockUseChatState.mockReturnValue({
      messages: [],
      isLoading: true, // Set isLoading to true
      error: null,
      sendMessage: mockSendMessage,
      currentConversationId: undefined,
      clearChat: mockClearChat,
    });

    render(<AssistantChatPanel />);
    expect(screen.getByPlaceholderText('Type your message...')).toBeDisabled();
    expect(screen.getByRole('button', { name: '...' })).toBeDisabled(); // Text changes to "..."
  });

});
