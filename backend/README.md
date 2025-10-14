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
│   │       └── students.py    # Student endpoints
│   ├── models/
│   │   ├── __init__.py
│   │   └── student.py         # Student data models
│   └── services/
│       ├── __init__.py
│       └── student_service.py # Student business logic
├── requirements.txt           # Python dependencies
└── README.md                 # This file
```

## Features

- **FastAPI Framework**: Modern, fast web framework for building APIs
- **Pydantic Models**: Data validation and serialization
- **Modular Structure**: Organized code with clear separation of concerns
- **CRUD Operations**: Full Create, Read, Update, Delete operations for students
- **JSON Data Storage**: Uses the existing `data/students.json` file
- **CORS Support**: Cross-Origin Resource Sharing enabled
- **Auto Documentation**: Automatic OpenAPI/Swagger documentation

## API Endpoints

### Students API (`/api/v1/students`)

- `GET /api/v1/students/` - Get all students
- `GET /api/v1/students/{student_id}` - Get a specific student


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

The application uses the existing `data/students.json` file for data storage. The service layer handles all file operations, ensuring data persistence across server restarts.

## Development

The project follows FastAPI best practices:

- **Models**: Pydantic models for data validation
- **Services**: Business logic separated from API endpoints
- **Endpoints**: Clean, focused API route handlers
- **Dependency Injection**: FastAPI's dependency system for service management

## API Documentation

FastAPI automatically generates interactive API documentation that you can access at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

This documentation is automatically updated when you modify the API endpoints or models.
