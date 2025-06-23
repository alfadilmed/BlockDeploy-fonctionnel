from fastapi import APIRouter
from .endpoints import query as query_router # Will be created in a later step

api_router = APIRouter()

# Include specific endpoint routers here
# Example: api_router.include_router(auth_router.router, prefix="/auth", tags=["auth"])
api_router.include_router(query_router.router, prefix="/ai-assistant", tags=["AI Assistant"])
