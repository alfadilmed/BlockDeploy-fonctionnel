import pytest
from app.services.llm_service import MockLLMService, LLMServiceError, get_llm_service
from app.core.config import settings

@pytest.mark.asyncio
async def test_mock_llm_service_generates_response():
    service = MockLLMService()
    prompt = "Test prompt"
    response = await service.generate_response(prompt)

    assert "text_response" in response
    assert response["text_response"].startswith("This is a mock response to the prompt:")
    assert "structured_data" in response
    assert response["structured_data"] == {"mock_key": "mock_value", "prompt_length": len(prompt)}
    assert "confidence_score" in response
    assert response["confidence_score"] == 0.95
    assert "model_used" in response
    assert response["model_used"] == settings.LLM_DEFAULT_MODEL # Default model from settings
    assert "usage" in response
    assert response["usage"]["prompt_tokens"] == len(prompt.split())

@pytest.mark.asyncio
async def test_mock_llm_service_generates_code_response():
    service = MockLLMService()
    prompt = "Generate some code"
    response = await service.generate_response(prompt)
    assert "text_response" in response
    assert "```python" in response["text_response"]

@pytest.mark.asyncio
async def test_mock_llm_service_simulates_error():
    service = MockLLMService()
    prompt_with_error = "This prompt should error."

    with pytest.raises(LLMServiceError) as excinfo:
        await service.generate_response(prompt_with_error)

    assert excinfo.value.message == "Simulated LLM error: The prompt contained 'error'."
    assert excinfo.value.status_code == 503

@pytest.mark.asyncio
async def test_mock_llm_service_with_options():
    service = MockLLMService()
    prompt = "Test prompt with options"
    options = {"model": "custom-mock-model", "temperature": 0.5}
    response = await service.generate_response(prompt, llm_options=options)

    assert response["model_used"] == "custom-mock-model"

def test_get_llm_service_mock_provider():
    # Assuming settings.LLM_PROVIDER is "mock" by default for tests or set it
    original_provider = settings.LLM_PROVIDER
    settings.LLM_PROVIDER = "mock"
    service = get_llm_service()
    assert isinstance(service, MockLLMService)
    settings.LLM_PROVIDER = original_provider # Reset

def test_get_llm_service_openai_provider_no_key_falls_back_to_mock(monkeypatch):
    original_provider = settings.LLM_PROVIDER
    original_key = settings.LLM_API_KEY

    settings.LLM_PROVIDER = "openai"
    settings.LLM_API_KEY = None # Ensure no API key

    # Mock print to check warning, optional
    mock_print = []
    monkeypatch.setattr("builtins.print", lambda *args, **kwargs: mock_print.append(" ".join(map(str, args))))

    service = get_llm_service()
    assert isinstance(service, MockLLMService)
    # Check if warning was printed (optional)
    # assert any("Warning: OpenAI provider selected but no API key found" in s for s in mock_print)

    settings.LLM_PROVIDER = original_provider
    settings.LLM_API_KEY = original_key

def test_get_llm_service_openai_provider_with_key_returns_mock_for_m1(monkeypatch):
    # For M1, even if OpenAI is configured, we expect MockLLMService
    original_provider = settings.LLM_PROVIDER
    original_key = settings.LLM_API_KEY

    settings.LLM_PROVIDER = "openai"
    settings.LLM_API_KEY = "fake_openai_key"

    mock_print = []
    monkeypatch.setattr("builtins.print", lambda *args, **kwargs: mock_print.append(" ".join(map(str, args))))

    service = get_llm_service()
    assert isinstance(service, MockLLMService) # Still Mock for M1
    assert any("Info: OpenAILLMService selected, but using MockLLMService for M1." in s for s in mock_print)

    settings.LLM_PROVIDER = original_provider
    settings.LLM_API_KEY = original_key


def test_get_llm_service_unsupported_provider_raises_error():
    original_provider = settings.LLM_PROVIDER
    settings.LLM_PROVIDER = "unsupported_provider"

    with pytest.raises(ValueError) as excinfo:
        get_llm_service()

    assert "Unsupported LLM provider: unsupported_provider" in str(excinfo.value)
    settings.LLM_PROVIDER = original_provider # Reset
