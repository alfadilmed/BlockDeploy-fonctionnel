import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Tuple, Optional, Dict, Any
import re # For basic text cleaning
from pathlib import Path

# Try to import Unstructured, fall back to basic markdown for simplicity if not fully set up
try:
    from unstructured.partition.md import partition_md
    from unstructured.chunking.title import chunk_by_title
    UNSTRUCTURED_AVAILABLE = True
except ImportError:
    UNSTRUCTURED_AVAILABLE = False
    print("Warning: Unstructured library not found or not fully functional. Falling back to basic markdown processing for RAG.")

# Configuration for RAG
DEFAULT_EMBEDDING_MODEL = 'all-MiniLM-L6-v2' # A good default, lightweight model
DEFAULT_FAISS_INDEX_PATH = "faiss_index.bin"
DEFAULT_DOC_METADATA_PATH = "doc_metadata.json" # To store original text chunks or references

# Ensure data directory exists for storing index and metadata
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)


class RAGProcessor:
    def __init__(
        self,
        embedding_model_name: str = DEFAULT_EMBEDDING_MODEL,
        faiss_index_path: str = str(DATA_DIR / DEFAULT_FAISS_INDEX_PATH),
        doc_metadata_path: str = str(DATA_DIR / DEFAULT_DOC_METADATA_PATH)
    ):
        self.embedding_model = SentenceTransformer(embedding_model_name)
        self.index_path = faiss_index_path
        self.metadata_path = doc_metadata_path
        self.index: Optional[faiss.Index] = None
        self.document_chunks: List[Dict[str, Any]] = [] # Stores {"text": "chunk_text", "source": "doc_name.md"}

        self._load_index_and_metadata()

    def _clean_text(self, text: str) -> str:
        """Basic text cleaning."""
        text = re.sub(r'\s+', ' ', text)  # Replace multiple whitespaces with single
        text = text.strip()
        return text

    def _load_markdown_docs_unstructured(self, docs_path: str) -> List[Dict[str, Any]]:
        """Loads and chunks markdown documents using Unstructured library."""
        processed_chunks = []
        for root, _, files in os.walk(docs_path):
            for file_name in files:
                if file_name.endswith(".md"):
                    file_path = os.path.join(root, file_name)
                    try:
                        # Partitioning separates elements like Title, NarrativeText, ListItem
                        elements = partition_md(filename=file_path, include_page_breaks=False)
                        # Chunking further splits elements if they are too large or based on titles
                        # This is a more sophisticated way to chunk than simple fixed size
                        # For chunk_by_title, elements must have 'text' and 'type' (like 'Title', 'NarrativeText')
                        # We might need to adapt how elements are structured if chunk_by_title is directly used
                        # For now, let's iterate through elements and treat them as chunks if they are text-based

                        # Simplified approach: treat each significant element as a potential chunk
                        # or combine smaller related elements.
                        # For more advanced chunking with Unstructured:
                        # chunks = chunk_by_title(elements, max_characters=1000, combine_text_under_n_chars=200)
                        # for chunk in chunks:
                        #    cleaned_text = self._clean_text(chunk.text)
                        #    if cleaned_text:
                        #        processed_chunks.append({"text": cleaned_text, "source": file_name})

                        current_chunk_text = ""
                        for el in elements:
                            # We are interested in text elements. Tables, Code blocks might need special handling.
                            if hasattr(el, 'text') and el.text.strip():
                                # Simple concatenation for now, could be smarter (e.g. respect titles as boundaries)
                                current_chunk_text += el.text + "\n"
                                if len(current_chunk_text) > 500: # Arbitrary chunk size limit
                                    cleaned_text = self._clean_text(current_chunk_text)
                                    if cleaned_text:
                                        processed_chunks.append({"text": cleaned_text, "source": file_name})
                                    current_chunk_text = ""
                        if current_chunk_text: # Add any remaining text
                            cleaned_text = self._clean_text(current_chunk_text)
                            if cleaned_text:
                                 processed_chunks.append({"text": cleaned_text, "source": file_name})

                    except Exception as e:
                        print(f"Error processing (Unstructured) file {file_path}: {e}")
        return processed_chunks

    def _load_markdown_docs_basic(self, docs_path: str) -> List[Dict[str, Any]]:
        """Basic fallback for loading and chunking markdown if Unstructured is not available."""
        processed_chunks = []
        chunk_size = 1000  # characters
        overlap = 100     # characters

        for root, _, files in os.walk(docs_path):
            for file_name in files:
                if file_name.endswith(".md"):
                    file_path = os.path.join(root, file_name)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            text = f.read()

                        # Basic chunking by splitting text (could be improved with sentence splitting)
                        for i in range(0, len(text), chunk_size - overlap):
                            chunk = text[i:i + chunk_size]
                            cleaned_chunk = self._clean_text(chunk)
                            if cleaned_chunk:
                                processed_chunks.append({"text": cleaned_chunk, "source": file_name})
                    except Exception as e:
                        print(f"Error processing (basic) file {file_path}: {e}")
        return processed_chunks

    def load_and_process_documents(self, docs_path: str) -> List[Dict[str, Any]]:
        """
        Loads documents from the specified path, processes them into text chunks.
        Uses Unstructured if available, otherwise falls back to basic markdown processing.
        """
        print(f"Loading documents from: {docs_path}")
        if UNSTRUCTURED_AVAILABLE:
            print("Using Unstructured for document processing.")
            self.document_chunks = self._load_markdown_docs_unstructured(docs_path)
        else:
            print("Using basic markdown processing.")
            self.document_chunks = self._load_markdown_docs_basic(docs_path)

        print(f"Loaded {len(self.document_chunks)} chunks from documents.")
        return self.document_chunks

    def create_and_save_index(self, document_chunks: Optional[List[Dict[str, Any]]] = None):
        """
        Creates a FAISS index from the given text chunks and saves it to disk.
        Also saves the document chunks metadata.
        """
        if document_chunks is not None:
            self.document_chunks = document_chunks

        if not self.document_chunks:
            print("No document chunks to index.")
            return

        texts_to_embed = [chunk["text"] for chunk in self.document_chunks]
        print(f"Generating embeddings for {len(texts_to_embed)} chunks...")
        embeddings = self.embedding_model.encode(texts_to_embed, convert_to_tensor=False) # Get numpy arrays

        if embeddings.ndim == 1: # Handle case where only one chunk is embedded
            embeddings = np.expand_dims(embeddings, axis=0)

        if embeddings.shape[0] == 0:
            print("No embeddings generated. Cannot create index.")
            return

        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)  # Using L2 distance
        self.index.add(embeddings.astype(np.float32)) # FAISS expects float32

        print(f"Saving FAISS index to {self.index_path} with {self.index.ntotal} vectors.")
        faiss.write_index(self.index, self.index_path)

        # Save metadata (the chunks themselves, or references)
        import json
        with open(self.metadata_path, 'w', encoding='utf-8') as f:
            json.dump(self.document_chunks, f, ensure_ascii=False, indent=4)
        print(f"Saved document metadata to {self.metadata_path}")

    def _load_index_and_metadata(self):
        """Loads the FAISS index and document metadata from disk if they exist."""
        import json
        if os.path.exists(self.index_path) and os.path.exists(self.metadata_path):
            try:
                print(f"Loading FAISS index from {self.index_path}")
                self.index = faiss.read_index(self.index_path)
                print(f"Loading document metadata from {self.metadata_path}")
                with open(self.metadata_path, 'r', encoding='utf-8') as f:
                    self.document_chunks = json.load(f)
                print(f"Successfully loaded index with {self.index.ntotal if self.index else 0} vectors and {len(self.document_chunks)} document chunks.")
            except Exception as e:
                print(f"Error loading existing index or metadata: {e}. Indexing may be required.")
                self.index = None
                self.document_chunks = []
        else:
            print("No existing FAISS index or metadata found. Indexing will be required.")

    def search_similar_documents(self, query_text: str, k: int = 5) -> List[Dict[str, Any]]:
        """
        Searches the FAISS index for documents similar to the query_text.
        Returns the top k similar document chunks with their text and source.
        """
        if self.index is None or not self.document_chunks:
            print("FAISS index not loaded or no documents available. Cannot search.")
            # Optionally, try to load again or raise an error
            self._load_index_and_metadata() # Attempt to reload
            if self.index is None or not self.document_chunks:
                 print("Still no index/metadata after attempting reload. Returning empty results.")
                 return []


        print(f"Searching for documents similar to: '{query_text[:100]}...'")
        query_embedding = self.embedding_model.encode([query_text], convert_to_tensor=False) # Get numpy array

        if query_embedding.ndim == 1:
             query_embedding = np.expand_dims(query_embedding, axis=0)

        # Ensure k is not greater than the number of items in the index
        num_indexed_items = self.index.ntotal
        actual_k = min(k, num_indexed_items)

        if actual_k == 0:
            print("Index is empty. Cannot perform search.")
            return []

        distances, indices = self.index.search(query_embedding.astype(np.float32), actual_k)

        results = []
        for i in range(len(indices[0])):
            idx = indices[0][i]
            if 0 <= idx < len(self.document_chunks): # Check bounds
                chunk_data = self.document_chunks[idx]
                results.append({
                    "text": chunk_data["text"],
                    "source": chunk_data.get("source", "Unknown source"), # Ensure source exists
                    "score": 1 - distances[0][i] # Example: converting L2 distance to a similarity score (0-1 range for normalized vectors)
                                                 # This is a simplistic score. For IndexFlatL2, smaller distance is better.
                                                 # A proper similarity score might depend on normalization or specific metric.
                })
            else:
                print(f"Warning: Index {idx} out of bounds for document_chunks list (length {len(self.document_chunks)}).")

        print(f"Found {len(results)} relevant chunks.")
        return results

# Example of how to use it (for direct testing of this file):
# if __name__ == "__main__":
#     # Path to your markdown documentation
#     docs_dir = "../../../docs" # Adjust this path to point to your actual docs folder relative to this file

#     rag_proc = RAGProcessor()

#     # 1. Load and process documents (only if index doesn't exist or needs update)
#     if not os.path.exists(str(DATA_DIR / DEFAULT_FAISS_INDEX_PATH)):
#         print("No index found, creating one...")
#         chunks = rag_proc.load_and_process_documents(docs_dir)
#         if chunks:
#             rag_proc.create_and_save_index(chunks)
#         else:
#             print("No chunks were loaded, skipping index creation.")
#     else:
#         print("Existing index found and loaded.")

#     # 2. Perform a search
#     if rag_proc.index is not None:
#         search_query = "How to use AI Assistant in BlockDeploy?"
#         similar_docs = rag_proc.search_similar_documents(search_query, k=3)

#         print(f"\nTop {len(similar_docs)} documents similar to '{search_query}':")
#         for i, doc in enumerate(similar_docs):
#             print(f"\n--- Document {i+1} (Source: {doc['source']}, Score: {doc['score']:.4f}) ---")
#             print(doc['text'][:300] + "...") # Print first 300 chars
#     else:
#         print("Cannot perform search as index is not available.")

#     search_query_2 = "Milestone M2 backend design"
#     similar_docs_2 = rag_proc.search_similar_documents(search_query_2, k=2)
#     print(f"\nTop {len(similar_docs_2)} documents similar to '{search_query_2}':")
#     for i, doc in enumerate(similar_docs_2):
#         print(f"\n--- Document {i+1} (Source: {doc['source']}, Score: {doc['score']:.4f}) ---")
#         print(doc['text'][:300] + "...")

#     # Test with a query that might not have good matches
#     search_query_3 = "Quantum Entanglement for Blockchain"
#     similar_docs_3 = rag_proc.search_similar_documents(search_query_3, k=1)
#     print(f"\nTop {len(similar_docs_3)} documents similar to '{search_query_3}':")
#     for i, doc in enumerate(similar_docs_3):
#         print(f"\n--- Document {i+1} (Source: {doc['source']}, Score: {doc['score']:.4f}) ---")
#         print(doc['text'][:300] + "...")

# To run this example:
# 1. Make sure you have sentence-transformers and faiss-cpu installed.
# 2. Place this file in backend/app/services/
# 3. Adjust the `docs_dir` path if necessary.
# 4. Run `python rag_processor.py` from the `backend/app/services/` directory.
#    (Or adjust paths and run from project root: `python -m app.services.rag_processor`)
#    The first run will create the index. Subsequent runs will load it.
