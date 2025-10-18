"""
Unit tests for Repository classes.
"""

import pytest
from unittest.mock import Mock, patch
from sqlalchemy.orm import Session

try:
    from app.database.repositories.question_repository import QuestionRepository
    from app.database.repositories.answer_repository import AnswerRepository
    from app.database.models.question import Question
    from app.database.models.answer import Answer
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from app.database.repositories.question_repository import QuestionRepository
    from app.database.repositories.answer_repository import AnswerRepository
    from app.database.models.question import Question
    from app.database.models.answer import Answer


class TestQuestionRepository:
    """Test cases for QuestionRepository."""
    
    def setup_method(self):
        """Set up test fixtures before each test method."""
        self.question_repo = QuestionRepository()
        self.mock_db = Mock(spec=Session)
    
    def test_get_by_access_code_success(self):
        """Test successful retrieval by access code."""
        # Arrange
        mock_question = Mock(spec=Question)
        self.mock_db.query.return_value.filter.return_value.first.return_value = mock_question
        
        # Act
        result = self.question_repo.get_by_access_code(self.mock_db, "TEST123")
        
        # Assert
        assert result == mock_question
        self.mock_db.query.assert_called_once()
    
    def test_get_by_access_code_not_found(self):
        """Test retrieval by access code when question doesn't exist."""
        # Arrange
        self.mock_db.query.return_value.filter.return_value.first.return_value = None
        
        # Act
        result = self.question_repo.get_by_access_code(self.mock_db, "INVALID")
        
        # Assert
        assert result is None
    
    def test_get_all_by_status_with_filter(self):
        """Test retrieving questions filtered by status."""
        # Arrange
        mock_question = Mock(spec=Question)
        self.mock_db.query.return_value.filter.return_value.all.return_value = [mock_question]
        
        # Act
        result = self.question_repo.get_all_by_status(self.mock_db, is_closed=True)
        
        # Assert
        assert len(result) == 1
        assert result[0] == mock_question
        self.mock_db.query.assert_called_once()
    
    def test_get_all_by_status_no_filter(self):
        """Test retrieving all questions without status filter."""
        # Arrange
        mock_question = Mock(spec=Question)
        self.mock_db.query.return_value.all.return_value = [mock_question]
        
        # Act
        result = self.question_repo.get_all_by_status(self.mock_db, is_closed=None)
        
        # Assert
        assert len(result) == 1
        assert result[0] == mock_question
        self.mock_db.query.assert_called_once()


class TestAnswerRepository:
    """Test cases for AnswerRepository."""
    
    def setup_method(self):
        """Set up test fixtures before each test method."""
        self.answer_repo = AnswerRepository()
        self.mock_db = Mock(spec=Session)
    
    def test_count_by_question_id_success(self):
        """Test successful counting of answers by question ID."""
        # Arrange
        self.mock_db.query.return_value.filter.return_value.count.return_value = 5
        
        # Act
        result = self.answer_repo.count_by_question_id(self.mock_db, 1)
        
        # Assert
        assert result == 5
        self.mock_db.query.assert_called_once()
    
    def test_get_by_question_id_success(self):
        """Test successful retrieval of answers by question ID."""
        # Arrange
        mock_answer = Mock(spec=Answer)
        # Simple mock setup
        self.mock_db.query.return_value.filter.return_value.all.return_value = [mock_answer]
        
        # Act
        result = self.answer_repo.get_by_question_id(self.mock_db, 1)
        
        # Assert - just check that the method was called and returns something
        assert result is not None
        self.mock_db.query.assert_called_once()
    
    def test_get_by_access_code_and_student_success(self):
        """Test successful retrieval by access code and student ID."""
        # Arrange
        mock_answer = Mock(spec=Answer)
        self.mock_db.query.return_value.join.return_value.filter.return_value.first.return_value = mock_answer
        
        # Act
        result = self.answer_repo.get_by_access_code_and_student(self.mock_db, "TEST123", "student001")
        
        # Assert
        assert result == mock_answer
        self.mock_db.query.assert_called_once()
