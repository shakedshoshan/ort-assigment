# ORT Assignment - Classroom Q&A System

A modern full-stack application for managing classroom questions and student answers, featuring AI-powered analysis and semantic search capabilities.

<img width="1000" height="600" alt="ort002" src="https://github.com/user-attachments/assets/4e5448e7-d617-4f60-ae2e-c9a74b725163" />
<img width="1000" height="600" alt="ort003" src="https://github.com/user-attachments/assets/e87e670e-b597-44ee-9d77-7472b2154d4a" />
<img width="1000" height="600" alt="ort001" src="https://github.com/user-attachments/assets/a6ce1266-3e12-4e17-9afe-7c78a6d0445a" />


## 🚀 Quick Start

### Local Development
```bash
# Backend
cd backend
poetry install
poetry run dev

# Frontend
cd ort-frontend
npm install
npm run dev
```

### Docker
```bash
# Clone and start with Docker
git clone <repository-url>
cd ort-assignment
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000

```

## 🏗️ Architecture

### System Overview
```
Frontend (React/TypeScript) ↔ REST API ↔ Backend (FastAPI) ↔ SQLite Database
```

### Backend Architecture
- **API Layer**: FastAPI endpoints with Pydantic validation
- **Service Layer**: Business logic for questions, answers, and AI features
- **Repository Layer**: Data access with SQLAlchemy ORM
- **Data Layer**: SQLite database with proper relationships

### Frontend Architecture
- **Component-Based**: Modular React components with TypeScript
- **Custom Hooks**: API integration and state management
- **Routing**: React Router for navigation
- **Styling**: Tailwind CSS with custom theme

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Lightweight database
- **Pydantic** - Data validation and serialization
- **OpenAI API** - AI-powered features
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing

### Development Tools
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **DBeaver** - Database management
- **Postman** - API testing
- **Cursor** - AI-powered IDE
- **pytest** - Backend testing
- **Vitest** - Frontend testing

## ✨ Key Features

### Core Functionality
- **Question Management**: Create, open, close, and delete classroom questions
- **Student Answers**: Submit and manage student responses
- **Access Control**: Passcode-based teacher authentication
- **Real-time Updates**: Live data synchronization

### AI-Powered Features
- **Smart Search**: Semantic search using natural language queries
  - Subject-aware matching (geography, mathematics, science, etc.)
  - Two-stage AI processing for better accuracy
  - Search suggestions and examples
- **AI Summarization**: Analyze student responses with custom instructions
  - Identify learning patterns and confusion areas
  - Generate insights for teaching adjustments
  - Customizable analysis instructions

### User Experience
- **Teacher Dashboard**: Statistics, question management, and AI tools
- **Student Interface**: Simple access code and answer submission
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Full keyboard navigation and screen reader support

## 🗄️ Database Schema

### Tables
- **`questions`**: Question metadata (title, text, access_code, status, timestamps)
- **`answers`**: Student responses (question_id, student_id, text, timestamps)
- **`students`**: Student information (id, name, email)

### Database Management
- **DBeaver Integration**: Visual database management
- **SQL Queries**: Custom queries for data analysis
- **Data Export**: CSV/JSON export capabilities

## 🧪 Testing

### Test Coverage
- **Total Tests**: 50 (Backend: 32, Frontend: 18)
- **Pass Rate**: 100% ✅
- **Frameworks**: pytest (backend), Vitest (frontend)

### CI/CD Pipeline
- **GitHub Actions**: Automated testing on every commit
- **Matrix Testing**: Python 3.11/3.12, Node.js 18/20
- **Build Verification**: Ensures services start correctly

## 🔧 Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Environment Variables
```bash
# Required
OPENAI_API_KEY=your_openai_api_key

# Optional
TEACHER_PASSCODE=your_teacher_passcode
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=2000
```

## 📊 API Endpoints

### Teacher Endpoints
- `POST /api/v1/questions/open` - Create question
- `PATCH /api/v1/questions/{id}/close` - Close question
- `DELETE /api/v1/questions/{id}` - Delete question
- `GET /api/v1/questions/` - List questions
- `GET /api/v1/questions/{id}/answers` - View answers

### Student Endpoints
- `GET /api/v1/answers/question/{access_code}` - Get question
- `POST /api/v1/answers/submit` - Submit answer

### AI Endpoints
- `POST /api/v1/ai/summarize` - Generate AI summary
- `POST /api/v1/ai/smart-search` - Semantic search

## 🎯 Use Cases

### For Teachers
- Create and manage classroom questions
- Monitor student participation
- Use AI to analyze student responses
- Search questions using natural language
- Generate insights for teaching improvements

### For Students
- Access questions via access codes
- Submit answers easily
- View question details
- Get confirmation of submissions

## 🔍 Development Tools Integration

### DBeaver
- Connect to `backend/app/app.db`
- Visual database exploration
- SQL query execution
- Data export capabilities

### Postman
- API testing and documentation
- Collection management
- Environment variables
- Automated testing

### Cursor IDE
- AI-powered code assistance
- Intelligent code completion
- Context-aware suggestions
- Integrated debugging


## 🛡️ Security

- **Authentication**: Passcode-based teacher access
- **Session Management**: 24-hour session expiration
- **Data Validation**: Pydantic models for input validation
- **CORS**: Configured for cross-origin requests

