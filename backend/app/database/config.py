"""
Database configuration module.
Contains database connection settings and configuration for SQLAlchemy.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Database URL - using SQLite for simplicity
# You can change this to use environment variables for production
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=True  # Set to False in production
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    Dependency to get database session.
    Used as FastAPI dependency for database access.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """
    Create all database tables.
    Call this function to initialize the database schema.
    """
    # Import all models to ensure they are registered with Base
    try:
        from .models.question import Question
        from .models.answer import Answer
        from .models.base import Base
    except ImportError:
        # Fallback for direct execution
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from .models.question import Question
        from .models.answer import Answer
        from .models.base import Base
    
    # Now create all tables
    Base.metadata.create_all(bind=engine)


def drop_tables():
    """
    Drop all database tables.
    Use with caution - this will delete all data!
    """
    # Import Base from models
    try:
        from .models.base import Base
    except ImportError:
        # Fallback for direct execution
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from .models.base import Base
    
    Base.metadata.drop_all(bind=engine)
