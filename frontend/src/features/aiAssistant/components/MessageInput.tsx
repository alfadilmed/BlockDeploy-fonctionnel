// Placeholder for MessageInput component
import React, { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (messageText: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form" style={{ display: 'flex' }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..." // Changed placeholder
        disabled={isLoading}
        style={{ flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginRight: '8px' }}
      />
      <button
        type="submit"
        disabled={isLoading}
        style={{
            padding: '10px 15px',
            backgroundColor: isLoading ? '#ccc' : '#007bff', // Grey out when loading
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'default' : 'pointer'
        }}
      >
        {isLoading ? '...' : 'Send'}
      </button>
    </form>
  );
};

export default MessageInput;
