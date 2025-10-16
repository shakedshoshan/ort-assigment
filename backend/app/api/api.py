"""
API router configuration.
This module contains the main API router that includes all endpoint routers.
"""

from fastapi import APIRouter
try:
    from app.api.endpoints import students, questions, answers, ai
except ImportError:
    # Fallback for direct execution
    from .endpoints import students, questions, answers, ai

# Create main API router
api_router = APIRouter()

# Include endpoint routers
api_router.include_router(
    students.router, 
    prefix="/students", 
    tags=["students"]
)

api_router.include_router(
    questions.router,
    prefix="/questions",
    tags=["questions"]
)

api_router.include_router(
    answers.router,
    prefix="/answers",
    tags=["answers"]
)

api_router.include_router(
    ai.router,
    prefix="/ai",
    tags=["ai"]
)

