"""
Answer repository.
Handles database operations for answer entities.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ..models.answer import Answer
from .base import BaseRepository


class AnswerRepository(BaseRepository[Answer]):
    """
    Repository for answer database operations.
    
    Extends BaseRepository with answer-specific database operations.
    """
    
    def __init__(self):
        super().__init__(Answer)
    
    def get_by_question_id(self, db: Session, question_id: int) -> List[Answer]:
        """
        Get all answers for a specific question.
        
        Args:
            db: Database session
            question_id: Question ID to get answers for
            
        Returns:
            List of answers for the question
        """
        return db.query(self.model).filter(
            self.model.question_id == question_id
        ).order_by(self.model.timestamp.desc()).all()
    
    def get_by_question_and_student(self, db: Session, question_id: int, student_id: str) -> Optional[Answer]:
        """
        Get an answer by question ID and student ID.
        
        Args:
            db: Database session
            question_id: Question ID
            student_id: Student ID
            
        Returns:
            Answer if found, None otherwise
        """
        return db.query(self.model).filter(
            self.model.question_id == question_id,
            self.model.student_id == student_id
        ).first()
    
    def upsert(self, db: Session, answer_data: dict) -> Answer:
        """
        Create or update an answer in the database.
        
        Args:
            db: Database session
            answer_data: Dictionary with answer data
            
        Returns:
            The created/updated answer
        """
        # Try to find existing answer
        existing_answer = self.get_by_question_and_student(
            db, 
            answer_data["question_id"], 
            answer_data["student_id"]
        )
        
        if existing_answer:
            # Update existing answer
            existing_answer.text = answer_data["text"]
            db.commit()
            db.refresh(existing_answer)
            return existing_answer
        else:
            # Create new answer
            return self.create(db, answer_data)
    
    def get_by_student_id(self, db: Session, student_id: str) -> List[Answer]:
        """
        Get all answers by a specific student.
        
        Args:
            db: Database session
            student_id: Student ID
            
        Returns:
            List of answers by the student
        """
        return db.query(self.model).filter(
            self.model.student_id == student_id
        ).order_by(self.model.timestamp.desc()).all()
    
    def count_by_question_id(self, db: Session, question_id: int) -> int:
        """
        Get the count of answers for a specific question.
        
        Args:
            db: Database session
            question_id: Question ID
            
        Returns:
            Number of answers for the question
        """
        return db.query(self.model).filter(self.model.question_id == question_id).count()
