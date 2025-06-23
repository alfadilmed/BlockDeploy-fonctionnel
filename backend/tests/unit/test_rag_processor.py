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
