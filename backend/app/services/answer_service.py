"""
Answer service layer.
This module handles business logic for answer operations.
"""

from typing import List, Dict, Any, Optional
from fastapi import HTTPException

try:
    from app.database.repositories.answer_repository import AnswerRepository
    from .question_service import QuestionService
    from .student_service import StudentService
except ImportError:
    # Fallback for direct execution
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from app.database.repositories.answer_repository import AnswerRepository
    from .question_service import QuestionService
    from .student_service import StudentService


class AnswerService:
    """Service class for answer operations."""
    
    def __init__(self, answer_repo: AnswerRepository, question_service: QuestionService, student_service: StudentService = None):
        """
        Initializes dependencies on the Answer Repository and Question Service.
        
        Args:
            answer_repo: Answer repository instance
            question_service: Question service instance
            student_service: Student service instance (optional, will create default if None)
        """
        self.answer_repo = answer_repo
        self.question_service = question_service
        self.student_service = student_service or StudentService()
    
    def submit_or_update_answer(self, db, access_code: str, student_id: str, answer_text: str) -> Dict[str, Any]:
        """
        Core Logic: Handles the submission/update flow.
        Checks if the question is open and the student ID is valid, then calls the repository
        to UPSERT (Update or Insert) the answer based on the unique constraint (question_id, student_id).
        
        Args:
            db: Database session
            access_code: Question access code
            student_id: Student ID submitting the answer
            answer_text: Answer text content
            
        Returns:
            Dictionary with the submitted/updated answer
            
        Raises:
            HTTPException: If question not found, closed, or student ID invalid
        """
        # Validate text length
        if len(answer_text) > 200:
            raise HTTPException(
                status_code=400,
                detail="Answer text must be 200 characters or less"
            )
        
        # Get question by access code
        question = self.question_service.get_question_by_code(db, access_code)
        if not question:
            raise HTTPException(
                status_code=404,
                detail=f"Question with access code '{access_code}' not found"
            )
        
        # Check if question is closed
        if question.get("is_closed"):
            raise HTTPException(
                status_code=400,
                detail="Cannot submit answer to a closed question"
            )
        
        # Prepare answer data
        answer_data = {
            "question_id": question.get("id"),
            "student_id": student_id,
            "text": answer_text
        }
        
        # Create or update answer
        answer = self.answer_repo.upsert(db, answer_data)
        return self._answer_to_dict(answer)
    
    def get_answers_for_question(self, db, question_id: int) -> List[Dict[str, Any]]:
        """
        Retrieves all answers submitted for a specific question ID (for the teacher's view).
        
        Args:
            db: Database session
            question_id: Question ID to get answers for
            
        Returns:
            List of answer dictionaries
            
        Raises:
            HTTPException: If question not found
        """
        # Check if question exists
        self.question_service.get_question_by_id(db, question_id)
        
        # Get answers for question
        answers = self.answer_repo.get_by_question_id(db, question_id)
        return [self._answer_to_dict(answer) for answer in answers]
    
    def get_answer_by_access_code_and_student(self, db, access_code: str, student_id: str) -> Optional[Dict[str, Any]]:
        """
        Get an answer by access code and student ID.
        
        Args:
            db: Database session
            access_code: Question access code
            student_id: Student ID
            
        Returns:
            Answer dictionary if found, None otherwise
        """
        answer = self.answer_repo.get_by_access_code_and_student(db, access_code, student_id)
        return self._answer_to_dict(answer) if answer else None
    
    def _answer_to_dict(self, answer) -> Dict[str, Any]:
        """
        Convert SQLAlchemy answer object to dictionary.
        
        Args:
            answer: SQLAlchemy answer object
            
        Returns:
            Answer dictionary with student name included
        """
        if not answer:
            return None
        
        # Get student name
        student_name = None
        try:
            student = self.student_service.get_student_by_id(answer.student_id)
            student_name = student.get("name") if student else None
        except HTTPException:
            # If student not found, keep name as None
            student_name = None
        
        return {
            "id": answer.id,
            "question_id": answer.question_id,
            "student_id": answer.student_id,
            "student_name": student_name,
            "text": answer.text,
            "timestamp": answer.timestamp.isoformat() if answer.timestamp else None
        }
