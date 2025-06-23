// Barrel file for easier imports of AI Assistant features

import AssistantChatPanel from './components/AssistantChatPanel';
// Export other components, hooks, services, types as they are developed

export { AssistantChatPanel };

// Types can also be re-exported if needed by consumers of this feature module
export type { Message as AIChatMessage } from './components/MessageList';
export type {
    AIQueryRequest as AIQueryRequestPayload,
    AIQueryResponse as AIQueryResponseData,
    AIErrorResponse as AIChatError
} from './services/aiAssistantService';
export type { ChatState as AIChatState } from './hooks/useChatState'; // If using the hook directly
// If using Zustand store:
// export { useChatStore } from './store/chatStore';
