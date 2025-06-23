import pytest
import os
import shutil
import json
from pathlib import Path
import numpy as np

from app.services.rag_processor import RAGProcessor, DATA_DIR, DEFAULT_EMBEDDING_MODEL
from sentence_transformers import SentenceTransformer # To get embedding dimension

# --- Fixtures ---

@pytest.fixture(scope="module")
def test_docs_path(tmp_path_factory) -> Path:
    """Creates a temporary directory with some markdown files for testing."""
    docs_dir = tmp_path_factory.mktemp("test_docs")

    # File 1: Basic content
    with open(docs_dir / "doc1.md", "w") as f:
        f.write("# Document 1\n\nThis is the first test document. It talks about apples.\n\nApples are good.")

    # File 2: More sections
    with open(docs_dir / "doc2.md", "w") as f:
        f.write("# Document 2 - Oranges\n\nThis document is about oranges.\n\n## Section 2.1\nOranges are citrus fruits.\n\n## Section 2.2\nThey are orange in color.")

    # File 3: Subdirectory
    sub_dir = docs_dir / "subdir"
    sub_dir.mkdir()
    with open(sub_dir / "doc3.md", "w") as f:
        f.write("### Document 3 in Subdir\n\nBananas are yellow and curved.")

    # File 4: Empty markdown file
    with open(docs_dir / "empty.md", "w") as f:
        f.write("")

    # File 5: Markdown with just a title
    with open(docs_dir / "title_only.md", "w") as f:
        f.write("# Only a Title")

    return docs_dir

@pytest.fixture(scope="function") # Use function scope to get a fresh RAGProcessor and data dir for each test
def rag_processor_instance(tmp_path_factory) -> RAGProcessor:
    """Provides a RAGProcessor instance with a temporary data directory."""
    # Create a unique temporary data directory for each test run for this fixture
    temp_data_dir = tmp_path_factory.mktemp("rag_data")

    # Override the default paths for index and metadata to use this temp dir
    # This ensures tests don't interfere with each other or a real index.
    # Note: RAGProcessor's DATA_DIR is module-level, so we pass explicit paths.
    index_path = str(temp_data_dir / "test_faiss.idx")
    metadata_path = str(temp_data_dir / "test_meta.json")

    # Ensure the RAGProcessor's internal DATA_DIR (if used for anything else) is also temp,
    # though passing paths directly to constructor is safer.
    # For this test, we'll rely on passing paths to constructor.

    processor = RAGProcessor(
        faiss_index_path=index_path,
        doc_metadata_path=metadata_path
    )
    # Clean up the temp data dir after test, if not handled by tmp_path_factory's cleanup
    yield processor
    # shutil.rmtree(temp_data_dir, ignore_errors=True) # tmp_path_factory should handle this

# --- Helper to get embedding dimension ---
def get_model_dimension(model_name: str = DEFAULT_EMBEDDING_MODEL) -> int:
    model = SentenceTransformer(model_name)
    return model.get_sentence_embedding_dimension()

# --- Tests ---

def test_rag_processor_initialization(rag_processor_instance: RAGProcessor):
    assert rag_processor_instance is not None
    assert rag_processor_instance.index is None # Should be None initially if files don't exist
    assert len(rag_processor_instance.document_chunks) == 0
    assert os.path.exists(rag_processor_instance.index_path) is False # Ensure test paths are used
    assert os.path.exists(rag_processor_instance.metadata_path) is False

def test_load_and_process_documents(rag_processor_instance: RAGProcessor, test_docs_path: Path):
    chunks = rag_processor_instance.load_and_process_documents(str(test_docs_path))
    assert len(chunks) > 0
    # Check if content from each file is present in some chunk
    assert any("apples" in chunk["text"].lower() for chunk in chunks)
    assert any("oranges" in chunk["text"].lower() for chunk in chunks)
    assert any("bananas" in chunk["text"].lower() for chunk in chunks)
    assert any(chunk["source"] == "doc1.md" for chunk in chunks)
    assert any(chunk["source"] == "doc2.md" for chunk in chunks)
    assert any(chunk["source"] == "doc3.md" for chunk in chunks)
    # Check that empty.md and title_only.md might produce few or specific chunks
    # depending on Unstructured's behavior (or basic if Unstructured is off)
    # For example, title_only.md should produce at least one chunk with "Only a Title"
    assert any("Only a Title" in chunk["text"] for chunk in chunks if chunk["source"] == "title_only.md")


def test_create_and_save_index(rag_processor_instance: RAGProcessor, test_docs_path: Path):
    chunks = rag_processor_instance.load_and_process_documents(str(test_docs_path))
    assert len(chunks) > 0

    rag_processor_instance.create_and_save_index(chunks)

    assert rag_processor_instance.index is not None
    assert rag_processor_instance.index.ntotal == len(chunks)

    # Verify files were created
    assert os.path.exists(rag_processor_instance.index_path)
    assert os.path.exists(rag_processor_instance.metadata_path)

    # Verify metadata content
    with open(rag_processor_instance.metadata_path, 'r') as f:
        loaded_metadata = json.load(f)
    assert len(loaded_metadata) == len(chunks)
    assert loaded_metadata[0]["text"] == chunks[0]["text"]
    assert loaded_metadata[0]["source"] == chunks[0]["source"]

def test_load_existing_index_and_metadata(rag_processor_instance: RAGProcessor, test_docs_path: Path):
    # First, create and save an index
    chunks = rag_processor_instance.load_and_process_documents(str(test_docs_path))
    rag_processor_instance.create_and_save_index(chunks)

    # Store original paths to ensure the new instance uses them
    original_index_path = rag_processor_instance.index_path
    original_metadata_path = rag_processor_instance.metadata_path

    # Create a new RAGProcessor instance, it should load the saved index/metadata
    new_rag_processor = RAGProcessor(
        faiss_index_path=original_index_path,
        doc_metadata_path=original_metadata_path
    )

    assert new_rag_processor.index is not None
    assert new_rag_processor.index.ntotal == len(chunks)
    assert len(new_rag_processor.document_chunks) == len(chunks)
    assert new_rag_processor.document_chunks[0]["text"] == chunks[0]["text"]

@pytest.mark.asyncio # search_similar_documents is not async, but test can be if other parts are
async def test_search_similar_documents(rag_processor_instance: RAGProcessor, test_docs_path: Path):
    chunks = rag_processor_instance.load_and_process_documents(str(test_docs_path))
    rag_processor_instance.create_and_save_index(chunks)

    assert rag_processor_instance.index is not None

    # Test search for "apples"
    results_apples = rag_processor_instance.search_similar_documents("apples", k=1)
    assert len(results_apples) == 1
    assert "apples" in results_apples[0]["text"].lower()
    assert results_apples[0]["source"] == "doc1.md" # Assuming doc1 is most relevant to apples

    # Test search for "citrus fruits"
    results_citrus = rag_processor_instance.search_similar_documents("citrus fruits", k=2)
    assert len(results_citrus) > 0
    # The most relevant chunk should contain "oranges" or "citrus"
    assert any("oranges" in res["text"].lower() or "citrus" in res["text"].lower() for res in results_citrus)
    assert any(res["source"] == "doc2.md" for res in results_citrus)

    # Test search for "bananas"
    results_bananas = rag_processor_instance.search_similar_documents("bananas", k=1)
    assert len(results_bananas) == 1
    assert "bananas" in results_bananas[0]["text"].lower()
    assert results_bananas[0]["source"] == "doc3.md"

    # Test with k > number of documents
    results_k_large = rag_processor_instance.search_similar_documents("document", k=10)
    assert len(results_k_large) == len(chunks) # Should return all chunks if k is large enough

    # Test with a query that has no good match (expect low similarity or less relevant docs)
    results_no_match = rag_processor_instance.search_similar_documents("quantum physics", k=1)
    assert len(results_no_match) <= 1 # Could be 0 if index is empty, or 1 if k=1 and index has items
    # We can't assert much about the content here, just that it runs

def test_empty_index_search(rag_processor_instance: RAGProcessor):
    # RAGProcessor initializes with index=None if files don't exist.
    # _load_index_and_metadata is called at init. If no index, it remains None.
    # The search method now re-attempts load, which will still find nothing.
    results = rag_processor_instance.search_similar_documents("anything", k=1)
    assert len(results) == 0

def test_index_with_single_document(rag_processor_instance: RAGProcessor, tmp_path: Path):
    single_doc_dir = tmp_path / "single_doc_test"
    single_doc_dir.mkdir()
    with open(single_doc_dir / "single.md", "w") as f:
        f.write("This is the only document about widgets.")

    chunks = rag_processor_instance.load_and_process_documents(str(single_doc_dir))
    # Depending on chunking, this might be one or more chunks.
    # Basic chunker might make one if short. Unstructured might too.
    assert len(chunks) >= 1

    rag_processor_instance.create_and_save_index(chunks)
    assert rag_processor_instance.index is not None
    assert rag_processor_instance.index.ntotal == len(chunks)

    results = rag_processor_instance.search_similar_documents("widgets", k=1)
    assert len(results) >= 1 if len(chunks) >=1 else 0
    if results:
        assert "widgets" in results[0]["text"].lower()

def test_rag_processor_handles_nonexistent_doc_path(rag_processor_instance: RAGProcessor, tmp_path: Path):
    non_existent_path = str(tmp_path / "non_existent_docs")
    chunks = rag_processor_instance.load_and_process_documents(non_existent_path)
    assert len(chunks) == 0

    # Try to create index with no chunks
    rag_processor_instance.create_and_save_index(chunks) # or rag_processor_instance.create_and_save_index()
    assert rag_processor_instance.index is None # No index should be created if no embeddings

    # Search should return empty
    results = rag_processor_instance.search_similar_documents("anything", k=1)
    assert len(results) == 0

    # Ensure no index files were created
    assert not os.path.exists(rag_processor_instance.index_path)
    assert not os.path.exists(rag_processor_instance.metadata_path)

# Test to ensure DATA_DIR is created by RAGProcessor if it doesn't exist
# This is implicitly tested by the fixture now, as tmp_path_factory creates unique dirs.
# However, we can explicitly check the default DATA_DIR behavior if needed.
# For now, the fixture-based approach with explicit paths is more robust for testing.

# Note: FAISS index uses L2 distance (smaller is better).
# The `score` in `search_similar_documents` is a simple `1 - distance`.
# This is not a true cosine similarity unless embeddings are normalized,
# but serves as a basic relevance indicator. `all-MiniLM-L6-v2` produces normalized embeddings.

# TODO: Add tests for more complex Unstructured chunking scenarios if that path is stabilized.
# TODO: Add tests for different embedding models if the RAGProcessor is made to support them dynamically.
# TODO: Test edge cases in text cleaning or chunking if those become more complex.

def test_search_with_nonexistent_index_files(tmp_path: Path): # Removed rag_processor_instance fixture here
    # Create a new instance with paths that we know are empty for this specific test
    empty_data_dir = tmp_path / "empty_rag_data_for_nonexistent_test"
    empty_data_dir.mkdir(exist_ok=True) # Ensure parent dir exists
    empty_index_path = str(empty_data_dir / "non_existent.idx")
    empty_metadata_path = str(empty_data_dir / "non_existent_meta.json")

    # Safety check: remove files if they somehow exist from a previous failed run
    if os.path.exists(empty_index_path):
        os.remove(empty_index_path)
    if os.path.exists(empty_metadata_path):
        os.remove(empty_metadata_path)

    processor_no_index = RAGProcessor(
        faiss_index_path=empty_index_path,
        doc_metadata_path=empty_metadata_path
    )
    assert processor_no_index.index is None
    assert len(processor_no_index.document_chunks) == 0

    results = processor_no_index.search_similar_documents("query for non-existent index", k=1)
    assert len(results) == 0

@patch("faiss.read_index") # Mock faiss.read_index to simulate failure
def test_search_with_corrupted_index_file(mock_read_index, rag_processor_instance: RAGProcessor, test_docs_path: Path, capsys):
    # Create a dummy index file and metadata file so it attempts to load
    # rag_processor_instance fixture already uses temporary paths.
    # We need to ensure these temporary files are created for the test to then mock their read failure.

    # Create placeholder files at the paths the rag_processor_instance expects
    # This simulates that the files exist but are "corrupted" (mock will make read_index fail)
    Path(rag_processor_instance.index_path).touch()
    # Metadata needs to be valid JSON for initial load attempt in RAGProcessor constructor,
    # or the constructor itself might fail before faiss.read_index is even called by _load_index_and_metadata.
    # Let's write minimal valid JSON metadata.
    with open(rag_processor_instance.metadata_path, 'w') as f:
        json.dump([{"text": "dummy", "source": "dummy.md"}], f)


    # Configure the mock to raise an error when faiss.read_index is called
    mock_read_index.side_effect = RuntimeError("Simulated FAISS index corruption/read error")

    # Create a new instance that will attempt to load the (conceptually) corrupted index
    # The RAGProcessor's _load_index_and_metadata will call the mocked faiss.read_index
    new_processor_corrupted_index = RAGProcessor(
        faiss_index_path=rag_processor_instance.index_path, # Path from fixture where dummy files exist
        doc_metadata_path=rag_processor_instance.metadata_path
    )

    assert new_processor_corrupted_index.index is None # Index loading should have failed

    # Verify that an error message was printed/logged during __init__ via _load_index_and_metadata
    # This requires RAGProcessor to print during _load_index_and_metadata on error.
    # The RAGProcessor already prints: print(f"Error loading existing index or metadata: {e}. Indexing may be required.")
    # So we check for this print output.
    # Note: capsys might not capture prints from the __init__ of the object *being created*
    # if the print happens before the object is fully returned/available to the test scope
    # where capsys is active. A more reliable way is to check logs if proper logging is set up.
    # For now, we rely on the print statement in RAGProcessor and hope capsys can get it or test its effect (index is None).

    # We can also check the print from the search function
    results = new_processor_corrupted_index.search_similar_documents("query", k=1)
    assert len(results) == 0
    captured_after_search = capsys.readouterr()
    # Check for either the init error (if it was captured late) or the search error
    assert "Error loading existing index or metadata: Simulated FAISS index corruption/read error" in captured_after_search.out \
        or "FAISS index not loaded" in captured_after_search.out \
        or "Still no index/metadata" in captured_after_search.out
