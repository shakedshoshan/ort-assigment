"""
API router configuration.
This module contains the main API router that includes all endpoint routers.
"""

from fastapi import APIRouter
try:
    from app.api.endpoints import students
except ImportError:
    # Fallback for direct execution
    from .endpoints import students

# Create main API router
api_router = APIRouter()

# Include endpoint routers
api_router.include_router(
    students.router, 
    prefix="/students", 
    tags=["students"]
)


