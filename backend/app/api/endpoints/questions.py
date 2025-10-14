"""
Questions API endpoints.
This module handles all question-related API operations.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlalchemy.orm import Session

try:
    from app.database.config import get_db
    from app.services.question_service import QuestionService
    from app.database.repositories.question_repository import QuestionRepository
except ImportError:
    # Fallback for direct execution
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    from app.database.config import get_db
    from app.services.question_service import QuestionService
    from app.database.repositories.question_repository import QuestionRepository

# Create router for questions endpoints
router = APIRouter()

# Dependency to get question service
def get_question_service() -> QuestionService:
    """Get question service instance."""
    return QuestionService(QuestionRepository())

# Teacher endpoints

@router.post("/open", status_code=status.HTTP_201_CREATED)
async def create_question(
    title: str,
    text: str,
    access_code: str,
    db: Session = Depends(get_db),
    service: QuestionService = Depends(get_question_service)
) -> Dict[str, Any]:
    """
    Create and open a new question.
    
    Args:
        title: Question title
        text: Question text
        access_code: Unique access code for the question
        
    Returns:
        Created question
        
    Raises:
        HTTPException: If access_code already exists
    """
    try:
        question_id = service.create_question(db, title, text, access_code)
        return {
            "id": question_id,
            "title": title,
            "text": text,
            "access_code": access_code,
            "is_closed": False,
            "message": "Question created successfully"
        }
    except HTTPException as e:
        # Re-raise the exception
        raise e
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create question: {str(e)}"
        )

@router.patch("/{question_id}/close", status_code=status.HTTP_200_OK)
async def close_question(
    question_id: int = Path(..., title="Question ID", description="ID of the question to close"),
    db: Session = Depends(get_db),
    service: QuestionService = Depends(get_question_service)
) -> Dict[str, Any]:
    """
    Close an existing question, preventing further answers/edits.
    
    Args:
        question_id: ID of the question to close
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If question not found or already closed
    """
    try:
        question = service.get_question_by_id(db, question_id)
        
        # Check if already closed
        if question.get("is_closed"):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Question is already closed"
            )
        
        # Close question
        success = service.close_question(db, question_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to close question"
            )
        
        return {
            "id": question_id,
            "message": "Question closed successfully"
        }
    except HTTPException as e:
        # Re-raise the exception
        raise e
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to close question: {str(e)}"
        )

@router.get("/", status_code=status.HTTP_200_OK)
async def get_questions(
    status_filter: Optional[str] = Query(
        None, 
        title="Status Filter", 
        description="Filter questions by status (open, closed, or absent for all)",
        alias="status"
    ),
    db: Session = Depends(get_db),
    service: QuestionService = Depends(get_question_service)
) -> List[Dict[str, Any]]:
    """
    Retrieve a list of questions, optionally filtered by status.
    
    Args:
        status_filter: Optional filter for question status (open, closed, or absent for all)
        
    Returns:
        List of questions
    """
    try:
        # Convert status string to boolean
        is_closed = None
        if status_filter == "open":
            is_closed = False
        elif status_filter == "closed":
            is_closed = True
        
        # Get questions
        return service.get_questions(db, is_closed)
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve questions: {str(e)}"
        )

@router.get("/{question_id}/answers", status_code=status.HTTP_200_OK)
async def get_question_answers(
    question_id: int = Path(..., title="Question ID", description="ID of the question to get answers for"),
    db: Session = Depends(get_db),
    question_service: QuestionService = Depends(get_question_service),
    answer_service=Depends(lambda: get_answer_service())
) -> List[Dict[str, Any]]:
    """
    View all submitted answers for a specific question.
    
    Args:
        question_id: ID of the question to get answers for
        
    Returns:
        List of answers for the question
        
    Raises:
        HTTPException: If question not found
    """
    try:
        # Check if question exists
        question_service.get_question_by_id(db, question_id)
        
        # Get answers
        return answer_service.get_answers_for_question(db, question_id)
    except HTTPException as e:
        # Re-raise the exception
        raise e
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve answers: {str(e)}"
        )

# Import here to avoid circular imports
def get_answer_service():
    """Get answer service instance."""
    from app.services.answer_service import AnswerService
    from app.database.repositories.answer_repository import AnswerRepository
    return AnswerService(AnswerRepository(), get_question_service())
