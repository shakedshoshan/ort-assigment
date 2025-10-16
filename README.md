# ORT Assignment

This project contains a FastAPI backend server and a React TypeScript frontend for managing classroom questions and student answers.

## Project Structure

```
ort-assigment/
├── backend/                 # FastAPI backend server
│   ├── app/                # Main application code
│   ├── requirements.txt    # Python dependencies
│   ├── run.py             # Simple run script
│   └── README.md          # Backend documentation
├── ort-frontend/           # React TypeScript frontend
│   ├── src/               # Source code
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript type definitions
│   │   └── theme.css      # Custom Tailwind CSS theme
│   ├── package.json       # Node.js dependencies
│   └── README.md          # Frontend documentation
├── data/
│   └── students.json      # Student data storage
└── README.md              # This file
```

## Frontend Application

The frontend is a React TypeScript application built with modern web technologies, providing an intuitive interface for both teachers and students to manage classroom questions and answers.

### Frontend Architecture

The frontend follows a clean, component-based architecture with clear separation of concerns:

#### 1. **Folder Structure**
```
ort-frontend/src/
├── components/           # Reusable UI components
│   ├── cards/           # Card-based UI components
│   │   ├── StatsCard.tsx        # Statistics display cards
│   │   ├── QuestionCard.tsx     # Question display cards
│   │   ├── AnswerCard.tsx       # Answer display cards
│   │   └── index.ts            # Card exports
│   ├── forms/           # Form components
│   │   ├── AccessCodeForm.tsx   # Access code entry form
│   │   ├── AnswerForm.tsx       # Answer submission form
│   │   ├── QuestionForm.tsx     # Question creation form
│   │   └── index.ts            # Form exports
│   ├── layout/          # Layout components
│   │   ├── AppLayout.tsx        # Main application layout
│   │   └── index.ts            # Layout exports
│   ├── ui/              # Reusable UI components
│   │   ├── LoadingSpinner.tsx   # Loading indicators
│   │   ├── ErrorAlert.tsx       # Error message display
│   │   ├── SuccessMessage.tsx   # Success message display
│   │   └── index.ts            # UI exports
│   └── index.ts         # Main component exports
├── pages/               # Page components
│   ├── teacher/         # Teacher-specific pages
│   │   ├── TeacherDashboard.tsx # Main teacher dashboard
│   │   └── QuestionView.tsx     # Individual question view
│   ├── student/         # Student-specific pages
│   │   └── StudentForm.tsx      # Student answer form
│   └── index.ts         # Page exports
├── hooks/               # Custom React hooks
│   ├── useQuestions.ts  # Question-related API calls
│   ├── useAnswers.ts    # Answer-related API calls
│   └── useStudents.ts   # Student-related API calls
├── types/               # TypeScript type definitions
│   ├── question.ts      # Question type definitions
│   ├── answer.ts        # Answer type definitions
│   └── student.ts       # Student type definitions
├── theme.css           # Custom Tailwind CSS theme
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

#### 2. **Component Architecture**

**Pages Layer**: High-level page components that compose other components
- **TeacherDashboard**: Displays question statistics and question list
- **QuestionView**: Shows individual question details and student answers
- **StudentForm**: Two-step process for accessing and answering questions

**Components Layer**: Reusable UI components organized by purpose
- **Cards**: Data display components with consistent styling
- **Forms**: Form-specific components with validation logic
  - **QuestionForm**: Reusable component for creating new questions with title, text, and access code fields
- **Layout**: Structural components for page layout
- **UI**: Utility components for common UI patterns

**Hooks Layer**: Custom React hooks for API integration
- **useQuestions**: Manages question data fetching and state
- **useAnswers**: Handles answer submission and retrieval
- **useStudents**: Student data management

#### 3. **Application Flow**

**Teacher Flow**:
1. Access Teacher Dashboard (`/teacher`)
2. View question statistics and list
3. Create new questions using the QuestionForm component
4. Click "View Details" on any question
5. Navigate to Question View (`/teacher/questions/:id`)
6. Review student answers and question details

**Student Flow**:
1. Access Student Form (`/student`)
2. Enter access code and student ID
3. View question details
4. Submit answer
5. Receive confirmation message

#### 4. **Routing Structure**
```typescript
/                    → Redirects to /teacher
/teacher            → Teacher Dashboard
/teacher/questions/:id → Individual Question View
/student            → Student Answer Form
```

### Frontend Quick Start

1. **Navigate to the frontend directory**:
   ```bash
   cd ort-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend URL: http://localhost:5173
   - The app will automatically connect to the backend API

### Frontend Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe JavaScript development
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **Custom Hooks**: Reusable state management and API integration

### Design System

The frontend uses a custom Tailwind CSS theme with:
- **Consistent Color Palette**: Blue primary, gray neutrals, semantic colors
- **Component Classes**: Pre-built classes for buttons, forms, cards, badges
- **Responsive Design**: Mobile-first approach with responsive utilities
- **Accessibility**: Focus states, proper contrast, semantic HTML

### Component Documentation

#### QuestionForm Component

The `QuestionForm` component is a reusable form for creating new classroom questions. It provides a clean, user-friendly interface for teachers to input question details.

**Features**:
- **Form Fields**: Title, question text, and access code inputs
- **Validation**: Client-side validation with required field checking
- **Error Handling**: Displays API errors and validation messages
- **Success Feedback**: Shows success message upon successful creation
- **Loading States**: Visual feedback during form submission
- **Customizable**: Optional cancel button and success callbacks

**Props**:
```typescript
interface QuestionFormProps {
  onSuccess?: () => void;        // Callback when question is created successfully
  onCancel?: () => void;         // Callback when form is cancelled
  showCancelButton?: boolean;    // Whether to show the cancel button (default: true)
}
```

**Usage Example**:
```tsx
<QuestionForm
  onSuccess={() => {
    console.log('Question created!');
    // Refresh questions list or close form
  }}
  onCancel={() => {
    console.log('Form cancelled');
    // Close form or reset state
  }}
  showCancelButton={true}
/>
```

**Integration**: The component uses the `useCreateQuestion` hook internally for API communication and state management, ensuring consistent error handling and loading states across the application.

## Backend API

The backend is a FastAPI server that provides a REST API for managing classroom questions and student answers.

### Backend Quick Start

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

### Alternative Backend Setup (using pip)

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

## Full Application Workflow

### Complete System Architecture

The ORT Assignment system consists of two main parts working together:

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│   Frontend      │ ◄─────────────────► │   Backend       │
│   (React/TS)    │                     │   (FastAPI)     │
│                 │                     │                 │
│ • Teacher UI    │                     │ • Question API  │
│ • Student UI    │                     │ • Answer API    │
│ • State Mgmt    │                     │ • Database      │
│ • Routing       │                     │ • Validation    │
└─────────────────┘                     └─────────────────┘
```

### End-to-End User Flows

#### **Teacher Workflow**
1. **Access Dashboard**: Teacher opens `/teacher` route
2. **View Statistics**: See total questions, open/closed counts
3. **Browse Questions**: View list of all questions with status
4. **View Details**: Click on question to see `/teacher/questions/:id`
5. **Review Answers**: See all student responses for that question
6. **Monitor Progress**: Track student participation

#### **Student Workflow**
1. **Access Form**: Student opens `/student` route
2. **Enter Credentials**: Provide access code and student ID
3. **View Question**: See question details after validation
4. **Submit Answer**: Type and submit response
5. **Confirmation**: Receive success message

### Data Flow

```
Frontend Component → Custom Hook → API Call → Backend Endpoint → Database
       ↓                    ↓           ↓            ↓              ↓
   User Action        State Update   HTTP Request   Validation   Data Storage
       ↑                    ↑           ↑            ↑              ↑
   UI Update          Hook Response  HTTP Response  Business Logic  Data Retrieval
```

### Integration Points

#### **API Integration**
- **Questions**: Frontend hooks call `/api/v1/questions/*` endpoints
- **Answers**: Frontend hooks call `/api/v1/answers/*` endpoints
- **Students**: Frontend hooks call `/api/v1/students/*` endpoints

#### **State Management**
- **Custom Hooks**: Encapsulate API calls and state management
- **Component State**: Local state for UI interactions
- **Type Safety**: TypeScript interfaces match backend models

#### **Error Handling**
- **Frontend**: Custom error components and user feedback
- **Backend**: Structured error responses with status codes
- **Integration**: Consistent error handling across the stack

### Development Workflow

#### **Running Both Services**

1. **Start Backend**:
   ```bash
   cd backend
   poetry run dev
   # API available at http://localhost:8000
   ```

2. **Start Frontend** (in new terminal):
   ```bash
   cd ort-frontend
   npm run dev
   # Frontend available at http://localhost:5173
   ```

3. **Access Application**:
   - Frontend: http://localhost:5173
   - Backend API Docs: http://localhost:8000/docs

#### **Development Features**
- **Hot Reload**: Both frontend and backend support live reloading
- **Type Safety**: Full TypeScript coverage across the stack
- **API Documentation**: Interactive Swagger UI for backend
- **Error Boundaries**: React error boundaries for graceful error handling
- **Responsive Design**: Mobile-first responsive UI

### Key Benefits

#### **Architecture Benefits**
- **Separation of Concerns**: Clear boundaries between UI and business logic
- **Reusability**: Modular components and hooks for easy reuse
- **Maintainability**: Organized folder structure and consistent patterns
- **Scalability**: Component-based architecture supports easy feature additions

#### **Development Benefits**
- **Type Safety**: End-to-end TypeScript reduces runtime errors
- **Developer Experience**: Modern tooling with fast build times
- **Code Organization**: Logical folder structure and clear naming conventions
- **Testing Ready**: Component isolation enables easy unit testing

For detailed backend documentation, see [backend/README.md](backend/README.md).
