# ORT Assignment

This project contains a simple FastAPI backend server for managing student data.

## Project Structure

```
ort-assigment/
├── backend/                 # FastAPI backend server
│   ├── app/                # Main application code
│   ├── requirements.txt    # Python dependencies
│   ├── run.py             # Simple run script
│   └── README.md          # Backend documentation
├── data/
│   └── students.json      # Student data storage
└── README.md              # This file
```

## Backend API

The backend is a FastAPI server that provides a REST API for managing student data.

### Quick Start

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies** (using Poetry - recommended):
   ```bash
   poetry install
   ```

3. **Run the server** (npm-like commands):
   ```bash
   # Development mode with auto-reload
   poetry run dev
   
   # Or using Make (if available)
   make dev
   ```

4. **Access the API**:
   - API Base URL: http://localhost:8000
   - Interactive Documentation: http://localhost:8000/docs

### Alternative Setup (using pip)

If you prefer not to use Poetry:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### API Features

- **Student Management**: Full CRUD operations for student data
- **Classroom Q&A System**: Complete question and answer functionality
- **SQLite Database**: Persistent storage with SQLAlchemy ORM
- **Role-Based API**: Separate endpoints for teachers and students
- **Auto Documentation**: Interactive Swagger UI and ReDoc documentation
- **CORS Support**: Cross-origin requests enabled
- **Data Validation**: Pydantic models for request/response validation
- **Business Logic**: Comprehensive validation and error handling

### API Endpoints

#### General Endpoints
- `GET /` - Welcome message
- `GET /health` - Health check

#### Student Management
- `GET /api/v1/students/` - Get all students
- `GET /api/v1/students/{id}` - Get specific student

#### Teacher Endpoints (Questions)
- `POST /api/v1/questions/open` - Create and open a new question
- `PATCH /api/v1/questions/{question_id}/close` - Close an existing question
- `GET /api/v1/questions/` - Retrieve a list of questions (optional status filter)
- `GET /api/v1/questions/{question_id}/answers` - View all submitted answers for a question

#### Student Endpoints (Answers)
- `GET /api/v1/answers/question/{access_code}` - Identify and retrieve a question for answering
- `POST /api/v1/answers/submit` - Submit a new answer or update an existing answer

## Development Principles

This project follows these key principles:

1. **Simple Code**: Clean, straightforward implementation without unnecessary complexity
2. **Documentation**: Key parts of the system are well-documented
3. **Modular Design**: Code is organized into logical modules for maintainability
4. **Readable Code**: Clear structure that's easy to understand and modify

## Technology Stack

- **FastAPI**: Modern Python web framework for building APIs
- **Pydantic**: Data validation and serialization
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapper
- **SQLite**: Lightweight disk-based database
- **Uvicorn**: ASGI server for running the FastAPI application

## Classroom Q&A System Architecture

The classroom Q&A system follows a clean, layered architecture:

### 1. API Layer (Endpoints)
- **Teacher Endpoints**: Create questions, close questions, view answers
- **Student Endpoints**: View questions, submit answers

### 2. Service Layer (Business Logic)
- **QuestionService**: Manages question creation, retrieval, and status
- **AnswerService**: Handles answer submission and validation

### 3. Repository Layer (Data Access)
- **QuestionRepository**: Database operations for questions
- **AnswerRepository**: Database operations for answers

### 4. Data Layer (Models)
- **Question Model**: Represents questions in the database
- **Answer Model**: Represents answers in the database

This architecture ensures:
- Separation of concerns
- Testability
- Maintainability
- Clear business logic boundaries

For detailed backend documentation, see [backend/README.md](backend/README.md).
