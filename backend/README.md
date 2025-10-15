# ORT Assignment Backend

A simple FastAPI server for the ORT assignment project.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Main FastAPI application
│   ├── api/
│   │   ├── __init__.py
│   │   ├── api.py             # Main API router
│   │   └── endpoints/
│   │       ├── __init__.py
│   │       ├── students.py    # Student endpoints
│   │       ├── questions.py   # Question endpoints (teacher)
│   │       └── answers.py     # Answer endpoints (student)q
│   ├── database/
│   │   ├── __init__.py
│   │   ├── config.py          # Database configuration
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── base.py        # Base model class
│   │   │   ├── question.py    # Question database model
│   │   │   └── answer.py      # Answer database model
│   │   └── repositories/
│   │       ├── __init__.py
│   │       ├── base.py        # Base repository class
│   │       ├── question_repository.py # Question repository
│   │       └── answer_repository.py   # Answer repository
│   ├── models/
│   │   ├── __init__.py
│   │   └── student.py         # Student Pydantic models
│   └── services/
│       ├── __init__.py
│       ├── student_service.py # Student business logic
│       ├── question_service.py # Question business logic
│       └── answer_service.py   # Answer business logic
├── requirements.txt           # Python dependencies
└── README.md                 # This file
```

## Features

- **FastAPI Framework**: Modern, fast web framework for building APIs
- **Pydantic Models**: Data validation and serialization
- **Modular Structure**: Organized code with clear separation of concerns
- **CRUD Operations**: Full Create, Read, Update, Delete operations for all entities
- **SQLite Database**: Persistent SQLite database with SQLAlchemy ORM
- **Database Migrations**: Alembic support for database schema management
- **Repository Pattern**: Clean separation between database and business logic
- **CORS Support**: Cross-Origin Resource Sharing enabled
- **Auto Documentation**: Automatic OpenAPI/Swagger documentation
- **Classroom Q&A System**: Complete question and answer functionality
- **Role-Based API**: Separate endpoints for teachers and students
- **Data Validation**: Comprehensive business logic validation

## API Endpoints

### Students API (`/api/v1/students`)

- `GET /api/v1/students/` - Get all students
- `GET /api/v1/students/{student_id}` - Get a specific student

### Questions API (`/api/v1/questions`) - Teacher Endpoints

- `POST /api/v1/questions/open` - Create and open a new question
- `PATCH /api/v1/questions/{question_id}/close` - Close an existing question
- `GET /api/v1/questions/` - Retrieve a list of questions (optional status filter)
- `GET /api/v1/questions/{question_id}/answers` - View all submitted answers for a question

### Answers API (`/api/v1/answers`) - Student Endpoints

- `GET /api/v1/answers/question/{access_code}` - Identify and retrieve a question for answering
- `POST /api/v1/answers/submit` - Submit a new answer or update an existing answer

### General Endpoints

- `GET /` - Root endpoint with welcome message
- `GET /health` - Health check endpoint

## Installation and Setup

### Prerequisites
- Python 3.8 or higher
- Poetry (recommended) or pip

### Install Poetry (if not already installed)
```bash
# On Windows (PowerShell)
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -

# On macOS/Linux
curl -sSL https://install.python-poetry.org | python3 -
```

### Setup and Run

1. **Install Dependencies**:
   ```bash
   cd backend
   poetry install
   ```

2. **Run the Server** (npm-like commands):
   
   **Development mode (with auto-reload)**:
   ```bash
   poetry run dev
   # or using Make
   make dev
   ```
   
   **Production mode**:
   ```bash
   poetry run start
   # or using Make
   make start
   ```

3. **Other useful commands**:
   ```bash
   # Run tests
   poetry run test
   make test
   
   # Format code
   poetry run format
   make format
   
   # Lint code
   poetry run lint
   make lint
   
   # Clean cache files
   make clean
   
   # Get help
   make help
   ```

4. **Access the API**:
   - API Base URL: http://localhost:8000
   - Interactive API Documentation: http://localhost:8000/docs
   - Alternative API Documentation: http://localhost:8000/redoc

### Alternative: Using pip (without Poetry)

If you prefer not to use Poetry:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Data Storage

The application now uses **SQLite database** with SQLAlchemy ORM for data persistence. The database is automatically initialized when the application starts.

### Database Structure

- **SQLite Database**: Local file-based database (`app.db`)
- **SQLAlchemy ORM**: Object-Relational Mapping for database operations
- **Repository Pattern**: Clean separation between database and business logic
- **Alembic Support**: Database migration management (ready for future use)

### Database Models

- **Base Model**: Common base class for all database models
- **Question Model**: SQLAlchemy model for questions with title, text, access code, and status
- **Answer Model**: SQLAlchemy model for answers with question reference, student ID, and text
- **Repository Classes**: Handle database operations with proper separation of concerns

### Environment Configuration

You can configure the database using environment variables:

```bash
# SQLite Database Path (recommended for SQLite)
# Controls where the SQLite database file is saved

# Windows Examples:
DATABASE_PATH="C:\Users\shake\Desktop\Builds\database.db"  # Windows absolute path
DATABASE_PATH="./app.db"                                   # Relative path (default)


**Note**: When using `DATABASE_PATH`, the application automatically creates the directory if it doesn't exist.

### Troubleshooting Database Path Issues

If you experience slow database operations or errors with custom paths:

1. **Use absolute paths**: `DATABASE_PATH="C:\Users\shake\Desktop\Builds\database.db"`
2. **Avoid spaces in directory names**: Use `C:\Users\shake\Desktop\Builds` instead of `C:\Users\shake\Desktop\Builds (Copy)`
3. **Ensure directory permissions**: Make sure the application has write access to the target directory
4. **Use forward slashes**: The application automatically converts Windows backslashes to forward slashes for SQLite URLs

## Development

The project follows FastAPI best practices:

- **Models**: Pydantic models for data validation and SQLAlchemy models for database operations
- **Services**: Business logic separated from API endpoints
- **Repositories**: Database operations separated from business logic
- **Endpoints**: Clean, focused API route handlers
- **Dependency Injection**: FastAPI's dependency system for service and database management
- **Database Configuration**: Centralized database setup with environment variable support
- **Clean Architecture**: Layered architecture with clear separation of concerns
- **HTTP Status Codes**: Appropriate status codes for different scenarios
- **Error Handling**: Consistent error responses with meaningful messages

### Classroom Q&A Architecture

The classroom Q&A system is built with a clean, layered architecture:

1. **API Layer** (`endpoints/`):
   - `questions.py` - Teacher endpoints for managing questions
   - `answers.py` - Student endpoints for submitting answers

2. **Service Layer** (`services/`):
   - `question_service.py` - Business logic for questions
   - `answer_service.py` - Business logic for answers

3. **Repository Layer** (`repositories/`):
   - `question_repository.py` - Database operations for questions
   - `answer_repository.py` - Database operations for answers

4. **Data Layer** (`models/`):
   - `question.py` - SQLAlchemy model for questions
   - `answer.py` - SQLAlchemy model for answers

This architecture ensures separation of concerns, making the code more maintainable and testable.

## API Documentation

FastAPI automatically generates interactive API documentation that you can access at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

This documentation is automatically updated when you modify the API endpoints or models.
