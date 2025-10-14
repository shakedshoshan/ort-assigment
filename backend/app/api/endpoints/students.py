"""
Students API endpoints.
This module handles all student-related API operations.
"""

from typing import List
from fastapi import APIRouter, Depends

try:
    from app.models.student import Student, StudentCreate, StudentUpdate
    from app.services.student_service import StudentService
except ImportError:
    # Fallback for direct execution
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    from app.models.student import Student, StudentCreate, StudentUpdate
    from app.services.student_service import StudentService

# Create router for students endpoints
router = APIRouter()

# Dependency to get student service
def get_student_service() -> StudentService:
    """Get student service instance."""
    return StudentService()

@router.get("/", response_model=List[Student])
async def get_students(service: StudentService = Depends(get_student_service)):
    """Get all students."""
    return service.get_all_students()

@router.get("/{student_id}", response_model=Student)
async def get_student(student_id: str, service: StudentService = Depends(get_student_service)):
    """Get a specific student by ID."""
    return service.get_student_by_id(student_id)
