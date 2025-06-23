import pytest
from fastapi.testclient import TestClient
from typing import Generator

# Import the main FastAPI app instance
# Adjust the import path according to your project structure
from app.main import app


@pytest.fixture(scope="session")
def db() -> Generator:
    # Placeholder for database session fixture if needed in the future
    # For now, it does nothing
    # Example:
    # from app.db.session import SessionLocal
    # db = SessionLocal()
    # yield db
    # db.close()
    yield


@pytest.fixture(scope="module")
def client() -> Generator:
    with TestClient(app) as c:
        yield c
