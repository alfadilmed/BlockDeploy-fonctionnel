import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageInput from './MessageInput';
// import '@testing-library/jest-dom'; // if not globally configured

describe('MessageInput', () => {
  it('renders an input field and a send button', () => {
    render(<MessageInput onSendMessage={jest.fn()} isLoading={false} />);
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
  });

  it('allows typing in the input field', () => {
    render(<MessageInput onSendMessage={jest.fn()} isLoading={false} />);
    const input = screen.getByPlaceholderText('Type your message...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello there' } });
    expect(input.value).toBe('Hello there');
  });

  it('calls onSendMessage with the input text when form is submitted', () => {
    const mockOnSendMessage = jest.fn();
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    const input = screen.getByPlaceholderText('Type your message...');
    const button = screen.getByRole('button', { name: /Send/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);

    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('clears the input field after sending a message', () => {
    render(<MessageInput onSendMessage={jest.fn()} isLoading={false} />);
    const input = screen.getByPlaceholderText('Type your message...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /Send/i });

    fireEvent.change(input, { target: { value: 'Another message' } });
    fireEvent.click(button);

    expect(input.value).toBe('');
  });

  it('does not call onSendMessage if the input is empty or only whitespace', () => {
    const mockOnSendMessage = jest.fn();
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const button = screen.getByRole('button', { name: /Send/i });

    // Test with empty input
    fireEvent.click(button);
    expect(mockOnSendMessage).not.toHaveBeenCalled();

    // Test with whitespace input
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('disables input and button when isLoading is true', () => {
    render(<MessageInput onSendMessage={jest.fn()} isLoading={true} />);
    const input = screen.getByPlaceholderText('Type your message...');
    const button = screen.getByRole('button', { name: /\.\.\./i }); // Button text changes to "..."

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('shows "..." on button when isLoading is true', () => {
    render(<MessageInput onSendMessage={jest.fn()} isLoading={true} />);
    expect(screen.getByRole('button', { name: /\.\.\./i })).toBeInTheDocument();
  });
});
