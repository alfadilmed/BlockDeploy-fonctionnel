import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch # AsyncMock for async methods

# client fixture is from conftest.py

# Test a successful query
def test_query_ai_assistant_success(client: TestClient, monkeypatch):
    # Mock the dependencies: get_llm_service and get_prompt_manager
    mock_llm_instance = AsyncMock()
    mock_llm_instance.generate_response.return_value = {
        "text_response": "Mocked successful response text.",
        "structured_data": {"key": "value"},
        "confidence_score": 0.9,
        "sources": [{"name": "Mock Source", "url": "http://example.com/mock"}],
        "model_used": "mock-test-model",
        "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30}
    }

    mock_prompt_manager_instance = AsyncMock() # PromptManager methods are sync, but if it becomes async
    mock_prompt_manager_instance.build_prompt.return_value = "This is a fully built prompt."

    # Patch the dependency injectors within the endpoint's module
    monkeypatch.setattr("app.api.v1.endpoints.query.get_llm_service", lambda: mock_llm_instance)
    monkeypatch.setattr("app.api.v1.endpoints.query.get_prompt_manager", lambda: mock_prompt_manager_instance)

    request_payload = {
        "user_id": "test_user",
        "query_text": "Hello assistant!",
        "context": {
            "ui_location": "homepage",
            "conversation_history": [{"role": "user", "content": "Previous message"}]
        },
        "llm_options": {"model": "test-model"}
    }

    response = client.post("/api/v1/ai-assistant/query", json=request_payload)

    assert response.status_code == 200
    json_response = response.json()

    assert "conversation_id" in json_response # Should be generated if not provided
    assert "response_id" in json_response
    assert "timestamp" in json_response

    assistant_response = json_response["assistant_response"]
    assert assistant_response["text_response"] == "Mocked successful response text."
    assert assistant_response["structured_data"] == {"key": "value"}
    assert assistant_response["confidence_score"] == 0.9
    assert len(assistant_response["sources"]) == 1
    assert assistant_response["sources"][0]["name"] == "Mock Source"

    mock_prompt_manager_instance.build_prompt.assert_called_once()
    # The actual DTO is passed to build_prompt, so checking call details might be complex if needed

    mock_llm_instance.generate_response.assert_called_once_with(
        "This is a fully built prompt.",
        {"model": "test-model"} # llm_options from request
    )

# Test validation error for missing required field (e.g., query_text)
def test_query_ai_assistant_validation_error(client: TestClient):
    request_payload = {
        "user_id": "test_user"
        # "query_text" is missing
    }
    response = client.post("/api/v1/ai-assistant/query", json=request_payload)
    assert response.status_code == 422 # Unprocessable Entity for FastAPI validation errors
    json_response = response.json()
    assert "detail" in json_response
    assert any(err["loc"] == ["body", "query_text"] and err["type"] == "missing" for err in json_response["detail"])


# Test LLMServiceError being handled
def test_query_ai_assistant_llm_service_error(client: TestClient, monkeypatch):
    from app.services.llm_service import LLMServiceError
    mock_llm_instance = AsyncMock()
    mock_llm_instance.generate_response.side_effect = LLMServiceError("Simulated LLM is down", status_code=503)

    mock_prompt_manager_instance = AsyncMock()
    mock_prompt_manager_instance.build_prompt.return_value = "Prompt for LLM."

    monkeypatch.setattr("app.api.v1.endpoints.query.get_llm_service", lambda: mock_llm_instance)
    monkeypatch.setattr("app.api.v1.endpoints.query.get_prompt_manager", lambda: mock_prompt_manager_instance)

    request_payload = {"user_id": "test_user", "query_text": "Query that will cause LLM error"}
    response = client.post("/api/v1/ai-assistant/query", json=request_payload)

    assert response.status_code == 503
    json_response = response.json()
    assert json_response["detail"]["error_code"] == "LLM_SERVICE_ERROR"
    assert json_response["detail"]["message"] == "Simulated LLM is down"

# Test a generic internal server error
def test_query_ai_assistant_internal_server_error(client: TestClient, monkeypatch):
    mock_llm_instance = AsyncMock()
    # Simulate an unexpected error type, not LLMServiceError
    mock_llm_instance.generate_response.side_effect = RuntimeError("Some unexpected runtime error")

    mock_prompt_manager_instance = AsyncMock()
    mock_prompt_manager_instance.build_prompt.return_value = "Prompt for LLM."

    monkeypatch.setattr("app.api.v1.endpoints.query.get_llm_service", lambda: mock_llm_instance)
    monkeypatch.setattr("app.api.v1.endpoints.query.get_prompt_manager", lambda: mock_prompt_manager_instance)

    request_payload = {"user_id": "test_user", "query_text": "Query causing unexpected error"}
    response = client.post("/api/v1/ai-assistant/query", json=request_payload)

    assert response.status_code == 500
    json_response = response.json()
    assert json_response["detail"]["error_code"] == "INTERNAL_SERVER_ERROR"
    assert json_response["detail"]["message"] == "An unexpected error occurred."

# Test case where conversation_id is provided in request
def test_query_ai_assistant_with_provided_conversation_id(client: TestClient, monkeypatch):
    mock_llm_instance = AsyncMock()
    mock_llm_instance.generate_response.return_value = {"text_response": "Response."} # Simplified mock

    mock_prompt_manager_instance = AsyncMock()
    mock_prompt_manager_instance.build_prompt.return_value = "Prompt."

    monkeypatch.setattr("app.api.v1.endpoints.query.get_llm_service", lambda: mock_llm_instance)
    monkeypatch.setattr("app.api.v1.endpoints.query.get_prompt_manager", lambda: mock_prompt_manager_instance)

    provided_conv_id = "my-custom-conv-id-123"
    request_payload = {
        "user_id": "test_user",
        "query_text": "Hello again!",
        "conversation_id": provided_conv_id
    }

    response = client.post("/api/v1/ai-assistant/query", json=request_payload)
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["conversation_id"] == provided_conv_id

# Test root endpoint (simple check)
def test_read_root(client: TestClient):
    from app.core.config import settings
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": f"Welcome to {settings.PROJECT_NAME}"}
