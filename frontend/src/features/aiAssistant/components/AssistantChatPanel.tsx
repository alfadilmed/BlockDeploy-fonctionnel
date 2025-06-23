import React, { CSSProperties, useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChatState } from '../hooks/useChatState'; // Assuming useChatState is primary for M3

// Basic styling for the panel
const panelStyle: CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '350px',
  height: '500px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1000, // Ensure it's above other content
};

const headerStyle: CSSProperties = {
  padding: '10px',
  backgroundColor: '#007bff', // Example header color
  color: 'white',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const contentStyle: CSSProperties = {
  flexGrow: 1,
  padding: '10px',
  overflowY: 'auto', // MessageList will handle its own scroll primarily
  display: 'flex',
  flexDirection: 'column',
};

const inputAreaStyle: CSSProperties = {
  padding: '10px',
  borderTop: '1px solid #eee',
};

const toggleButtonStyle: CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '50%', // Make it circular
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 1001, // Above the panel when closed
    fontSize: '1.5em', // Larger icon/text
};


const AssistantChatPanel: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearChat } = useChatState([]); // Initialize with empty messages
  const [isOpen, setIsOpen] = useState(true); // Panel is open by default

  const handleSendMessage = (messageText: string) => {
    // Replace 'mock_user_id' with actual user ID from auth system
    sendMessage(messageText, 'mock_user_id_123');
  };

  const togglePanel = () => setIsOpen(!isOpen);

  if (!isOpen) {
    return (
        <button onClick={togglePanel} style={toggleButtonStyle} title="Open AI Assistant">
            💬
        </button>
    );
  }

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <span>AI Assistant</span>
        <div>
            <button
                onClick={clearChat}
                title="Clear Chat History"
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginRight: '10px' }}
            >
                🗑️
            </button>
            <button
                onClick={togglePanel}
                title="Close Panel"
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer'}}
            >
                ✖️
            </button>
        </div>
      </div>
      <div style={contentStyle}>
        <MessageList messages={messages} />
        {error && (
          <div style={{ color: 'red', marginTop: '5px', fontSize: '0.9em' }}>
            <strong>Error:</strong> {error.message}
            {error.error_code && ` (Code: ${error.error_code})`}
          </div>
        )}
      </div>
      <div style={inputAreaStyle}>
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AssistantChatPanel;
