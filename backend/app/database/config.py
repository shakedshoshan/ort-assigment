"""
Database configuration module.
Contains database connection settings and configuration for SQLAlchemy.
"""

import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database configuration with environment variable support
def get_database_path() -> str:
    """
    Get the database file path from environment variable or use default.
    Handles Windows paths with backslashes and spaces properly.
    
    Returns:
        str: Path to the SQLite database file
    """
    # Get database path from environment variable or use default
    database_path = os.getenv("DATABASE_PATH", "./app.db")
    
    # Convert to Path object for better handling
    db_path = Path(database_path)
    
    # If it's a relative path, make it relative to the backend directory
    if not db_path.is_absolute():
        # Get the backend directory (parent of this config file's directory)
        backend_dir = Path(__file__).parent.parent.parent
        db_path = backend_dir / db_path
    
    # Always ensure the directory exists
    db_dir = db_path.parent
    db_dir.mkdir(parents=True, exist_ok=True)
    
    # Print debug info to help troubleshoot
    print(f"Database path: {db_path}")
    print(f"Database directory: {db_dir}")
    print(f"Directory exists: {db_dir.exists()}")
    print(f"Directory is writable: {os.access(db_dir, os.W_OK)}")
    
    return str(db_path.absolute())

def build_database_url(database_path: str) -> str:
    """
    Build SQLite database URL from file path.
    Handles Windows paths properly by converting to forward slashes.
    
    Args:
        database_path: Path to the database file
        
    Returns:
        str: SQLite database URL
    """
    # Convert Windows backslashes to forward slashes for SQLite URL
    normalized_path = str(Path(database_path)).replace('\\', '/')
    
    # For absolute paths, use sqlite:/// (three slashes)
    # For relative paths, use sqlite:/// (three slashes) with leading slash
    if normalized_path.startswith('/'):
        return f"sqlite://{normalized_path}"
    else:
        return f"sqlite:///{normalized_path}"

# Build database URL from path
DATABASE_PATH = get_database_path()
DATABASE_URL = build_database_url(DATABASE_PATH)

# Print debug info
print(f"Final database URL: {DATABASE_URL}")

# Create SQLAlchemy engine with optimized settings
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False,
        "timeout": 20,  # Increase timeout for slow operations
    } if "sqlite" in DATABASE_URL else {},
    echo=False,  # Disable echo to improve performance
    pool_pre_ping=True,  # Verify connections before use
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
