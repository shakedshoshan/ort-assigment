"""
Question repository.
Handles database operations for question entities.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.question import Question
from .base import BaseRepository


class QuestionRepository(BaseRepository[Question]):
    """
    Repository for question database operations.
    
    Extends BaseRepository with question-specific database operations.
    """
    
    def __init__(self):
        super().__init__(Question)
    
    def get_all_by_status(self, db: Session, is_closed: Optional[bool] = None) -> List[Question]:
        """
        Get all questions, optionally filtered by closed status.
        
        Args:
            db: Database session
            is_closed: Optional filter for closed status
            
        Returns:
            List of questions
        """
        query = db.query(self.model)
        if is_closed is not None:
            query = query.filter(self.model.is_closed == (1 if is_closed else 0))
        return query.all()
    
    def get_by_access_code(self, db: Session, access_code: str) -> Optional[Question]:
        """
        Get a question by access code.
        
        Args:
            db: Database session
            access_code: Access code to search for
            
        Returns:
            Question if found, None otherwise
        """
        return db.query(self.model).filter(self.model.access_code == access_code).first()
    
    def update_status(self, db: Session, question_id: int, is_closed: bool) -> Optional[Question]:
        """
        Update a question's closed status.
        
        Args:
            db: Database session
            question_id: Question ID to update
            is_closed: New closed status
            
        Returns:
            Updated question if found, None otherwise
        """
        question = self.get(db, question_id)
        if question:
            question.is_closed = 1 if is_closed else 0
            db.commit()
            db.refresh(question)
        return question
    
    def delete_question(self, db: Session, question_id: int) -> bool:
        """
        Delete a question by ID.
        
        Args:
            db: Database session
            question_id: Question ID to delete
            
        Returns:
            True if deleted successfully, False otherwise
        """
        question = self.get(db, question_id)
        if question:
            db.delete(question)
            db.commit()
            return True
        return False