from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import asyncio # For simulating async behavior

from ..core.config import settings
# AIQueryRequestDTO will be used by PromptManager which then passes simpler structures to LLMService
# from ..api.v1.schemas import AIQueryRequestDTO, LLMOptionsData

class LLMServiceError(Exception):
    """Custom exception for LLM service errors."""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class BaseLLMService(ABC):
    @abstractmethod
    async def generate_response(
        self,
        prompt: str,
        llm_options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generates a response from the LLM based on the given prompt and options.

        Args:
            prompt: The complete prompt string to send to the LLM.
            llm_options: A dictionary of options for the LLM (e.g., model, temperature, max_tokens).

        Returns:
            A dictionary containing the LLM's response, typically including text and other metadata.

        Raises:
            LLMServiceError: If an error occurs during LLM interaction.
        """
        pass

class MockLLMService(BaseLLMService):
    async def generate_response(
        self,
        prompt: str,
        llm_options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Simulates a response from an LLM.
        For M1, this will return a fixed, generic response.
        """
        print(f"MockLLMService received prompt (first 100 chars): {prompt[:100]}...")
        if llm_options:
            print(f"MockLLMService received options: {llm_options}")

        # Simulate network latency
        await asyncio.sleep(0.5)

        # Simulate different responses based on prompt content for basic testing
        if "error" in prompt.lower():
            raise LLMServiceError("Simulated LLM error: The prompt contained 'error'.", status_code=503)

        if "long" in prompt.lower():
            text_response = "This is a simulated long response from the Mock LLM. " * 20
        elif "code" in prompt.lower():
            text_response = "Here's some mock code:\n```python\ndef hello():\n  print('Hello from Mock LLM!')\nhello()\n```"
        else:
            text_response = f"This is a mock response to the prompt: '{prompt.splitlines()[-1][:50]}...'"


        return {
            "text_response": text_response,
            "structured_data": {"mock_key": "mock_value", "prompt_length": len(prompt)},
            "confidence_score": 0.95,
            "model_used": llm_options.get("model", settings.LLM_DEFAULT_MODEL) if llm_options else settings.LLM_DEFAULT_MODEL,
            "usage": {"prompt_tokens": len(prompt.split()), "completion_tokens": len(text_response.split()), "total_tokens": len(prompt.split()) + len(text_response.split())}
        }

class OpenAILLMService(BaseLLMService): # Placeholder for future implementation
    def __init__(self, api_key: str):
        self.api_key = api_key
        # Initialize OpenAI client here
        # from openai import AsyncOpenAI
        # self.client = AsyncOpenAI(api_key=self.api_key)
        if not self.api_key:
            raise ValueError("OpenAI API key is required for OpenAILLMService.")

    async def generate_response(
        self,
        prompt: str,
        llm_options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        # Actual OpenAI API call logic will go here in a future milestone
        # For now, it can also return a mock response or raise NotImplementedError
        print(f"OpenAILLMService called (ACTUAL IMPLEMENTATION PENDING) for model {llm_options.get('model') if llm_options else 'default'}")
        # Simulate a simple response for now if we want to test selection
        await asyncio.sleep(0.1)
        return {
            "text_response": f"OpenAI (simulated) response to: {prompt.splitlines()[-1][:50]}...",
            "model_used": llm_options.get("model", "gpt-3.5-turbo") if llm_options else "gpt-3.5-turbo",
        }

class GeminiLLMService(BaseLLMService): # Placeholder for future implementation
    def __init__(self, api_key: str):
        self.api_key = api_key
        # Initialize Gemini client here
        # import google.generativeai as genai
        # genai.configure(api_key=api_key)
        if not self.api_key:
            raise ValueError("Gemini API key is required for GeminiLLMService.")

    async def generate_response(
        self,
        prompt: str,
        llm_options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        # Actual Gemini API call logic will go here in a future milestone
        print(f"GeminiLLMService called (ACTUAL IMPLEMENTATION PENDING) for model {llm_options.get('model') if llm_options else 'default'}")
        await asyncio.sleep(0.1)
        return {
            "text_response": f"Gemini (simulated) response to: {prompt.splitlines()[-1][:50]}...",
            "model_used": llm_options.get("model", "gemini-pro") if llm_options else "gemini-pro",
        }


# Factory function to get the configured LLM service
def get_llm_service() -> BaseLLMService:
    provider = settings.LLM_PROVIDER.lower()
    api_key = settings.LLM_API_KEY

    if provider == "openai":
        if not api_key:
            # Fallback to mock if API key is missing, log a warning
            print("Warning: OpenAI provider selected but no API key found. Falling back to MockLLMService.")
            return MockLLMService()
        # return OpenAILLMService(api_key=api_key) # Uncomment when ready to implement
        print("Info: OpenAILLMService selected, but using MockLLMService for M1.")
        return MockLLMService() # For M1, always return mock even if config is OpenAI
    elif provider == "gemini":
        if not api_key:
            print("Warning: Gemini provider selected but no API key found. Falling back to MockLLMService.")
            return MockLLMService()
        # return GeminiLLMService(api_key=api_key) # Uncomment when ready to implement
        print("Info: GeminiLLMService selected, but using MockLLMService for M1.")
        return MockLLMService() # For M1, always return mock
    elif provider == "mock":
        return MockLLMService()
    else:
        raise ValueError(f"Unsupported LLM provider: {provider}. Supported: openai, gemini, mock.")

# Example of how to use it (optional, for direct testing of this file)
# async def main():
#     service = get_llm_service()
#     try:
#         response = await service.generate_response("Tell me a joke about FastAPI.", {"model": "mock-creative"})
#         print("LLM Response:", response)
#         response_error = await service.generate_response("This prompt should error.", {})
#         print("LLM Error Response:", response_error)
#     except LLMServiceError as e:
#         print(f"LLM Service Error: {e.message} (Status: {e.status_code})")
#     except Exception as e:
#         print(f"An unexpected error occurred: {e}")

# if __name__ == "__main__":
#     asyncio.run(main())
