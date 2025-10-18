"""
Unit tests for QuestionService.
"""

import pytest
from unittest.mock import Mock, MagicMock
from fastapi import HTTPException

try:
    from app.services.question_service import QuestionService
    from app.database.repositories.question_repository import QuestionRepository
    from app.database.repositories.answer_repository import AnswerRepository
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from app.services.question_service import QuestionService
    from app.database.repositories.question_repository import QuestionRepository
    from app.database.repositories.answer_repository import AnswerRepository


class TestQuestionService:
    """Test cases for QuestionService."""
    
    def setup_method(self):
        """Set up test fixtures before each test method."""
        self.mock_question_repo = Mock(spec=QuestionRepository)
        self.mock_answer_repo = Mock(spec=AnswerRepository)
        self.question_service = QuestionService(
            question_repo=self.mock_question_repo,
            answer_repo=self.mock_answer_repo
        )
        self.mock_db = Mock()
    
    def test_create_question_success(self, sample_question_data):
        """Test successful question creation."""
        # Arrange
        mock_question = Mock()
        mock_question.id = 1
        self.mock_question_repo.get_by_access_code.return_value = None
        self.mock_question_repo.create.return_value = mock_question
        
        # Act
        result = self.question_service.create_question(
            self.mock_db,
            title=sample_question_data["title"],
            text=sample_question_data["text"],
            access_code=sample_question_data["access_code"]
        )
        
        # Assert
        assert result == 1
        self.mock_question_repo.create.assert_called_once()
        call_args = self.mock_question_repo.create.call_args
        assert call_args[0][1]["title"] == sample_question_data["title"]
        assert call_args[0][1]["text"] == sample_question_data["text"]
        assert call_args[0][1]["access_code"] == sample_question_data["access_code"]
        assert call_args[0][1]["is_closed"] == 0
    
    def test_create_question_duplicate_access_code(self, sample_question_data):
        """Test question creation with duplicate access code."""
        # Arrange
        existing_question = Mock()
        self.mock_question_repo.get_by_access_code.return_value = existing_question
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            self.question_service.create_question(
                self.mock_db,
                title=sample_question_data["title"],
                text=sample_question_data["text"],
                access_code=sample_question_data["access_code"]
            )
        
        assert exc_info.value.status_code == 400
        assert "already exists" in str(exc_info.value.detail)
        self.mock_question_repo.create.assert_not_called()
    
    def test_get_question_by_id_success(self):
        """Test successful question retrieval by ID."""
        # Arrange
        mock_question = Mock()
        mock_question.id = 1
        mock_question.title = "Test Question"
        mock_question.text = "Test text"
        mock_question.access_code = "TEST123"
        mock_question.is_closed = 0
        mock_question.created_at = None
        mock_question.close_date = None
        
        self.mock_question_repo.get.return_value = mock_question
        
        # Act
        result = self.question_service.get_question_by_id(self.mock_db, 1)
        
        # Assert
        assert result is not None
        assert result["id"] == 1
        assert result["title"] == "Test Question"
        assert result["text"] == "Test text"
        assert result["access_code"] == "TEST123"
        assert result["is_closed"] is False
    
    def test_get_question_by_id_not_found(self):
        """Test question retrieval by ID when question doesn't exist."""
        # Arrange
        self.mock_question_repo.get.return_value = None
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            self.question_service.get_question_by_id(self.mock_db, 999)
        
        assert exc_info.value.status_code == 404
        assert "not found" in str(exc_info.value.detail)
    
    def test_close_question_success(self):
        """Test successful question closure."""
        # Arrange
        mock_question = Mock()
        mock_question.id = 1
        mock_question.is_closed = 0
        mock_question.title = "Test Question"
        mock_question.text = "Test text"
        mock_question.access_code = "TEST123"
        mock_question.created_at = None
        mock_question.close_date = None
        
        self.mock_question_repo.get.return_value = mock_question
        self.mock_question_repo.update_status.return_value = mock_question
        
        # Act
        result = self.question_service.close_question(self.mock_db, 1)
        
        # Assert
        assert result is True
        self.mock_question_repo.update_status.assert_called_once_with(self.mock_db, 1, True)
    
    def test_close_question_already_closed(self):
        """Test closing a question that's already closed."""
        # Arrange
        mock_question = Mock()
        mock_question.id = 1
        mock_question.is_closed = 1  # Already closed
        mock_question.title = "Test Question"
        mock_question.text = "Test text"
        mock_question.access_code = "TEST123"
        mock_question.created_at = None
        mock_question.close_date = None
        
        self.mock_question_repo.get.return_value = mock_question
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            self.question_service.close_question(self.mock_db, 1)
        
        assert exc_info.value.status_code == 400
        assert "already closed" in str(exc_info.value.detail)
        self.mock_question_repo.update_status.assert_not_called()
    
    def test_get_questions_with_status_filter(self):
        """Test retrieving questions with status filter."""
        # Arrange
        mock_question = Mock()
        mock_question.id = 1
        mock_question.title = "Test Question"
        mock_question.text = "Test text"
        mock_question.access_code = "TEST123"
        mock_question.is_closed = 0
        mock_question.created_at = None
        mock_question.close_date = None
        
        self.mock_question_repo.get_all_by_status.return_value = [mock_question]
        self.mock_answer_repo.count_by_question_id.return_value = 3
        
        # Act
        result = self.question_service.get_questions(self.mock_db, is_closed=False)
        
        # Assert
        assert len(result) == 1
        assert result[0]["id"] == 1
        assert result[0]["answer_count"] == 3
        self.mock_question_repo.get_all_by_status.assert_called_once_with(self.mock_db, False)
    
    def test_get_question_by_code_success(self):
        """Test successful question retrieval by access code."""
        # Arrange
        mock_question = Mock()
        mock_question.id = 1
        mock_question.title = "Test Question"
        mock_question.text = "Test text"
        mock_question.access_code = "TEST123"
        mock_question.is_closed = 0
        mock_question.created_at = None
        mock_question.close_date = None
        
        self.mock_question_repo.get_by_access_code.return_value = mock_question
        
        # Act
        result = self.question_service.get_question_by_code(self.mock_db, "TEST123")
        
        # Assert
        assert result is not None
        assert result["access_code"] == "TEST123"
        self.mock_question_repo.get_by_access_code.assert_called_once_with(self.mock_db, "TEST123")
    
    def test_get_question_by_code_not_found(self):
        """Test question retrieval by access code when question doesn't exist."""
        # Arrange
        self.mock_question_repo.get_by_access_code.return_value = None
        
        # Act
        result = self.question_service.get_question_by_code(self.mock_db, "INVALID")
        
        # Assert
        assert result is None
        self.mock_question_repo.get_by_access_code.assert_called_once_with(self.mock_db, "INVALID")
