from typing import Dict, Any, Optional, List

from ..api.v1.schemas import AIQueryRequestDTO, ContextData

class PromptManager:
    """
    Manages the construction of prompts to be sent to the LLM.
    For M1, this is a basic implementation. RAG capabilities will be added later.
    """

    def __init__(self, system_prompt_template: Optional[str] = None):
        self.system_prompt_template = system_prompt_template or self._get_default_system_prompt_template()

    def _get_default_system_prompt_template(self) -> str:
        return """
You are "BlockDeploy AI Assistant", an expert specialized in the configuration of projects on the BlockDeploy platform.
Your mission is to help users create, optimize, and troubleshoot their configurations effectively and securely.
You are precise, factual, and base your answers on the information provided about BlockDeploy.

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
            parts.append(f"- Current configuration provided: {str(context_data.current_configuration)[:200]}...") # Truncate for prompt brevity

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


    def build_prompt(self, request_dto: AIQueryRequestDTO) -> str:
        """
        Constructs the full prompt to be sent to the LLM.
        """
        user_query = request_dto.query_text

        user_context_str = "N/A"
        conversation_history_str = "N/A"

        if request_dto.context:
            user_context_str = self._format_context(request_dto.context)
            if request_dto.context.conversation_history:
                conversation_history_str = self._format_conversation_history(request_dto.context.conversation_history)

        # For M1, system prompt is relatively simple.
        # In M2 (RAG), we will add placeholders for retrieved_documentation_chunks.
        system_part = self.system_prompt_template.format(
            user_context_str=user_context_str,
            conversation_history_str=conversation_history_str
        )

        full_prompt = f"{system_part.strip()}\n\nUser Query: {user_query}"

        # Basic sanitization/validation (can be expanded in M3 Prompt Security document)
        if len(full_prompt) > 8000: # Arbitrary limit, LLMs have token limits
            # In a real scenario, might truncate parts of context or history
            print(f"Warning: Prompt is very long ({len(full_prompt)} chars). May exceed LLM token limits.")
            # For now, just a warning.

        return full_prompt

# Example usage:
# if __name__ == "__main__":
#     pm = PromptManager()
#     mock_context_with_history = ContextData(
#         ui_location="project_settings/deployment_x",
#         conversation_history=[
#             {"role": "user", "content": "Hello assistant!"},
#             {"role": "assistant", "content": "Hello! How can I help you today?"}
#         ]
#     )
#     mock_request = AIQueryRequestDTO(
#         user_id="test_user_123",
#         query_text="How do I set up a custom domain?",
#         context=mock_context_with_history
#     )
#     prompt = pm.build_prompt(mock_request)
#     print("----- Generated Prompt -----")
#     print(prompt)

#     mock_request_no_context = AIQueryRequestDTO(
#         user_id="test_user_456",
#         query_text="What is BlockDeploy?"
#     )
#     prompt_no_context = pm.build_prompt(mock_request_no_context)
#     print("\n----- Generated Prompt (No Context) -----")
#     print(prompt_no_context)
