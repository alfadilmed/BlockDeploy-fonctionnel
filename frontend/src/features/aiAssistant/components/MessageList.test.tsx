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
});

// Helper to setup testing environment if not using CRA or similar that includes jest-dom
// import '@testing-library/jest-dom';
