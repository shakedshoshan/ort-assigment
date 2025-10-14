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

# Request body model for answer submission
class AnswerSubmission(BaseModel):
    access_code: str = Field(..., description="Question access code")
    student_id: str = Field(..., description="Student ID")
    answer_text: str = Field(..., max_length=200, description="Answer text (max 200 characters)")

# Student endpoints

@router.get("/question/{access_code}", status_code=status.HTTP_200_OK)
async def get_question_by_code(
    access_code: str = Path(..., description="Question access code"),
    student_id: str = Query(..., description="Student ID"),
    db: Session = Depends(get_db),
    question_service: QuestionService = Depends(get_question_service),
    student_service: StudentService = Depends(get_student_service)
) -> Dict[str, Any]:
    """
    Identify and retrieve a question for answering.
    
    Args:
        access_code: Question access code
        student_id: Student ID
        
    Returns:
        Question details
        
    Raises:
        HTTPException: If question not found or student ID invalid
    """
    try:
        # Validate student ID
        if not student_service.validate_student_id(student_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Student with ID '{student_id}' not found"
            )
        
        # Get question
        question = question_service.get_question_by_code(db, access_code)
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Question with access code '{access_code}' not found"
            )
        
        # Return question with student context
        return {
            **question,
            "student_id": student_id
        }
    except HTTPException as e:
        # Re-raise the exception
        raise e
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve question: {str(e)}"
        )

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
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Student with ID '{submission.student_id}' not found"
            )
        
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit answer: {str(e)}"
        )
