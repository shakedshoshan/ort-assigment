"""
Question service layer.
This module handles business logic for question operations.
"""

from typing import List, Dict, Any, Optional
from fastapi import HTTPException

try:
    from app.database.repositories.question_repository import QuestionRepository
except ImportError:
    # Fallback for direct execution
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from app.database.repositories.question_repository import QuestionRepository


class QuestionService:
    """Service class for question operations."""
    
    def __init__(self, question_repo: QuestionRepository):
        """
        Initializes the repository dependency.
        
        Args:
            question_repo: Question repository instance
        """
        self.question_repo = question_repo
    
    def create_question(self, db, title: str, text: str, access_code: str) -> int:
        """
        Creates a new question, ensuring the access_code is unique.
        Raises an exception on conflict.
        
        Args:
            db: Database session
            title: Question title
            text: Question text
            access_code: Unique access code
            
        Returns:
            ID of the created question
            
        Raises:
            HTTPException: If access code already exists
        """
        # Check if access code already exists
        existing_question = self.get_question_by_code(db, access_code)
        if existing_question:
            raise HTTPException(
                status_code=400,
                detail=f"Question with access code '{access_code}' already exists"
            )
        
        # Create question data
        question_data = {
            "title": title,
            "text": text,
            "access_code": access_code,
            "is_closed": 0
        }
        
        # Create question and return ID
        question = self.question_repo.create(db, question_data)
        return question.id
    
    def get_questions(self, db, is_closed: Optional[bool] = None) -> List[Dict[str, Any]]:
        """
        Retrieves a list of questions, filtered optionally by their is_closed status.
        
        Args:
            db: Database session
            is_closed: Optional filter for closed status
            
        Returns:
            List of question dictionaries
        """
        questions = self.question_repo.get_all_by_status(db, is_closed)
        return [self._question_to_dict(q) for q in questions]
    
    def get_question_by_id(self, db, question_id: int) -> Optional[Dict[str, Any]]:
        """
        Retrieves a single question by its internal ID.
        
        Args:
            db: Database session
            question_id: Question ID
            
        Returns:
            Question dictionary if found, None otherwise
        """
        question = self.question_repo.get(db, question_id)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        return self._question_to_dict(question)
    
    def get_question_by_code(self, db, access_code: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves a single question by its unique access_code.
        
        Args:
            db: Database session
            access_code: Access code to search for
            
        Returns:
            Question dictionary if found, None otherwise
        """
        question = self.question_repo.get_by_access_code(db, access_code)
        return self._question_to_dict(question) if question else None
    
    def close_question(self, db, question_id: int) -> bool:
        """
        Updates a question's status to closed.
        Checks if the question exists and is not already closed.
        
        Args:
            db: Database session
            question_id: Question ID to close
            
        Returns:
            True if closed successfully, False otherwise
            
        Raises:
            HTTPException: If question not found or already closed
        """
        # Get question to check if it exists and its current status
        question = self.get_question_by_id(db, question_id)
        
        # Check if already closed
        if question.get("is_closed"):
            raise HTTPException(
                status_code=400,
                detail="Question is already closed"
            )
        
        # Update question status
        updated_question = self.question_repo.update_status(db, question_id, True)
        return updated_question is not None
    
    def _question_to_dict(self, question) -> Dict[str, Any]:
        """
        Convert SQLAlchemy question object to dictionary.
        
        Args:
            question: SQLAlchemy question object
            
        Returns:
            Question dictionary
        """
        if not question:
            return None
        
        return {
            "id": question.id,
            "title": question.title,
            "text": question.text,
            "access_code": question.access_code,
            "is_closed": bool(question.is_closed)
        }
