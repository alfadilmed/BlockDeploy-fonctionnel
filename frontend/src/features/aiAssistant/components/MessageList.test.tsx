import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageList, { Message } from './MessageList';

// Mockup console.error to avoid noise from React for deliberate error cases if any
// beforeEach(() => {
//   jest.spyOn(console, 'error').mockImplementation(jest.fn());
// });

describe('MessageList', () => {
  const sampleMessages: Message[] = [
    { id: '1', text: 'Hello User!', sender: 'assistant', timestamp: new Date() },
    { id: '2', text: 'Hi Assistant!', sender: 'user', timestamp: new Date() },
    { id: '3', text: 'System update.', sender: 'system', timestamp: new Date() },
  ];

  it('renders "Send a message to start" when messages array is empty', () => {
    render(<MessageList messages={[]} />);
    expect(screen.getByText('Send a message to start the conversation.')).toBeInTheDocument();
  });

  it('renders "Send a message to start" when messages prop is undefined', () => {
    // @ts-expect-error Testing undefined prop explicitly
    render(<MessageList messages={undefined} />);
    expect(screen.getByText('Send a message to start the conversation.')).toBeInTheDocument();
  });


  it('renders a list of messages correctly', () => {
    render(<MessageList messages={sampleMessages} />);

    expect(screen.getByText('Hello User!')).toBeInTheDocument();
    expect(screen.getByText('Hi Assistant!')).toBeInTheDocument();
    expect(screen.getByText('System update.')).toBeInTheDocument();

    // Check sender labels (optional, as they are visually implied by style now)
    // For this, we might need to add data-testid or check class names
    const messageItems = screen.getAllByText(/User!|Assistant!|update./i).map(el => el.closest('.message-item'));
    expect(messageItems[0]).toHaveClass('message-sender-assistant');
    expect(messageItems[1]).toHaveClass('message-sender-user');
    expect(messageItems[2]).toHaveClass('message-sender-system');


    // Check if timestamps are rendered (presence of time string)
    const timeRegex = /\d{1,2}:\d{2}\s*(AM|PM)?/i; // Basic time regex
    const times = screen.getAllByText(timeRegex);
    expect(times.length).toBe(sampleMessages.length);
  });

  it('applies correct styling classes for sender', () => {
    render(<MessageList messages={sampleMessages} />);
    const assistantMessage = screen.getByText('Hello User!').closest('div.message-item');
    const userMessage = screen.getByText('Hi Assistant!').closest('div.message-item');
    const systemMessage = screen.getByText('System update.').closest('div.message-item');

    expect(assistantMessage).toHaveClass('message-sender-assistant');
    expect(userMessage).toHaveClass('message-sender-user');
    expect(systemMessage).toHaveClass('message-sender-system');
  });

  it('renders feedback buttons for assistant messages if onMessageFeedback is provided', () => {
    const mockOnFeedback = jest.fn();
    const messagesWithAssistant: Message[] = [
      { id: 'a1', text: 'AI response', sender: 'assistant', timestamp: new Date() }
    ];
    render(<MessageList messages={messagesWithAssistant} onMessageFeedback={mockOnFeedback} />);

    expect(screen.getByTitle('Good response')).toBeInTheDocument();
    expect(screen.getByTitle('Bad response')).toBeInTheDocument();
  });

  it('does not render feedback buttons for user or system messages', () => {
    const mockOnFeedback = jest.fn();
    const messagesNonUser: Message[] = [
      { id: 'u1', text: 'User question', sender: 'user', timestamp: new Date() },
      { id: 's1', text: 'System info', sender: 'system', timestamp: new Date() }
    ];
    render(<MessageList messages={messagesNonUser} onMessageFeedback={mockOnFeedback} />);

    expect(screen.queryByTitle('Good response')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Bad response')).not.toBeInTheDocument();
  });

  it('calls onMessageFeedback with "like" when like button is clicked', () => {
    const mockOnFeedback = jest.fn();
    const assistantMessageId = 'a1';
    const messages: Message[] = [
      { id: assistantMessageId, text: 'Helpful AI response', sender: 'assistant', timestamp: new Date() }
    ];
    render(<MessageList messages={messages} onMessageFeedback={mockOnFeedback} />);

    const likeButton = screen.getByTitle('Good response');
    fireEvent.click(likeButton);

    expect(mockOnFeedback).toHaveBeenCalledWith(assistantMessageId, 'like');
  });

  it('calls onMessageFeedback with "dislike" when dislike button is clicked', () => {
    const mockOnFeedback = jest.fn();
    const assistantMessageId = 'a1';
    const messages: Message[] = [
      { id: assistantMessageId, text: 'Unhelpful AI response', sender: 'assistant', timestamp: new Date() }
    ];
    render(<MessageList messages={messages} onMessageFeedback={mockOnFeedback} />);

    const dislikeButton = screen.getByTitle('Bad response');
    fireEvent.click(dislikeButton);

    expect(mockOnFeedback).toHaveBeenCalledWith(assistantMessageId, 'dislike');
  });

  it('feedback buttons change color if feedback is set on message', () => {
    const messages: Message[] = [
      { id: 'a1', text: 'Liked response', sender: 'assistant', timestamp: new Date(), feedback: 'like' },
      { id: 'a2', text: 'Disliked response', sender: 'assistant', timestamp: new Date(), feedback: 'dislike' }
    ];
    render(<MessageList messages={messages} onMessageFeedback={jest.fn()} />);

    // For "Liked response"
    const likedMessageButtons = screen.getByText('Liked response').parentElement?.querySelector('.message-feedback');
    expect(likedMessageButtons?.querySelector('button[title="Good response"]')).toHaveStyle('color: green');
    expect(likedMessageButtons?.querySelector('button[title="Bad response"]')).toHaveStyle('color: grey');

    // For "Disliked response"
    const dislikedMessageButtons = screen.getByText('Disliked response').parentElement?.querySelector('.message-feedback');
    expect(dislikedMessageButtons?.querySelector('button[title="Good response"]')).toHaveStyle('color: grey');
    expect(dislikedMessageButtons?.querySelector('button[title="Bad response"]')).toHaveStyle('color: red');
  });
});

// Helper to setup testing environment if not using CRA or similar that includes jest-dom
// import '@testing-library/jest-dom';
