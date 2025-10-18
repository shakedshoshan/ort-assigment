"""
Integration tests for Questions API endpoints.
"""

import pytest
from fastapi.testclient import TestClient


class TestQuestionsAPI:
    """Test cases for Questions API endpoints."""
    
    def test_create_question_success(self, client: TestClient, sample_question_data):
        """Test successful question creation via API."""
        response = client.post("/api/v1/questions/open", json=sample_question_data)
        
        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert data["title"] == sample_question_data["title"]
    
    def test_create_question_duplicate_access_code(self, client: TestClient, sample_question_data):
        """Test question creation with duplicate access code via API."""
        # Create first question
        client.post("/api/v1/questions/open", json=sample_question_data)
        
        # Try to create second question with same access code
        response = client.post("/api/v1/questions/open", json=sample_question_data)
        
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]
    
    def test_get_questions_success(self, client: TestClient, sample_question_data):
        """Test successful questions retrieval via API."""
        # Create a question first
        client.post("/api/v1/questions/open", json=sample_question_data)
        
        response = client.get("/api/v1/questions")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
    
    def test_get_questions_with_status_filter(self, client: TestClient, sample_question_data):
        """Test questions retrieval with status filter via API."""
        # Create a question first
        client.post("/api/v1/questions/open", json=sample_question_data)
        
        response = client.get("/api/v1/questions?status=open")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_create_question_missing_fields(self, client: TestClient):
        """Test question creation with missing required fields."""
        incomplete_data = {"title": "Test Question"}  # Missing text and access_code
        
        response = client.post("/api/v1/questions/open", json=incomplete_data)
        
        assert response.status_code == 422  # Validation error
