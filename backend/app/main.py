from fastapi import FastAPI
from .api.v1.routers import api_router as api_v1_router
from .core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Include v1 api routes
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}

# Placeholder for startup events (e.g., load ML models, init DB connections)
# @app.on_event("startup")
# async def startup_event():
#     pass

# Placeholder for shutdown events
# @app.on_event("shutdown")
# async def shutdown_event():
#     pass
