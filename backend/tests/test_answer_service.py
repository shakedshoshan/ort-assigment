"""
Unit tests for AnswerService.
"""

import pytest
from unittest.mock import Mock
from fastapi import HTTPException

try:
    from app.services.answer_service import AnswerService
    from app.database.repositories.answer_repository import AnswerRepository
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from app.services.answer_service import AnswerService
    from app.database.repositories.answer_repository import AnswerRepository


class TestAnswerService:
    """Test cases for AnswerService."""
    
    def setup_method(self):
        """Set up test fixtures before each test method."""
        self.mock_answer_repo = Mock(spec=AnswerRepository)
        self.mock_question_service = Mock()
        self.mock_student_service = Mock()
        self.answer_service = AnswerService(
            answer_repo=self.mock_answer_repo,
            question_service=self.mock_question_service,
            student_service=self.mock_student_service
        )
        self.mock_db = Mock()
    
    def test_submit_answer_success(self, sample_answer_data):
        """Test successful answer submission."""
        # Arrange
        mock_question = {
            "id": 1,
            "title": "Test Question",
            "text": "Test text",
            "access_code": "TEST123",
            "is_closed": False
        }
        mock_answer = Mock()
        mock_answer.id = 1
        mock_answer.question_id = 1
        mock_answer.student_id = "student001"
        mock_answer.text = "Test answer"
        mock_answer.timestamp = None
        
        self.mock_question_service.get_question_by_code.return_value = mock_question
        self.mock_answer_repo.upsert.return_value = mock_answer
        self.mock_student_service.get_student_by_id.return_value = {"name": "John Doe"}
        
        # Act
        result = self.answer_service.submit_or_update_answer(
            self.mock_db,
            sample_answer_data["access_code"],
            sample_answer_data["student_id"],
            sample_answer_data["answer_text"]
        )
        
        # Assert
        assert result is not None
        assert result["student_id"] == "student001"
        assert result["text"] == "Test answer"
        self.mock_answer_repo.upsert.assert_called_once()
    
    def test_submit_answer_question_not_found(self, sample_answer_data):
        """Test answer submission when question doesn't exist."""
        # Arrange
        self.mock_question_service.get_question_by_code.return_value = None
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            self.answer_service.submit_or_update_answer(
                self.mock_db,
                sample_answer_data["access_code"],
                sample_answer_data["student_id"],
                sample_answer_data["answer_text"]
            )
        
        assert exc_info.value.status_code == 404
        assert "not found" in str(exc_info.value.detail)
    
    def test_submit_answer_question_closed(self, sample_answer_data):
        """Test answer submission to closed question."""
        # Arrange
        mock_question = {
            "id": 1,
            "title": "Test Question",
            "text": "Test text",
            "access_code": "TEST123",
            "is_closed": True  # Question is closed
        }
        self.mock_question_service.get_question_by_code.return_value = mock_question
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            self.answer_service.submit_or_update_answer(
                self.mock_db,
                sample_answer_data["access_code"],
                sample_answer_data["student_id"],
                sample_answer_data["answer_text"]
            )
        
        assert exc_info.value.status_code == 400
        assert "closed question" in str(exc_info.value.detail)
    
    def test_submit_answer_text_too_long(self, sample_answer_data):
        """Test answer submission with text too long."""
        # Arrange
        long_text = "x" * 201  # 201 characters, limit is 200
        mock_question = {
            "id": 1,
            "title": "Test Question",
            "text": "Test text",
            "access_code": "TEST123",
            "is_closed": False
        }
        self.mock_question_service.get_question_by_code.return_value = mock_question
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            self.answer_service.submit_or_update_answer(
                self.mock_db,
                sample_answer_data["access_code"],
                sample_answer_data["student_id"],
                long_text
            )
        
        assert exc_info.value.status_code == 400
        assert "200 characters or less" in str(exc_info.value.detail)
    
    def test_get_answers_for_question_success(self):
        """Test successful retrieval of answers for a question."""
        # Arrange
        mock_question = {
            "id": 1,
            "title": "Test Question",
            "text": "Test text",
            "access_code": "TEST123",
            "is_closed": False
        }
        mock_answer = Mock()
        mock_answer.id = 1
        mock_answer.question_id = 1
        mock_answer.student_id = "student001"
        mock_answer.text = "Test answer"
        mock_answer.timestamp = None
        
        self.mock_question_service.get_question_by_id.return_value = mock_question
        self.mock_answer_repo.get_by_question_id.return_value = [mock_answer]
        self.mock_student_service.get_student_by_id.return_value = {"name": "John Doe"}
        
        # Act
        result = self.answer_service.get_answers_for_question(self.mock_db, 1)
        
        # Assert
        assert len(result) == 1
        assert result[0]["question_id"] == 1
        assert result[0]["student_id"] == "student001"
        self.mock_answer_repo.get_by_question_id.assert_called_once_with(self.mock_db, 1)
    
    def test_get_answers_for_question_not_found(self):
        """Test getting answers for non-existent question."""
        # Arrange
        self.mock_question_service.get_question_by_id.side_effect = HTTPException(status_code=404, detail="Question not found")
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            self.answer_service.get_answers_for_question(self.mock_db, 999)
        
        assert exc_info.value.status_code == 404
