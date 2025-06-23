import pytest
from unittest.mock import MagicMock, patch

from app.services.prompt_manager import PromptManager
from app.services.rag_processor import RAGProcessor # Assuming RAGProcessor is in this path
from app.api.v1.schemas import AIQueryRequestDTO, ContextData # Make sure these are importable

# --- Fixtures ---

@pytest.fixture
def mock_rag_processor() -> MagicMock:
    """Mocks the RAGProcessor."""
    mock = MagicMock(spec=RAGProcessor)
    # Configure common return values for search_similar_documents
    mock.search_similar_documents.return_value = [
        {"text": "Relevant RAG document 1 content.", "source": "doc1.md", "score": 0.9},
        {"text": "Relevant RAG document 2 snippet.", "source": "doc2.md", "score": 0.85},
    ]
    return mock

@pytest.fixture
def prompt_manager_with_mock_rag(mock_rag_processor: MagicMock) -> PromptManager:
    """Provides a PromptManager instance initialized with a mocked RAGProcessor."""
    return PromptManager(rag_processor=mock_rag_processor)

@pytest.fixture
def prompt_manager_no_rag() -> PromptManager:
    """Provides a PromptManager instance initialized without a RAGProcessor."""
    return PromptManager(rag_processor=None)

@pytest.fixture
def sample_request_dto() -> AIQueryRequestDTO:
    """Provides a sample AIQueryRequestDTO."""
    return AIQueryRequestDTO(
        user_id="test_user_rag",
        query_text="What is RAG?",
        context=ContextData(
            ui_location="docs_page",
            conversation_history=[{"role": "user", "content": "Tell me about advanced features."}]
        )
    )

# --- Tests ---

def test_build_prompt_with_rag_context(
    prompt_manager_with_mock_rag: PromptManager,
    sample_request_dto: AIQueryRequestDTO,
    mock_rag_processor: MagicMock
):
    prompt = prompt_manager_with_mock_rag.build_prompt(sample_request_dto)

    # Check that RAG processor was called with the user query
    mock_rag_processor.search_similar_documents.assert_called_once_with(sample_request_dto.query_text, k=3)

    # Check that RAG context is in the prompt
    assert "Retrieved Documentation Context:" in prompt
    assert "Relevant RAG document 1 content." in prompt
    assert "(Source: doc1.md, Relevance Score: 0.9000)" in prompt
    assert "Relevant RAG document 2 snippet." in prompt
    assert "(Source: doc2.md, Relevance Score: 0.8500)" in prompt

    # Check that user query and other context are still present
    assert f"User Query: {sample_request_dto.query_text}" in prompt
    assert "User is currently at: docs_page" in prompt # From sample_request_dto
    assert "User: Tell me about advanced features." in prompt # From sample_request_dto history

    # Check that no task-specific instructions were added for this generic query
    # This depends on the default template structure. If the placeholder is always there,
    # it might be filled with an empty string or a default "no specific task" message.
    # Based on current PromptManager, if no conditions match, task_specific_instructions is "".
    # The template then might have an empty line. Let's check that specific known instructions are NOT there.
    assert "The user is asking to generate a configuration for an ERC-20 token." not in prompt
    assert "The user is asking for an explanation of the" not in prompt


def test_build_prompt_when_rag_finds_no_documents(
    prompt_manager_with_mock_rag: PromptManager,
    sample_request_dto: AIQueryRequestDTO,
    mock_rag_processor: MagicMock
):
    # Configure mock RAG to return no documents
    mock_rag_processor.search_similar_documents.return_value = []

    prompt = prompt_manager_with_mock_rag.build_prompt(sample_request_dto)

    mock_rag_processor.search_similar_documents.assert_called_once_with(sample_request_dto.query_text, k=3)

    assert "Retrieved Documentation Context:" in prompt
    assert "No relevant documents found in the knowledge base for this query." in prompt

    # Ensure other parts are still there
    assert f"User Query: {sample_request_dto.query_text}" in prompt

def test_build_prompt_when_rag_processor_is_none(
    prompt_manager_no_rag: PromptManager,
    sample_request_dto: AIQueryRequestDTO
):
    prompt = prompt_manager_no_rag.build_prompt(sample_request_dto)

    # Check that RAG context indicates RAG is not available
    assert "Retrieved Documentation Context:" in prompt
    assert "N/A (RAG not available or no documents found)" in prompt

    # Ensure other parts are still there
    assert f"User Query: {sample_request_dto.query_text}" in prompt
    assert "User is currently at: docs_page" in prompt

def test_build_prompt_when_rag_search_raises_error(
    prompt_manager_with_mock_rag: PromptManager,
    sample_request_dto: AIQueryRequestDTO,
    mock_rag_processor: MagicMock,
    capsys # To capture print statements
):
    # Configure mock RAG to raise an exception
    mock_rag_processor.search_similar_documents.side_effect = Exception("FAISS index exploded!")

    prompt = prompt_manager_with_mock_rag.build_prompt(sample_request_dto)

    mock_rag_processor.search_similar_documents.assert_called_once_with(sample_request_dto.query_text, k=3)

    # Check that the prompt indicates an error during RAG retrieval
    assert "Retrieved Documentation Context:" in prompt
    assert "Error retrieving documents from knowledge base." in prompt

    # Check that an error was printed (logged)
    captured = capsys.readouterr()
    assert "Error during RAG document retrieval: FAISS index exploded!" in captured.out

    # Ensure other parts are still there
    assert f"User Query: {sample_request_dto.query_text}" in prompt

def test_format_retrieved_documents_formatting(prompt_manager_with_mock_rag: PromptManager):
    # Test the internal formatting method directly
    docs = [
        {"text": "Doc A text.", "source": "fileA.md", "score": 0.98765},
        {"text": "Doc B text, very long..." * 100, "source": "fileB.md", "score": 0.76543}, # Test truncation
    ]
    formatted_str = prompt_manager_with_mock_rag._format_retrieved_documents(docs)

    assert "Document 1 (Source: fileA.md, Relevance Score: 0.9877):" in formatted_str
    assert "Doc A text." in formatted_str
    assert "Document 2 (Source: fileB.md, Relevance Score: 0.7654):" in formatted_str
    assert "Doc B text, very long..." in formatted_str # Start of the long text
    assert len(docs[1]["text"][:500]) == 500 # Check if truncation is applied
    assert formatted_str.count("Doc B text, very long...") * len("Doc B text, very long...") < len(docs[1]["text"]) # Ensure it's truncated

def test_format_retrieved_documents_empty_list(prompt_manager_with_mock_rag: PromptManager):
    formatted_str = prompt_manager_with_mock_rag._format_retrieved_documents([])
    assert formatted_str == "No relevant documents found in the knowledge base."

def test_prompt_length_warning(
    prompt_manager_with_mock_rag: PromptManager,
    sample_request_dto: AIQueryRequestDTO,
    mock_rag_processor: MagicMock,
    capsys
):
    # Make RAG content very long to trigger the warning
    long_rag_text = "This is very long RAG content. " * 1000 # Approx 30k chars
    mock_rag_processor.search_similar_documents.return_value = [
        {"text": long_rag_text, "source": "long_doc.md", "score": 0.9}
    ]

    # Make other parts of DTO also somewhat long
    sample_request_dto.query_text = "Short query, but context is huge."
    sample_request_dto.context.current_configuration = {"key": "value " * 500} # Approx 6k chars
    sample_request_dto.context.conversation_history = [
        {"role": "user", "content": "History line 1 " * 100}, # Approx 2k chars
        {"role": "assistant", "content": "History line 2 " * 100} # Approx 2k chars
    ]
    # Total should easily exceed the 12000 char warning limit in PromptManager

    prompt = prompt_manager_with_mock_rag.build_prompt(sample_request_dto)

    captured = capsys.readouterr()
    assert "Warning: Prompt is very long" in captured.out
    assert f"({len(prompt)} chars)" in captured.out # Check the length is reported


# Test that PromptManager can be initialized with RAGProcessor being None
def test_prompt_manager_init_with_rag_processor_none():
    pm = PromptManager(rag_processor=None)
    assert pm.rag_processor is None
    # Try building a prompt, should not fail
    dto = AIQueryRequestDTO(user_id="test", query_text="Hello")
    prompt = pm.build_prompt(dto)
    assert "N/A (RAG not available or no documents found)" in prompt

# Test that PromptManager can be initialized with a RAGProcessor instance
def test_prompt_manager_init_with_rag_processor_instance(mock_rag_processor):
    pm = PromptManager(rag_processor=mock_rag_processor)
    assert pm.rag_processor == mock_rag_processor
    dto = AIQueryRequestDTO(user_id="test", query_text="Hello")
    prompt = pm.build_prompt(dto) # Should call mock_rag_processor.search_similar_documents
    mock_rag_processor.search_similar_documents.assert_called_once_with("Hello", k=3)
    assert "Relevant RAG document 1 content." in prompt # From mock_rag_processor fixture default

def test_build_prompt_with_erc20_generation_context(
    prompt_manager_with_mock_rag: PromptManager,
    mock_rag_processor: MagicMock
):
    erc20_request = AIQueryRequestDTO(
        user_id="erc20_user",
        query_text="generate config for erc20 token 'MyCoin' symbol 'MYC'",
        context=ContextData(ui_location="smart_contracts/new_erc20")
    )
    prompt = prompt_manager_with_mock_rag.build_prompt(erc20_request)

    mock_rag_processor.search_similar_documents.assert_called_once_with(
        "generate config for erc20 token 'MyCoin' symbol 'MYC' (context: new_erc20)", k=3
    )
    assert "The user is asking to generate a configuration for an ERC-20 token." in prompt
    assert "Retrieved Documentation Context:" in prompt # RAG context should still be there

def test_build_prompt_with_parameter_explanation_context_from_ui_location(
    prompt_manager_with_mock_rag: PromptManager,
    mock_rag_processor: MagicMock
):
    param_request = AIQueryRequestDTO(
        user_id="param_user",
        query_text="What does this do?", # User might ask a generic question
        context=ContextData(ui_location="deployment_settings/explain_parameter_gasLimit")
    )
    prompt = prompt_manager_with_mock_rag.build_prompt(param_request)

    # Check if RAG search query was augmented
    # Based on current logic: "What does this do? gasLimit"
    mock_rag_processor.search_similar_documents.assert_called_once_with(
        "What does this do? gasLimit", k=3
    )
    assert "The user is asking for an explanation of the 'gasLimit' parameter." in prompt
    assert "Retrieved Documentation Context:" in prompt

def test_build_prompt_with_parameter_explanation_context_from_query(
    prompt_manager_with_mock_rag: PromptManager,
    mock_rag_processor: MagicMock
):
    param_request = AIQueryRequestDTO(
        user_id="param_user_q",
        query_text="Can you explain the parameter 'replicas'?",
        context=ContextData(ui_location="some_other_page") # ui_location doesn't indicate param here
    )
    prompt = prompt_manager_with_mock_rag.build_prompt(param_request)

    mock_rag_processor.search_similar_documents.assert_called_once_with(
        "Can you explain the parameter 'replicas'? (context: some_other_page)", k=3
    )
    assert "The user is asking for an explanation of the 'replicas' parameter." in prompt
    assert "Retrieved Documentation Context:" in prompt

def test_rag_search_query_augmentation(
    prompt_manager_with_mock_rag: PromptManager,
    mock_rag_processor: MagicMock
):
    # Case 1: ui_location suggests parameter explanation
    request_explain = AIQueryRequestDTO(
        user_id="test", query_text="Tell me more.",
        context=ContextData(ui_location="form/explain_parameter_maxRetries")
    )
    prompt_manager_with_mock_rag.build_prompt(request_explain)
    mock_rag_processor.search_similar_documents.assert_called_with("Tell me more. maxRetries", k=3)
    mock_rag_processor.search_similar_documents.reset_mock()

    # Case 2: ui_location is generic, query is generic
    request_generic = AIQueryRequestDTO(
        user_id="test", query_text="Help me.",
        context=ContextData(ui_location="dashboard")
    )
    prompt_manager_with_mock_rag.build_prompt(request_generic)
    mock_rag_processor.search_similar_documents.assert_called_with("Help me. (context: dashboard)", k=3)
    mock_rag_processor.search_similar_documents.reset_mock()

    # Case 3: No ui_location
    request_no_loc = AIQueryRequestDTO(
        user_id="test", query_text="What is BlockDeploy?",
        context=ContextData() # No ui_location
    )
    prompt_manager_with_mock_rag.build_prompt(request_no_loc)
    mock_rag_processor.search_similar_documents.assert_called_with("What is BlockDeploy?", k=3)
