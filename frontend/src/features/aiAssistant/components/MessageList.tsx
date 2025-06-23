// Placeholder for MessageList component
import React from 'react';

// Define a basic Message type for now, will be refined
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  type?: 'text' | 'code' | 'suggestion'; // For future extensibility
  // Add other relevant fields like structured_data for assistant messages
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  if (!messages || messages.length === 0) {
    // Adjusted the initial message for better UX within the panel context
    return <div style={{ textAlign: 'center', color: '#777', marginTop: '20px' }}>Send a message to start the conversation.</div>;
  }

  return (
    // Added flexGrow to take available space, adjusted padding and border for better integration in AssistantChatPanel
    <div className="message-list" style={{ flexGrow: 1, overflowY: 'auto', padding: '0 10px 10px 10px', border: '0px solid #eee' }}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message-item message-sender-${msg.sender}`}
          style={{
            marginBottom: '10px',
            padding: '8px 12px',
            borderRadius: '10px',
            maxWidth: '85%',
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === 'user' ? '#007bff' : (msg.sender === 'assistant' ? '#e9ecef' : '#fff3cd'),
            color: msg.sender === 'user' ? 'white' : '#333',
            // Simple chat bubble effect
            position: 'relative',
            wordBreak: 'break-word',
          }}
        >
          {/* Optional: Sender name if not visually distinct enough by alignment/color */}
          {/* <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '0.8em', color: msg.sender === 'user' ? '#cce5ff' : '#6c757d' }}>
            {msg.sender.charAt(0).toUpperCase() + msg.sender.slice(1)}
          </div> */}
          <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
          <div
            style={{
              fontSize: '0.7em',
              color: msg.sender === 'user' ? '#cce5ff' : '#6c757d',
              textAlign: 'right',
              marginTop: '4px'
            }}
          >
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
