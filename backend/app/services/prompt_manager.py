from typing import Dict, Any, Optional, List

from ..api.v1.schemas import AIQueryRequestDTO, ContextData
from .rag_processor import RAGProcessor # Import RAGProcessor

class PromptManager:
    """
    Manages the construction of prompts to be sent to the LLM.
    Integrates RAG to fetch relevant context from documentation.
    """

    def __init__(
        self,
        rag_processor: Optional[RAGProcessor] = None, # Inject RAGProcessor
        system_prompt_template: Optional[str] = None
    ):
        self.rag_processor = rag_processor
        self.system_prompt_template = system_prompt_template or self._get_default_system_prompt_template()

    def _get_default_system_prompt_template(self) -> str:
        # Updated template to include RAG context
        return """
You are "BlockDeploy AI Assistant", an expert specialized in the configuration of projects on the BlockDeploy platform.
Your mission is to help users create, optimize, and troubleshoot their configurations effectively and securely.
You are precise, factual, and base your answers on the information provided about BlockDeploy.

Use the following context from the BlockDeploy documentation to answer the user's query.
If the context does not contain the answer, state that the information is not found in the provided documents.
Do not make up information outside of the provided context.

Retrieved Documentation Context:
---
{retrieved_docs_str}
---

Current user context (if any):
{user_context_str}

Conversation history (if any):
{conversation_history_str}

Please respond to the following user query:
"""

    def _format_context(self, context_data: Optional[ContextData]) -> str:
        if not context_data:
            return "No specific context provided for this query."

        parts = []
        if context_data.ui_location:
            parts.append(f"- User is currently at: {context_data.ui_location}")
        if context_data.deployment_id:
            parts.append(f"- Current deployment ID: {context_data.deployment_id}")
        if context_data.current_configuration:
            parts.append(f"- Current configuration provided: {str(context_data.current_configuration)[:200]}...")

        return "\n".join(parts) if parts else "No specific UI/deployment context provided."

    def _format_conversation_history(self, history: Optional[List[Dict[str, str]]]) -> str:
        if not history:
            return "No conversation history provided."

        formatted_history = []
        for entry in history:
            role = entry.get("role", "unknown")
            content = entry.get("content", "")
            formatted_history.append(f"{role.capitalize()}: {content}")
        return "\n".join(formatted_history)

    def _format_retrieved_documents(self, documents: List[Dict[str, Any]]) -> str:
        if not documents:
            return "No relevant documents found in the knowledge base."

        formatted_docs = []
        for i, doc in enumerate(documents):
            # Ensure 'text' and 'source' keys exist, provide defaults if not
            text_snippet = doc.get('text', 'Content not available')[:500] # Truncate for prompt length
            source = doc.get('source', 'Unknown source')
            score = doc.get('score', 0.0) # Assuming score is available
            formatted_docs.append(f"Document {i+1} (Source: {source}, Relevance Score: {score:.4f}):\n{text_snippet}\n---")
        return "\n".join(formatted_docs)

    def build_prompt(self, request_dto: AIQueryRequestDTO) -> str:
        """
        Constructs the full prompt to be sent to the LLM, including RAG context.
        """
        user_query = request_dto.query_text

        retrieved_docs_str = "N/A (RAG not available or no documents found)"
        if self.rag_processor:
            try:
                # Use user_query to fetch relevant documents
                relevant_docs = self.rag_processor.search_similar_documents(user_query, k=3) # Fetch top 3 docs
                if relevant_docs:
                    retrieved_docs_str = self._format_retrieved_documents(relevant_docs)
                else:
                    retrieved_docs_str = "No relevant documents found in the knowledge base for this query."
            except Exception as e:
                print(f"Error during RAG document retrieval: {e}")
                retrieved_docs_str = "Error retrieving documents from knowledge base."

        user_context_str = "N/A"
        conversation_history_str = "N/A"

        if request_dto.context:
            user_context_str = self._format_context(request_dto.context)
            if request_dto.context.conversation_history:
                conversation_history_str = self._format_conversation_history(request_dto.context.conversation_history)

        system_part = self.system_prompt_template.format(
            retrieved_docs_str=retrieved_docs_str, # Add RAG context
            user_context_str=user_context_str,
            conversation_history_str=conversation_history_str
        ).strip() # Ensure leading/trailing whitespace from template is removed

        full_prompt = f"{system_part}\n\nUser Query: {user_query}"

        # Basic length check (can be more sophisticated based on token limits)
        # This is a very rough estimate; actual tokenization depends on the LLM.
        # A better approach would be to use the LLM's tokenizer if available.
        estimated_chars_limit = 12000 # Roughly 3000-4000 tokens for some models
        if len(full_prompt) > estimated_chars_limit:
            print(f"Warning: Prompt is very long ({len(full_prompt)} chars). May exceed LLM token limits.")
            # Consider truncating less important parts (e.g., older history, less relevant docs)
            # For now, just a warning.

        # print(f"DEBUG: Full prompt being sent to LLM:\n{full_prompt[:1000]}...") # For debugging
        return full_prompt

# Example usage:
# if __name__ == "__main__":
#     # This example assumes you have a FAISS index built by scripts/index_documentation.py
#     # and the RAGProcessor can load it.
#     try:
#         rag_proc_instance = RAGProcessor() # Loads default index
#         if rag_proc_instance.index is None or not rag_proc_instance.document_chunks:
#             print("RAG Processor could not load index. Run scripts/index_documentation.py first.")
#             rag_proc_instance = None # Ensure it's None if not loaded
#     except Exception as e:
#         print(f"Failed to initialize RAGProcessor: {e}")
#         rag_proc_instance = None

#     pm = PromptManager(rag_processor=rag_proc_instance)

#     mock_context_with_history = ContextData(
#         ui_location="project_settings/deployment_x",
#         conversation_history=[
#             {"role": "user", "content": "Hello assistant!"},
#             {"role": "assistant", "content": "Hello! How can I help you today?"}
#         ]
#     )
#     mock_request = AIQueryRequestDTO(
#         user_id="test_user_123",
#         query_text="How do I set up an AI Assistant for BlockDeploy?", # Query that should hit our docs
#         context=mock_context_with_history
#     )
#     prompt = pm.build_prompt(mock_request)
#     print("----- Generated Prompt with RAG -----")
#     print(prompt)

#     mock_request_no_rag = AIQueryRequestDTO(
#         user_id="test_user_456",
#         query_text="What is the capital of France?" # Query unlikely to be in our docs
#     )
#     pm_no_rag = PromptManager(rag_processor=None) # Test without RAG
#     prompt_no_rag = pm_no_rag.build_prompt(mock_request_no_rag)
#     print("\n----- Generated Prompt (No RAG Processor) -----")
#     print(prompt_no_rag)

#     if rag_proc_instance:
#         mock_request_specific_rag = AIQueryRequestDTO(
#             user_id="test_user_789",
#             query_text="What are the DTOs for the AI Assistant API query endpoint?"
#         )
#         prompt_specific_rag = pm.build_prompt(mock_request_specific_rag)
#         print("\n----- Generated Prompt (Specific RAG Query) -----")
#         print(prompt_specific_rag)
