import sys
import os
from pathlib import Path

# Add the project root to the Python path to allow imports from 'app'
# This assumes the script is in backend/scripts and the app is in backend/app
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from app.services.rag_processor import RAGProcessor # DATA_DIR, DEFAULT paths are now internal or from settings
from app.core.config import settings # To access configured paths if needed, though RAGProcessor uses them by default

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

    # RAGProcessor will use paths from settings by default, which are resolved relative to APP_DATA_DIR.
    # No need to pass paths explicitly if using default locations.
    rag_proc = RAGProcessor(
        embedding_model_name=settings.EMBEDDING_MODEL_NAME,
        # faiss_index_path and doc_metadata_path will use settings values, resolved by RAGProcessor
    )

    print("Loading and processing documents...")
    document_chunks = rag_proc.load_and_process_documents(str(docs_directory))

    if not document_chunks:
        print("No document chunks were loaded or processed. Aborting index creation.")
        return

    print(f"Successfully processed {len(document_chunks)} chunks.")

    print("Creating and saving FAISS index and metadata...")
    rag_proc.create_and_save_index(document_chunks)

    # RAGProcessor now resolves paths internally using settings and APP_DATA_DIR
    print(f"FAISS index saved to: {rag_proc.index_path}")
    print(f"Document metadata saved to: {rag_proc.metadata_path}")
    print("Documentation indexing process completed.")

if __name__ == "__main__":
    # APP_DATA_DIR is created by RAGProcessor's module-level code if it doesn't exist.
    # No need for explicit creation here anymore.
    main()

# How to run this script:
# From the 'backend' directory:
# python scripts/index_documentation.py
# Or from the project root:
# python backend/scripts/index_documentation.py
