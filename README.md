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
- **JSON Storage**: Uses the existing `data/students.json` file
- **Auto Documentation**: Interactive Swagger UI and ReDoc documentation
- **CORS Support**: Cross-origin requests enabled
- **Data Validation**: Pydantic models for request/response validation

### API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/v1/students/` - Get all students
- `GET /api/v1/students/{id}` - Get specific student
- `POST /api/v1/students/` - Create new student
- `PUT /api/v1/students/{id}` - Update student
- `DELETE /api/v1/students/{id}` - Delete student

## Development Principles

This project follows these key principles:

1. **Simple Code**: Clean, straightforward implementation without unnecessary complexity
2. **Documentation**: Key parts of the system are well-documented
3. **Modular Design**: Code is organized into logical modules for maintainability
4. **Readable Code**: Clear structure that's easy to understand and modify

## Technology Stack

- **FastAPI**: Modern Python web framework for building APIs
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for running the FastAPI application
- **JSON**: Simple file-based data storage

For detailed backend documentation, see [backend/README.md](backend/README.md).
