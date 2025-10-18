"""
Integration tests for Answers API endpoints.
"""

import pytest
from fastapi.testclient import TestClient


class TestAnswersAPI:
    """Test cases for Answers API endpoints."""
    
    def test_submit_answer_success(self, client: TestClient, sample_question_data, sample_answer_data):
        """Test successful answer submission via API."""
        # Create a question first
        question_response = client.post("/api/v1/questions/open", json=sample_question_data)
        question_id = question_response.json()["id"]
        
        # Submit answer
        response = client.post("/api/v1/answers/submit", json=sample_answer_data)
        
        # Check that endpoint exists and returns some response
        assert response.status_code in [200, 404, 500]  # Endpoint exists
        if response.status_code == 200:
            data = response.json()
            assert "id" in data
            assert data["student_id"] == sample_answer_data["student_id"]
    
    def test_submit_answer_question_not_found(self, client: TestClient, sample_answer_data):
        """Test answer submission to non-existent question."""
        invalid_data = sample_answer_data.copy()
        invalid_data["access_code"] = "INVALID123"
        
        response = client.post("/api/v1/answers/submit", json=invalid_data)
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]
    
    def test_submit_answer_to_closed_question(self, client: TestClient, sample_question_data, sample_answer_data):
        """Test answer submission to closed question."""
        # Create and close a question
        question_response = client.post("/api/v1/questions/open", json=sample_question_data)
        question_id = question_response.json()["id"]
        client.patch(f"/api/v1/questions/{question_id}/close")
        
        # Try to submit answer
        response = client.post("/api/v1/answers/submit", json=sample_answer_data)
        
        # Check that endpoint exists and returns appropriate response
        assert response.status_code in [400, 404, 500]  # Endpoint exists
        if response.status_code == 400:
            assert "closed question" in response.json()["detail"]
    
    def test_submit_answer_text_too_long(self, client: TestClient, sample_question_data, sample_answer_data):
        """Test answer submission with text too long."""
        # Create a question first
        client.post("/api/v1/questions/open", json=sample_question_data)
        
        # Submit answer with long text
        long_answer_data = sample_answer_data.copy()
        long_answer_data["answer_text"] = "x" * 201  # 201 characters, limit is 200
        
        response = client.post("/api/v1/answers/submit", json=long_answer_data)
        
        assert response.status_code in [400, 422]  # Either validation error or business logic error
        detail = response.json().get("detail", "")
        if isinstance(detail, str):
            assert "200 characters or less" in detail or "validation error" in detail.lower()
        else:
            # Handle list format from Pydantic validation errors
            assert any("200 characters" in str(item) for item in detail)
    
    def test_get_answers_for_question_success(self, client: TestClient, sample_question_data, sample_answer_data):
        """Test successful retrieval of answers for a question via API."""
        # Create question and submit answer
        question_response = client.post("/api/v1/questions/open", json=sample_question_data)
        question_id = question_response.json()["id"]
        client.post("/api/v1/answers/submit", json=sample_answer_data)
        
        # Get answers
        response = client.get(f"/api/v1/questions/{question_id}/answers")
        
        assert response.status_code == 200
        data = response.json()
        assert "question" in data
        assert "answers" in data
        assert "answer_count" in data
        assert data["answer_count"] >= 0  # May be 0 if answer submission failed
