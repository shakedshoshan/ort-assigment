"""
Test configuration and fixtures for the ORT Assignment backend tests.
"""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

# Import database models and configuration
try:
    from app.database.config import get_db
    from app.database.models.base import Base
    from app.database.models.question import Question
    from app.database.models.answer import Answer
    from app.main import app
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from app.database.config import get_db
    from app.database.models.base import Base
    from app.database.models.question import Question
    from app.database.models.answer import Answer
    from app.main import app

# Test database configuration
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db_session):
    """Create a test client with database session override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_question_data():
    """Sample question data for testing."""
    return {
        "title": "Test Question",
        "text": "What is the capital of France?",
        "access_code": "TEST123"
    }


@pytest.fixture
def sample_answer_data():
    """Sample answer data for testing."""
    return {
        "access_code": "TEST123",
        "student_id": "student001",
        "answer_text": "The capital of France is Paris."
    }
