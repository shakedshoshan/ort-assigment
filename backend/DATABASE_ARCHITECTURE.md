# Database Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture Pattern](#architecture-pattern)
3. [SQLAlchemy - Why You Need It](#sqlalchemy---why-you-need-it)
4. [Alembic - Is It Necessary?](#alembic---is-it-necessary)
5. [Pydantic Dependencies](#pydantic-dependencies)
6. [Database Flow](#database-flow)
7. [Recommendations](#recommendations)
8. [File Structure](#file-structure)

## Overview

This document explains the database architecture and flow in the Classroom Q&A application. The system follows a clean architecture pattern with clear separation of concerns between API endpoints, business logic, data access, and database models.

## Architecture Pattern

The application follows a **layered architecture pattern**:

```
FastAPI Endpoints → Services → Repositories → SQLAlchemy Models → Database
```

### Layer Responsibilities:

- **FastAPI Endpoints**: Handle HTTP requests/responses, input validation
- **Services**: Business logic and application rules
- **Repositories**: Data access operations and database queries
- **SQLAlchemy Models**: Database schema definition and ORM mapping
- **Database**: Data persistence (SQLite)

## SQLAlchemy - Why You Need It

SQLAlchemy is essential for this application for several key reasons:

### 1. Object-Relational Mapping (ORM)

SQLAlchemy maps Python classes to database tables automatically:

```python
class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(Text, nullable=False, index=True)
    text = Column(Text, nullable=False)
    access_code = Column(String, nullable=False, unique=True, index=True)
    is_closed = Column(Integer, nullable=False, default=0)
```

**Benefits:**
- No need to write raw SQL for basic operations
- Automatic handling of relationships and foreign keys
- Type-safe database operations

### 2. Database Abstraction

```python
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
engine = create_engine(DATABASE_URL, ...)
```

**Benefits:**
- Easy database switching (SQLite → PostgreSQL → MySQL)
- Handles database-specific SQL differences
- Consistent Python interface regardless of underlying database

### 3. Type Safety & Validation

```python
class Answer(Base):
    text = Column(String(200), nullable=False)  # Max 200 characters
    __table_args__ = (
        UniqueConstraint('question_id', 'student_id', name='uq_question_student'),
    )
```

**Benefits:**
- Automatic data validation and constraint enforcement
- Prevents invalid data from entering the database
- Clear error messages for constraint violations

### 4. Query Building

```python
def get_by_question_id(self, db: Session, question_id: int) -> List[Answer]:
    return db.query(self.model).filter(
        self.model.question_id == question_id
    ).order_by(self.model.timestamp.desc()).all()
```

**Benefits:**
- More readable than raw SQL
- Protection against SQL injection
- IDE support and autocomplete

## Alembic - Is It Necessary?

**Current Status**: Alembic is included in `requirements.txt` but not configured.

### What Alembic Does

Alembic provides database migration management:

- **Version Control**: Track database schema changes over time
- **Schema Evolution**: Safely modify tables, add columns, create indexes
- **Rollback Support**: Undo database changes if needed
- **Team Collaboration**: Ensure all developers have consistent schemas

### Do You Need It?

**For Development**: Not immediately necessary for a simple application

**For Production**: Highly recommended for:
- Safe schema updates without data loss
- Team development (consistent schemas)
- Production deployments (controlled changes)
- Database rollbacks when needed

### Current Approach vs. Alembic

**Current (Simple)**:
```python
# In config.py - creates tables from scratch
Base.metadata.create_all(bind=engine)
```

**With Alembic (Recommended)**:
```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## Pydantic Dependencies

Pydantic models in `answers.py` provide several critical benefits:

### 1. Request Body Models

```python
class QuestionAccess(BaseModel):
    student_id: str = Field(..., description="Student ID")

class AnswerSubmission(BaseModel):
    access_code: str = Field(..., description="Question access code")
    student_id: str = Field(..., description="Student ID")
    answer_text: str = Field(..., max_length=200, description="Answer text")
```

**Why You Need These:**

- **Automatic Validation**: Ensures required fields are present
- **Type Checking**: Converts JSON to appropriate Python types
- **Length Validation**: Enforces business rules (200 character limit)
- **API Documentation**: Auto-generates OpenAPI/Swagger documentation
- **Error Handling**: Returns clear 422 errors for invalid input

### 2. FastAPI Integration

```python
async def submit_answer(
    submission: AnswerSubmission,  # Pydantic model
    db: Session = Depends(get_db),  # SQLAlchemy session
    answer_service: AnswerService = Depends(get_answer_service),
):
```

**Benefits:**

- **Automatic Parsing**: FastAPI converts JSON to Pydantic models
- **Validation**: Invalid data rejected before business logic
- **Documentation**: Models appear in `/docs` endpoint
- **Type Safety**: Full IDE support and type checking

### 3. Service Dependencies

```python
answer_service: AnswerService = Depends(get_answer_service),
question_service: QuestionService = Depends(get_question_service),
student_service: StudentService = Depends(get_student_service)
```

**Why This Pattern:**

- **Dependency Injection**: FastAPI manages service lifecycle
- **Testability**: Easy to mock services for unit tests
- **Separation of Concerns**: Business logic stays in services
- **Single Responsibility**: Each service handles one domain

## Database Flow

Here's how a request flows through the system:

### 1. Request Processing Flow

```
Client Request
    ↓
FastAPI Endpoint (answers.py)
    ↓
Pydantic Validation (AnswerSubmission)
    ↓
Service Layer (AnswerService)
    ↓
Repository Layer (AnswerRepository)
    ↓
SQLAlchemy ORM (Answer Model)
    ↓
Database (SQLite)
    ↓
Response (back up the chain)
```

### 2. Example: Submit Answer Request

```python
# 1. Client sends POST /submit with JSON
{
    "access_code": "ABC123",
    "student_id": "student001",
    "answer_text": "My answer here"
}

# 2. FastAPI validates with Pydantic
submission: AnswerSubmission = validated_data

# 3. Service validates business rules
answer_service.submit_or_update_answer(db, access_code, student_id, answer_text)

# 4. Repository handles database operations
answer_repo.upsert(db, answer_data)

# 5. SQLAlchemy converts to SQL and executes
# INSERT INTO answers (question_id, student_id, text) VALUES (1, 'student001', 'My answer here')
```

### 3. Data Transformation

At each layer, data is transformed appropriately:

- **API Layer**: JSON ↔ Pydantic models
- **Service Layer**: Business objects ↔ Dictionaries
- **Repository Layer**: Dictionaries ↔ SQLAlchemy models
- **Database Layer**: SQLAlchemy models ↔ SQL rows

## Recommendations

### 1. Add Alembic for Database Migrations

```bash
# Initialize Alembic
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 2. Environment Configuration

```python
# Database path configuration with automatic directory creation
def get_database_path() -> str:
    database_path = os.getenv("DATABASE_PATH", "./app.db")
    
    # Ensure the directory exists if a custom path is provided
    if database_path != "./app.db":
        db_dir = Path(database_path).parent
        db_dir.mkdir(parents=True, exist_ok=True)
    
    return database_path

DATABASE_PATH = get_database_path()
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"
```

**Environment Variables:**
- `DATABASE_PATH`: Controls SQLite database file location (recommended)


### 3. Production Optimizations

```python
# Remove debug logging in production
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to False in production
    pool_pre_ping=True,  # Verify connections
)
```

### 4. Error Handling

```python
# Add proper error handling for database operations
try:
    result = repository.operation(db, data)
except IntegrityError as e:
    raise HTTPException(status_code=400, detail="Data constraint violation")
```

## File Structure

```
backend/app/database/
├── __init__.py                 # Package initialization
├── config.py                  # Database configuration and connection
├── models/
│   ├── __init__.py           # Model exports
│   ├── base.py              # SQLAlchemy Base class
│   ├── question.py          # Question ORM model
│   └── answer.py            # Answer ORM model
└── repositories/
    ├── __init__.py          # Repository exports
    ├── base.py              # Base repository with CRUD operations
    ├── question_repository.py  # Question-specific database operations
    └── answer_repository.py    # Answer-specific database operations
```

### Key Files Explained:

- **`config.py`**: Database connection, session management, table creation
- **`models/`**: SQLAlchemy ORM models defining database schema
- **`repositories/`**: Data access layer with database operations
- **`base.py`** (models): Declarative base for all models
- **`base.py`** (repositories): Common CRUD operations

## Conclusion

Your database architecture follows industry best practices with:

- ✅ **Clean separation of concerns**
- ✅ **Type safety with Pydantic and SQLAlchemy**
- ✅ **Repository pattern for data access**
- ✅ **Service layer for business logic**
- ✅ **Proper dependency injection**

The combination of FastAPI + SQLAlchemy + Pydantic provides excellent type safety, validation, and maintainability for your Classroom Q&A application.

---

*Last updated: $(date)*
*Version: 1.0*
