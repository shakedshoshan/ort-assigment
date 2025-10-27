"""
Answers API endpoints.
This module handles all answer-related API operations.
"""

from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Path, Query, status, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

try:
    from app.database.config import get_db
    from app.services.answer_service import AnswerService
    from app.services.question_service import QuestionService
    from app.services.student_service import StudentService
    from app.database.repositories.answer_repository import AnswerRepository
    from app.database.repositories.question_repository import QuestionRepository
    from app.utils.error_handler import handle_not_found_exception, handle_unexpected_error
except ImportError:
    # Fallback for direct execution
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    from app.database.config import get_db
    from app.services.answer_service import AnswerService
    from app.services.question_service import QuestionService
    from app.services.student_service import StudentService
    from app.database.repositories.answer_repository import AnswerRepository
    from app.database.repositories.question_repository import QuestionRepository
    from app.utils.error_handler import handle_not_found_exception, handle_unexpected_error

# Create router for answers endpoints
router = APIRouter()

# Dependency to get services
def get_answer_service() -> AnswerService:
    """Get answer service instance."""
    return AnswerService(AnswerRepository(), get_question_service())

def get_question_service() -> QuestionService:
    """Get question service instance."""
    return QuestionService(QuestionRepository())

def get_student_service() -> StudentService:
    """Get student service instance."""
    return StudentService()

# Request body models
class QuestionAccess(BaseModel):
    student_id: str = Field(..., description="Student ID")

class AnswerSubmission(BaseModel):
    access_code: str = Field(..., description="Question access code")
    student_id: str = Field(..., description="Student ID")
    answer_text: str = Field(..., max_length=200, description="Answer text (max 200 characters)")

# Student endpoints

@router.post("/question/{access_code}", status_code=status.HTTP_200_OK)
async def get_question_by_code(
    access_code: str = Path(..., description="Question access code"),
    request_data: QuestionAccess = Body(..., description="Student ID in request body"),
    db: Session = Depends(get_db),
    question_service: QuestionService = Depends(get_question_service),
    student_service: StudentService = Depends(get_student_service),
    answer_service: AnswerService = Depends(get_answer_service)
) -> Dict[str, Any]:
    """
    Identify and retrieve a question for answering.
    
    Args:
        access_code: Question access code (from URL path)
        request_data: Student ID in request body
        
    Returns:
        Question details with existing answer if found
        
    Raises:
        HTTPException: If question not found or student ID invalid
    """
    try:
        # Validate student ID
        if not student_service.validate_student_id(request_data.student_id):
            raise handle_not_found_exception("Student", request_data.student_id)
        
        # Get question
        question = question_service.get_question_by_code(db, access_code)
        if not question:
            raise handle_not_found_exception("Question", access_code)
        
        # Check if student already has an answer for this question
        existing_answer = answer_service.get_answer_by_access_code_and_student(
            db, access_code, request_data.student_id
        )
        
        # Return question with student context and existing answer text
        return {
            **question,
            "student_id": request_data.student_id,
            "answer": existing_answer.get("text") if existing_answer else None
        }
    except HTTPException as e:
        # Re-raise the exception
        raise e
    except Exception as e:
        # Handle unexpected errors
        raise handle_unexpected_error("retrieve question", e)

@router.post("/submit", status_code=status.HTTP_200_OK) 
async def submit_answer(
    submission: AnswerSubmission,
    db: Session = Depends(get_db),
    answer_service: AnswerService = Depends(get_answer_service),
    question_service: QuestionService = Depends(get_question_service),
    student_service: StudentService = Depends(get_student_service)
) -> Dict[str, Any]:
    """
    Submit a new answer or update an existing answer.
    
    Args:
        submission: Answer submission data
        
    Returns:
        Submitted/updated answer
        
    Raises:
        HTTPException: If question not found, closed, student ID invalid, or text too long
    """
    try:
        # Validate student ID
        if not student_service.validate_student_id(submission.student_id):
            raise handle_not_found_exception("Student", submission.student_id)
        
        # Submit/update answer
        answer = answer_service.submit_or_update_answer(
            db, 
            submission.access_code, 
            submission.student_id, 
            submission.answer_text
        )
        
        # Get student name for response
        student = student_service.get_student_by_id(submission.student_id)
        student_name = student.get("name", "Unknown")
        
        # Return answer with context
        return {
            **answer,
            "student_name": student_name,
            "message": "Answer submitted successfully"
        }
    except HTTPException as e:
        # Re-raise the exception
        raise e
    except Exception as e:
        # Handle unexpected errors
        raise handle_unexpected_error("submit answer", e)
