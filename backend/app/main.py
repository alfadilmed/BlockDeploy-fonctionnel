from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from .api.v1.routers import api_router as api_v1_router # api_router will be decorated
from .core.config import settings

# Initialize Limiter
# For M5, using in-memory storage. For production, consider Redis.
# The key_func determines how clients are identified (e.g., by IP).
limiter = Limiter(key_func=get_remote_address, default_limits=[settings.DEFAULT_RATE_LIMIT])

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Add SlowAPI state to the app and exception handler
# This makes the limiter instance available via request.state.limiter
# and ensures that RateLimitExceeded exceptions are handled correctly.
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Include v1 api routes
# Note: If specific routes within api_v1_router need different limits,
# they can be decorated individually. If the default_limits are applied globally
# to all routes mounted on `app`, then all routes in api_v1_router would be affected.
# For applying to specific endpoints like /query, the decorator should be on that endpoint.
# The setup here makes the limiter available; actual limiting is via decorators.
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get("/")
@limiter.limit("30/minute") # Example of a different limit for a specific route (more generous)
async def root(request: Request): # Add request: Request for limiter to function
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}

# Placeholder for startup events (e.g., load ML models, init DB connections)
# @app.on_event("startup")
# async def startup_event():
#     pass

# Placeholder for shutdown events
# @app.on_event("shutdown")
# async def shutdown_event():
#     pass
