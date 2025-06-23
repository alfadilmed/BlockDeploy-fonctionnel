import sys
import os
from pathlib import Path

# Add the project root to the Python path to allow imports from 'app'
# This assumes the script is in backend/scripts and the app is in backend/app
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from app.services.rag_processor import RAGProcessor, DATA_DIR, DEFAULT_FAISS_INDEX_PATH, DEFAULT_DOC_METADATA_PATH

def main():
    print("Starting documentation indexing process...")

    # Determine the path to the 'docs' directory at the root of the repository
    # Assumes 'backend' is a subdirectory of the repository root.
    repository_root = project_root.parent
    docs_directory = repository_root / "docs"

    if not docs_directory.exists() or not docs_directory.is_dir():
        print(f"Error: Documentation directory not found at {docs_directory}")
        print("Please ensure the 'docs' directory exists at the repository root.")
        return

    print(f"Using documentation source: {docs_directory}")

    # Paths for index and metadata within the backend/app/data directory
    faiss_index_file = DATA_DIR / DEFAULT_FAISS_INDEX_PATH
    metadata_file = DATA_DIR / DEFAULT_DOC_METADATA_PATH

    # Instantiate RAGProcessor with specific paths if needed, or defaults.
    # Using defaults which point to backend/app/data/
    rag_proc = RAGProcessor()

    print("Loading and processing documents...")
    # The load_and_process_documents method now uses Unstructured if available
    document_chunks = rag_proc.load_and_process_documents(str(docs_directory))

    if not document_chunks:
        print("No document chunks were loaded or processed. Aborting index creation.")
        return

    print(f"Successfully processed {len(document_chunks)} chunks.")

    print("Creating and saving FAISS index and metadata...")
    rag_proc.create_and_save_index(document_chunks) # Pass chunks explicitly, though it also sets internal state

    print(f"FAISS index saved to: {faiss_index_file}")
    print(f"Document metadata saved to: {metadata_file}")
    print("Documentation indexing process completed.")

if __name__ == "__main__":
    # Create the data directory if it doesn't exist, just in case RAGProcessor didn't create it.
    # RAGProcessor's __init__ now creates DATA_DIR, but good to be defensive.
    if not DATA_DIR.exists():
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        print(f"Created data directory: {DATA_DIR}")

    main()

# How to run this script:
# From the 'backend' directory:
# python scripts/index_documentation.py
# Or from the project root:
# python backend/scripts/index_documentation.py
