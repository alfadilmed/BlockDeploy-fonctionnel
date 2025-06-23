import React from 'react';
import { AISource } from '../services/aiAssistantService'; // Import AISource type

// Define a basic Message type for now, will be refined
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  type?: 'text' | 'code' | 'suggestion'; // For future extensibility
  sources?: AISource[]; // New field for sources
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
            backgroundColor: msg.sender === 'user' ? '#007bff' :
                             (msg.sender === 'assistant' ? '#e9ecef' :
                             (msg.text.toLowerCase().startsWith("error:") ? '#f8d7da' : '#fff3cd')), // Rouge clair pour erreurs système
            color: msg.sender === 'user' ? 'white' :
                   (msg.text.toLowerCase().startsWith("error:") ? '#721c24' : '#333'), // Couleur de texte foncée pour erreurs
            // Simple chat bubble effect
            position: 'relative',
            wordBreak: 'break-word',
          }}
        >
          <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
          {msg.sender === 'assistant' && msg.sources && msg.sources.length > 0 && (
            <div className="message-sources" style={{ marginTop: '8px', fontSize: '0.8em', opacity: 0.8 }}>
              <strong style={{ display: 'block', marginBottom: '3px' }}>Sources:</strong>
              <ul style={{ listStyleType: 'decimal', paddingLeft: '20px', margin: 0 }}>
                {msg.sources.map((source, index) => (
                  <li key={index} style={{ marginBottom: '2px' }}>
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={source.content_snippet || source.name}
                        style={{ color: msg.sender === 'user' ? 'white' : '#0056b3' }} // Ensure link color contrasts
                      >
                        {source.name || source.url}
                      </a>
                    ) : (
                      <span title={source.content_snippet || undefined}>{source.name || 'Unknown source'}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div
            style={{
              fontSize: '0.7em',
              color: msg.sender === 'user' ? '#cce5ff' : (msg.text.toLowerCase().startsWith("error:") ? '#b71c1c' : '#6c757d'), // Darker red for error time
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
