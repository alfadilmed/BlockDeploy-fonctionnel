from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "BlockDeploy AI Assistant Backend"
    API_V1_STR: str = "/api/v1"

    # LLM Configuration (placeholders for now)
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock") # e.g., "openai", "gemini", "mock"
    LLM_API_KEY: str | None = os.getenv("LLM_API_KEY")
    LLM_DEFAULT_MODEL: str = os.getenv("LLM_DEFAULT_MODEL", "mock-model")

    # Logging Configuration (placeholders)
    LOG_LEVEL: str = "INFO"

    # Rate Limiting
    DEFAULT_RATE_LIMIT: str = os.getenv("DEFAULT_RATE_LIMIT", "10/minute") # Default: 10 requests per minute per IP

    # RAG Configuration
    # Default paths are relative to backend/app/data/ if this script is run from backend/
    # However, RAGProcessor now defines DATA_DIR relative to its own location.
    # It's better to make these absolute or clearly relative to a known root at runtime.
    # For now, these will be resolved by RAGProcessor if not absolute.
    FAISS_INDEX_PATH: str = os.getenv("FAISS_INDEX_PATH", "faiss_index.bin")
    DOC_METADATA_PATH: str = os.getenv("DOC_METADATA_PATH", "doc_metadata.json")
    EMBEDDING_MODEL_NAME: str = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")


    class Config:
        case_sensitive = True
        # env_file = ".env" # uncomment if you want to strictly load from .env without python-dotenv

settings = Settings()
