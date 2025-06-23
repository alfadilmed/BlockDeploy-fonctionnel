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

    class Config:
        case_sensitive = True
        # env_file = ".env" # uncomment if you want to strictly load from .env without python-dotenv

settings = Settings()
