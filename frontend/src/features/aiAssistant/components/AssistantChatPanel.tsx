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


import { RequestContext } from '../services/aiAssistantService'; // Import RequestContext

const AssistantChatPanel: React.FC = () => {
const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    isAssistantTyping,
    sendContextualQuery, // Get the new function from the hook
    handleMessageFeedback // Get the feedback handler
} = useChatState([]);

  const [isOpen, setIsOpen] = useState(true); // Panel is open by default

  const handleSendMessage = (messageText: string) => {
    sendMessage(messageText, 'mock_user_id_123'); // Replace mock_user_id
  };

  const togglePanel = () => setIsOpen(!isOpen);

  // Function to be called by external components (like MockConfigPage)
  // This could be exposed via a React Context or a global event bus if AssistantChatPanel
  // is not a direct parent/prop-driller. For now, let's assume it can be called.
  // To make this truly work, AssistantChatPanel or useChatState would need to be
  // accessible globally or through a shared context.
  // For this M4, we'll simulate the call for demonstration within a hypothetical parent.
  // A more robust solution would use a state manager like Zustand or Redux for global actions.

  // Let's refine this: MockConfigPage will call a prop, and the App root component
  // would orchestrate opening the panel and sending the contextual query.
  // So, AssistantChatPanel itself doesn't need to expose a global function directly,
  // but it needs to be controllable via props if we want to pre-fill/auto-send.

  // For now, let's assume a simplified prop `initialQueryContext` for demonstration
  // if the panel is being opened with a contextual query.
  // This part of the interaction logic will need careful design based on the actual app structure.

  // Let's modify `handleContextualHelp` in the (hypothetical) parent component
  // that renders both MockConfigPage and AssistantChatPanel.
  // The parent would then manage opening the panel and passing the query.

  // To demonstrate pre-filling if the panel is opened by such an action:
  // We can add a prop to AssistantChatPanel: `initialContextualQuery?: { query: string, context: RequestContext }`
  // And a useEffect to send it if present on mount or prop change.
  // This is getting complex for a direct prop. A global event or state manager is better.

  // Simpler for M4: MockConfigPage will call `sendContextualQuery` directly from the hook
  // if the hook is provided through a context. For now, we'll assume `MockConfigPage`
  // somehow gets access to `sendContextualQuery`. The `AssistantChatPanel` already uses it.
  // The `onContextualHelpClick` in `MockConfigPage` will now directly use `sendContextualQuery`.
  // This means `useChatState` needs to be available where `MockConfigPage` can access it.
  // This implies `useChatState` might be better lifted to a shared context.

  // Let's assume for this step that `AssistantChatPanel` can receive a command to open
  // and send a contextual query. This is more about demonstrating the UI and flow.
  // We'll add a function to the hook and panel to trigger this.

  const handleContextualQuery = (query: string, ui_location: string, field_id?: string) => {
    if (!isOpen) {
      setIsOpen(true); // Open the panel if it's closed
    }
    // User ID should come from auth
    sendContextualQuery(query, 'mock_user_id_contextual', { ui_location, field_id });
  };

  // If AssistantChatPanel were part of a larger app structure,
  // MockConfigPage would call a function passed down from a common ancestor,
  // which in turn calls handleContextualQuery or interacts with a global state/context.
  // For now, to make MockConfigPage work with this, we'd need to lift state or use Context API.

  // Let's imagine App.tsx:
  // const chatState = useChatState();
  // <MockConfigPage onContextualHelpClick={(query, loc, id) => {
  //   if (!chatState.isOpen) chatState.setIsOpen(true); // Requires setIsOpen in hook
  //   chatState.sendContextualQuery(query, 'user123', {ui_location: loc, field_id: id});
  // }} />
  // <AssistantChatPanel chatState={chatState} />
  // This requires major refactor of useChatState and AssistantChatPanel to accept state as prop.
  // Alternative: Export sendContextualQuery from a context.

  // For this step, we'll assume MockConfigPage is rendered inside something that
  // also renders AssistantChatPanel and can call `handleContextualQuery`.
  // Or, we can pass `handleContextualQuery` TO `MockConfigPage`. This is simpler.
  // The current structure of MockConfigPage already takes `onContextualHelpClick`.
  // So, in the parent component that renders both:
  // <MockConfigPage onContextualHelpClick={chatPanelRef.current?.handleContextualQuery} />
  // <AssistantChatPanel ref={chatPanelRef} />
  // This requires using `useImperativeHandle` in AssistantChatPanel.

  // Let's simplify: the `handleContextualQuery` is not part of this component directly,
  // but `sendContextualQuery` from the hook IS used. The `MockConfigPage` will need access to that.
  // The current `AssistantChatPanel` already uses `sendMessage` from the hook.
  // The key is that `sendContextualQuery` in the hook now takes a `context` object.
  // And `MockConfigPage` will call `sendContextualQuery` with this context.
  // The panel itself doesn't need much change other than consuming `isAssistantTyping`.

  // The `handleSendMessage` is for user typed messages.
  // Contextual help will use `sendContextualQuery` from the hook, likely triggered
  // by an action outside the input field of this panel.
  // The `MockConfigPage` demonstrates this by calling `onContextualHelpClick` prop.
  // The component that renders `MockConfigPage` and `AssistantChatPanel` would orchestrate.
  // For example, in a hypothetical `App.tsx`:
  // const { sendContextualQuery, /* other chat state */ } = useChatState();
  // const handleHelp = (query, loc, id) => { /* open panel if needed */ sendContextualQuery(query, 'user', {ui_location: loc, field_id: id})};
  // return <> <MockConfigPage onContextualHelpClick={handleHelp} /> <AssistantChatPanel /> </>

  // The `AssistantChatPanel` itself does not need to change much for this specific part of "receiving" contextual help,
  // as `useChatState` handles the logic. The main change was adding `sendContextualQuery` to the hook.
  // The `MockConfigPage`'s `onContextualHelpClick` is the trigger.
  // The only direct change to AssistantChatPanel was consuming `isAssistantTyping`.
  // The crucial part is that `AIQueryRequestDTO.context` in `useChatState.sendContextualQuery`
  // now includes `ui_location` and potentially `field_id`.
  // And the `PromptManager` backend was updated to use this.
  // So, the connection is: MockConfigPage -> (callback) -> useChatState.sendContextualQuery -> Backend.
  // No direct change to AssistantChatPanel's own methods for this, other than it uses the updated hook.
  // The `handleSendMessage` here is for messages typed by the user into THIS panel's input.
  // Contextual help bypasses this panel's input field initially.

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
        <MessageList messages={messages} onMessageFeedback={handleMessageFeedback} />
        {isAssistantTyping && (
          <div style={{ fontStyle: 'italic', color: '#555', padding: '5px 0 0 10px', fontSize: '0.9em' }}>
            Assistant is typing...
          </div>
        )}
        {/* Display general API error here only if not typing and error exists.
            If there's an error during typing, it's likely already added as a system message.
            This specific error display is for errors that prevent even starting the typing.
        */}
        {error && !isLoading && !isAssistantTyping && (
          <div style={{ color: 'red', marginTop: '5px', padding: '0 10px', fontSize: '0.9em', textAlign: 'center' }}>
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
