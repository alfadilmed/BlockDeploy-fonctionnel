import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock, MagicMock
import os
from pathlib import Path

from app.services.rag_processor import RAGProcessor, DATA_DIR
from app.api.v1.schemas import AIQueryRequestDTO # Ensure this import is correct

# --- Fixtures ---

@pytest.fixture(scope="module")
def setup_test_rag_index(tmp_path_factory_session):
    """
    Sets up a temporary FAISS index for RAG integration tests.
    This index is created once per test session if it doesn't exist.
    It uses a temporary data directory specific to the test session.
    """
    # Use tmp_path_factory_session for session-scoped temporary directory
    session_tmp_dir = tmp_path_factory_session.mktemp("rag_integration_test_data_session")

    # Define paths for this session-scoped index
    # These paths will be used by the RAGProcessor instance in the endpoint via monkeypatching.
    test_index_path = str(session_tmp_dir / "integration_test.idx")
    test_metadata_path = str(session_tmp_dir / "integration_test_meta.json")

    # Create some dummy markdown content for indexing
    docs_content_dir = session_tmp_dir / "test_docs_content"
    docs_content_dir.mkdir()
    with open(docs_content_dir / "rag_test_doc1.md", "w") as f:
        f.write("# RAG Test Doc 1\n\nContent about FastAPI integration and testing.\nFastAPI is a modern web framework.")
    with open(docs_content_dir / "rag_test_doc2.md", "w") as f:
        f.write("## RAG Test Doc 2\n\nInformation on Pydantic models for data validation.\nPydantic ensures data consistency.")

    # Create RAGProcessor instance pointing to these temporary paths
    # This processor is only used here to build the index. The endpoint will get its own.
    rag_builder = RAGProcessor(
        faiss_index_path=test_index_path,
        doc_metadata_path=test_metadata_path
    )
    chunks = rag_builder.load_and_process_documents(str(docs_content_dir))
    if chunks:
        rag_builder.create_and_save_index(chunks)
        print(f"Integration test FAISS index created at {test_index_path} with {len(chunks)} chunks.")
    else:
        print("Warning: No chunks generated for integration test RAG index.")

    # Return the paths so they can be used to configure the RAGProcessor in the app
    return {"index_path": test_index_path, "metadata_path": test_metadata_path, "initialized": bool(chunks)}


@pytest.fixture(scope="function") # Function scope for client to ensure clean state for each test
def client_with_rag_paths(client: TestClient, setup_test_rag_index, monkeypatch):
    """
    Provides a TestClient where the RAGProcessor used by the app
    is monkeypatched to use the session-scoped test index paths.
    """
    if not setup_test_rag_index["initialized"]:
        pytest.skip("RAG index for integration tests was not initialized (no chunks).")

    # This is the tricky part: We need to make the RAGProcessor instance
    # used by the endpoint `get_rag_processor_instance` aware of these paths.
    # We can do this by monkeypatching the RAGProcessor class itself,
    # or its constructor, or the `get_rag_processor_instance` factory.

    # Option: Patch the RAGProcessor constructor to always use these paths when called by get_rag_processor_instance
    # This requires careful patching.

    # Simpler Option for this test: Patch the `get_rag_processor_instance` to return a
    # RAGProcessor that is pre-configured with the test paths.

    # Store original get_rag_processor_instance
    original_get_rag_processor = None
    if hasattr(client.app.dependency_overrides, 'get_rag_processor_instance'):
         original_get_rag_processor = client.app.dependency_overrides.get('get_rag_processor_instance')

    # Create a RAG processor that uses the test index
    # This instance will be yielded by our patched dependency function.
    # It must be created here to use the session-scoped paths.
    test_rag_proc_for_endpoint = RAGProcessor(
        faiss_index_path=setup_test_rag_index["index_path"],
        doc_metadata_path=setup_test_rag_index["metadata_path"]
    )
    # Ensure it loaded correctly
    if test_rag_proc_for_endpoint.index is None:
        pytest.skip("RAGProcessor for endpoint could not load the test index.")


    def mock_get_rag_processor_instance_for_test():
        # This function will be used as the dependency override.
        # It returns the RAGProcessor instance that we've configured with test paths.
        return test_rag_proc_for_endpoint

    # Apply the dependency override for the RAG processor
    # The key for dependency_overrides should match the actual dependency function used in the endpoint.
    # Let's assume it's `get_rag_processor_instance` from `app.api.v1.endpoints.query`
    from app.api.v1.endpoints.query import get_rag_processor_instance as actual_dependency_func
    client.app.dependency_overrides[actual_dependency_func] = mock_get_rag_processor_instance_for_test

    yield client # The test client is now configured to use the RAG with test index

    # Clean up dependency override after the test
    if original_get_rag_processor:
        client.app.dependency_overrides[actual_dependency_func] = original_get_rag_processor
    else:
        if actual_dependency_func in client.app.dependency_overrides:
            del client.app.dependency_overrides[actual_dependency_func]


# --- Tests ---

def test_query_endpoint_with_rag_context_retrieval(
    client_with_rag_paths: TestClient, # Uses the client with patched RAG
    monkeypatch # For mocking LLMService
):
    # Mock the LLMService to inspect the prompt it receives
    mock_llm_instance = AsyncMock()
    # The important part is that the MockLLMService (which is used if provider is "mock")
    # will log/echo the RAG context it sees.
    # We can also check the prompt directly if we capture it.

    # Let's capture the prompt sent to the LLM service
    captured_prompt_holder = {}
    async def capture_prompt_llm_call(prompt, llm_options):
        captured_prompt_holder['prompt'] = prompt
        # Return a standard mock LLM response structure
        return {
            "text_response": f"Mock response acknowledging query about FastAPI. RAG was used.",
            "structured_data": {}, "confidence_score": 0.9, "sources": [],
            "model_used": "mock-rag-test-model", "usage": {}
        }
    mock_llm_instance.generate_response = AsyncMock(side_effect=capture_prompt_llm_call)

    # Patch the get_llm_service dependency in the endpoint's module
    # Assuming get_llm_service is in app.api.v1.endpoints.query
    monkeypatch.setattr("app.api.v1.endpoints.query.get_llm_service", lambda: mock_llm_instance)

    request_payload = {
        "user_id": "rag_test_user",
        "query_text": "Tell me about FastAPI testing", # This query should hit "rag_test_doc1.md"
    }

    response = client_with_rag_paths.post("/api/v1/ai-assistant/query", json=request_payload)

    assert response.status_code == 200
    json_response = response.json()
    assert "RAG was used" in json_response["assistant_response"]["text_response"]

    # Verify that the LLM was called
    mock_llm_instance.generate_response.assert_called_once()

    # Check the captured prompt for RAG context
    final_prompt_to_llm = captured_prompt_holder.get('prompt')
    assert final_prompt_to_llm is not None
    assert "Retrieved Documentation Context:" in final_prompt_to_llm
    assert "Content about FastAPI integration and testing." in final_prompt_to_llm # From rag_test_doc1.md
    assert "(Source: rag_test_doc1.md" in final_prompt_to_llm
    assert f"User Query: {request_payload['query_text']}" in final_prompt_to_llm


def test_query_endpoint_with_rag_no_relevant_docs(
    client_with_rag_paths: TestClient, monkeypatch
):
    mock_llm_instance = AsyncMock()
    captured_prompt_holder = {}
    async def capture_prompt_llm_call(prompt, llm_options):
        captured_prompt_holder['prompt'] = prompt
        return {"text_response": "Mock response for query with no relevant RAG docs."} # Simplified
    mock_llm_instance.generate_response = AsyncMock(side_effect=capture_prompt_llm_call)
    monkeypatch.setattr("app.api.v1.endpoints.query.get_llm_service", lambda: mock_llm_instance)

    request_payload = {
        "user_id": "rag_test_user_no_docs",
        "query_text": "What is the meaning of life according to BlockDeploy docs?", # Unlikely to be in test docs
    }

    response = client_with_rag_paths.post("/api/v1/ai-assistant/query", json=request_payload)
    assert response.status_code == 200

    final_prompt_to_llm = captured_prompt_holder.get('prompt')
    assert final_prompt_to_llm is not None
    assert "Retrieved Documentation Context:" in final_prompt_to_llm
    assert "No relevant documents found in the knowledge base for this query." in final_prompt_to_llm


def test_query_endpoint_rag_performance_basic(
    client_with_rag_paths: TestClient, monkeypatch
):
    # This is a very basic performance check, not a rigorous benchmark.
    # It measures the time for one request involving RAG.
    # Mock LLMService to have minimal, predictable delay.
    mock_llm_instance = AsyncMock()
    async def fast_mock_llm_call(prompt, llm_options):
        await asyncio.sleep(0.01) # Minimal sleep for the mock LLM
        # Ensure the mock response matches what AIResponseData expects,
        # or what MockLLMService would return.
        return {
            "text_response": "Performance test RAG response.",
            "model_used": "perf-test-model",
            "structured_data": {}, # Ensure all fields expected by AIResponseData
            "confidence_score": 0.9, # are present or correctly optional in DTO
            "sources": [],
            "usage": {"prompt_tokens":10, "completion_tokens":5, "total_tokens":15}
        }
    mock_llm_instance.generate_response = AsyncMock(side_effect=fast_mock_llm_call)
    monkeypatch.setattr("app.api.v1.endpoints.query.get_llm_service", lambda: mock_llm_instance)

    request_payload = {
        "user_id": "perf_test_user",
        "query_text": "FastAPI testing information", # Should hit the RAG index
    }

    start_time = time.perf_counter()
    response = client_with_rag_paths.post("/api/v1/ai-assistant/query", json=request_payload)
    end_time = time.perf_counter()

    duration_ms = (end_time - start_time) * 1000
    print(f"RAG Query Endpoint Response Time (incl. RAG search + 0.01s mock LLM): {duration_ms:.2f} ms")

    assert response.status_code == 200
    # A reasonable expectation for RAG + embedding query + FastAPI overhead, excluding actual LLM.
    # This threshold is arbitrary and depends heavily on the machine, embedding model, index size.
    # For a small index and MiniLM, it should be well under a second.
    # Let's set a loose upper bound for now, e.g., 500-1000ms.
    # This is more of a smoke test for "is it reasonably fast" than a benchmark.
    # Increased to 1500ms to be safer on various CI/test environments
    assert duration_ms < 1500

    json_response = response.json()
    assert "Performance test RAG response" in json_response["assistant_response"]["text_response"]


import asyncio # Added missing import at the top of the file

# This fixture is needed by pytest if tmp_path_factory is used with session scope
@pytest.fixture(scope="session")
def tmp_path_factory_session(tmp_path_factory):
    return tmp_path_factory

# To run this test:
# 1. Ensure FAISS, SentenceTransformers are installed.
# 2. The RAGProcessor and PromptManager must be updated to use RAG.
# 3. The endpoint must correctly inject and use these updated services.
# These tests are "integration" because they test the collaboration of multiple components
# (endpoint, PromptManager, RAGProcessor (real instance with test index), and a mocked LLMService).
# They assume `scripts/index_documentation.py` is NOT run by the test itself for the main app's data,
# but that `setup_test_rag_index` creates a dedicated, isolated index for these tests.
# The `client_with_rag_paths` fixture is key to redirecting the app's RAGProcessor to this test index.
