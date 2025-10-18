# ORT Assignment

This project contains a FastAPI backend server and a React TypeScript frontend for managing classroom questions and student answers.

## Recent Updates

**Enhanced AI Smart Search Feature** (Latest): Significantly improved the semantic search capability with a more intelligent architecture that better understands educational context and subject matter relationships.

**Key Improvements**:
- **Two-Stage AI Processing**: First extracts concepts from user queries, then uses enhanced context for better matching
- **Subject-Aware Matching**: Automatically categorizes questions by subject area (geography, mathematics, science, etc.)
- **Enhanced Question Processing**: Questions now include subject hints based on content analysis for better semantic matching
- **Smarter AI Prompts**: Context-aware prompts that understand educational relationships (e.g., "geography" → "capital of France")
- **Improved User Experience**: Added search suggestions, better examples, and enhanced error handling
- **Conceptual Understanding**: AI now understands that "geography" should match questions about countries, capitals, maps, etc.

**Technical Enhancements**:
- New concept extraction system that analyzes search queries for subject areas and related terms
- Enhanced question text processing with automatic subject categorization
- Improved AI prompts with educational context and matching rules
- Better error handling and logging for debugging
- Optimized search suggestions and user guidance

## Quick Start with Docker

**Simple setup for development:**

```bash
# Start both backend and frontend
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

**Stop services:**
```bash
docker-compose down
```

### Docker Setup Details

The project includes a complete Docker setup for easy development and deployment:

**Services:**
- **Backend**: FastAPI server running on Python 3.11 with auto-reload
- **Frontend**: React + Vite development server on Node.js 22

**Features:**
- **Volume Mounts**: Live code changes are reflected immediately
- **Networking**: Services communicate via Docker network
- **Environment**: Pre-configured with all dependencies
- **Ports**: Backend (8000), Frontend (5173)

**Development Commands:**
```bash
# Start in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build backend

# Stop and remove containers
docker-compose down
```

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
├── docker-compose.yml     # Docker setup
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
- **useAI**: Provides AI-powered features (summarization and smart search)

#### 3. **Application Flow**

**Teacher Flow**:
1. Access Teacher Dashboard (`/teacher`)
2. View question statistics and list
3. Use Smart Search to find specific questions with natural language queries
4. Create new questions using the QuestionForm component
5. Click "View Details" on any question
6. Navigate to Question View (`/teacher/questions/:id`)
7. Review student answers and question details
8. Generate AI summaries with custom instructions
9. View AI-generated analysis of student responses

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

#### useAI Hook

The `useAI` hook provides a clean interface for AI-powered features, including both summarization and smart search functionality.

**Available Hooks**:
- **`useSummarizeAnswers`**: Generates AI-powered summaries of student responses
- **`useSmartSearch`**: Performs semantic search to find relevant questions

**Smart Search Hook**:
```typescript
const { smartSearch, loading, error } = useSmartSearch();

// Usage
const result = await smartSearch({
  query: "Find questions about environmental impact",
  available_questions: searchableQuestions
});
```

**Features**:
- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Comprehensive error management with user-friendly messages
- **Loading States**: Built-in loading indicators for async operations
- **API Integration**: Direct communication with AI endpoints
- **Consistent Interface**: Same pattern as other custom hooks

**Integration**: Used by the SmartSearchBar component and Question View page for AI-powered functionality.

#### SmartSearchBar Component

The `SmartSearchBar` component provides an intuitive interface for teachers to perform semantic searches across their questions using natural language queries. This component integrates with the AI smart search API to deliver intelligent question discovery.

**Features**:
- **Natural Language Input**: Teachers can type conversational search queries
- **Search Suggestions**: Pre-built suggestions for common search terms (geography, mathematics, science, etc.)
- **Real-time Search**: Instant search execution with loading indicators
- **Error Handling**: Comprehensive error display with user-friendly messages
- **Clear Functionality**: Easy way to reset search and return to all questions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive Design**: Works seamlessly on all device sizes
- **Enhanced Examples**: Clear examples showing how to search by subject area

**Props**:
```typescript
interface SmartSearchBarProps {
  searchableQuestions: QuestionItem[];  // Questions to search through (max 20)
  onSearchResults: (results: number[]) => void;  // Callback for search results
  onClearSearch: () => void;  // Callback for clearing search
  disabled?: boolean;  // Optional disabled state
}
```

**Usage Example**:
```tsx
<SmartSearchBar
  searchableQuestions={searchableQuestions}
  onSearchResults={handleSearchResults}
  onClearSearch={handleClearSearch}
  disabled={loading}
/>
```

**Integration**: The component uses the `useSmartSearch` hook internally for API communication, providing consistent error handling and loading states. It automatically limits searches to the first 20 questions for optimal performance.

#### Teacher Dashboard Integration

The Smart Search feature is seamlessly integrated into the Teacher Dashboard, providing an enhanced question management experience.

**User Experience Flow**:
1. **Access Dashboard**: Teacher opens the Teacher Dashboard (`/teacher`)
2. **View Questions**: See all questions with statistics and status
3. **Perform Search**: Use the Smart Search bar to find specific questions
4. **View Results**: See filtered results or "No results found" message
5. **Clear Search**: Easily return to viewing all questions

**Search States**:
- **No Search**: Shows all questions with statistics
- **Search with Results**: Displays only matching questions with result count
- **Search with No Results**: Shows "No results found" message with clear search option
- **Loading State**: Displays loading spinner during search execution

**Key Features**:
- **Intuitive Interface**: Search bar with helpful placeholder text and examples
- **Search Suggestions**: Quick access to common search terms with clickable buttons
- **Enhanced Question Processing**: Questions automatically include subject hints for better matching
- **Real-time Feedback**: Loading indicators and success/error messages
- **Smart Filtering**: Only shows relevant questions based on semantic matching
- **Easy Reset**: One-click clear search to return to all questions
- **Accessibility**: Full keyboard support and screen reader compatibility

**Technical Implementation**:
- **Component Architecture**: Modular SmartSearchBar component for reusability
- **State Management**: Clean separation between search state and question display
- **Performance**: Optimized to search only the first 20 questions
- **Error Handling**: Comprehensive error states with user-friendly messages

#### AI Summary Feature

The AI Summary feature allows teachers to generate intelligent analysis of student responses using OpenAI's language models. This feature is integrated into the Question View page and provides powerful insights into student understanding.

**Key Features**:
- **Custom Instructions**: Teachers can provide specific instructions for how to analyze the responses
- **Real-time Generation**: AI summary is generated on-demand with loading indicators
- **Persistent Display**: Summary remains visible until manually cleared
- **Responsive Design**: Works seamlessly on all device sizes
- **Accessibility**: Full keyboard navigation and screen reader support

**Usage Flow**:
1. Teacher navigates to Question View (`/teacher/questions/:id`)
2. Clicks "Summary with AI" button (available for questions with answers)
3. Enters custom instructions in the modal dialog
4. Clicks "Generate Summary" to send request to AI service
5. Views the generated summary in a dedicated section
6. Can clear the summary to generate a new one

**Frontend Implementation**:
- **Summary Button**: Available for both open and closed questions
- **Instructions Modal**: Modal dialog for entering custom summary instructions
- **Summary Display**: Dedicated section showing the AI-generated summary
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Custom Hook**: `useSummarizeAnswers` hook for API communication
- **State Management**: Modal visibility, instructions, summary, loading, and error states

**API Integration**:
- **Endpoint**: `POST /api/v1/ai/summarize`
- **Request Format**: JSON with context and student answers
- **Response Format**: JSON with generated summary
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Visual indicators during API calls

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
- **AI Features**: OpenAI-powered summarization and smart search capabilities
- **SQLite Database**: Persistent storage with SQLAlchemy ORM
- **Role-Based API**: Separate endpoints for teachers and students
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
- `DELETE /api/v1/questions/{question_id}` - Delete an existing question
- `GET /api/v1/questions/` - Retrieve a list of questions (optional status filter)
- `GET /api/v1/questions/{question_id}/answers` - View all submitted answers for a question

#### Student Endpoints (Answers)
- `GET /api/v1/answers/question/{access_code}` - Identify and retrieve a question for answering
- `POST /api/v1/answers/submit` - Submit a new answer or update an existing answer

#### Authentication Endpoints
- `POST /api/v1/auth/login` - Teacher login using passcode validation

### Frontend Authentication Integration

The frontend now includes a complete teacher authentication system that protects the teacher dashboard and related pages.

**Key Features**:
- **Passcode-based Authentication**: Teachers must enter a passcode to access the dashboard
- **24-hour Session**: Authentication persists in localStorage for 24 hours
- **Automatic Expiration**: Sessions automatically expire after 24 hours
- **Route Protection**: All teacher routes (`/teacher`, `/teacher/questions/:id`) are protected
- **Logout Functionality**: Teachers can logout manually from any teacher page
- **Error Handling**: Clear error messages for failed authentication attempts

**User Experience**:
1. **Access Attempt**: When visiting `/teacher` route without authentication
2. **Login Form**: Beautiful, accessible login form with passcode input
3. **Authentication**: Passcode validated against backend API
4. **Success**: Redirected to teacher dashboard with 24-hour session
5. **Session Management**: Automatic session expiration and logout options

**Implementation Details**:
- **Hook**: `useAuth()` provides authentication state and methods
- **Component**: `TeacherLogin` component for passcode entry
- **Guard**: `AuthGuard` component protects teacher routes
- **Storage**: localStorage with timestamp-based expiration
- **UI**: Consistent with existing design system and accessibility standards

#### AI Endpoints (Teacher)
- `POST /api/v1/ai/summarize` - Generate an AI-powered summary of student answers
- `POST /api/v1/ai/smart-search` - Perform semantic search to find relevant questions

## Authentication

The system includes a simple teacher authentication mechanism using passcode validation.

### Teacher Login Feature

The teacher login endpoint provides secure access control for teacher-specific functionality using a configurable passcode.

**Key Features**:
- **Passcode Validation**: Simple string-based authentication against environment variable
- **Environment Configuration**: Uses `TEACHER_PASSCODE` environment variable for security
- **Boolean Response**: Returns clear success/failure status
- **Error Handling**: Comprehensive error handling for configuration issues

## AI Features

The system includes two AI-powered features that help teachers manage and analyze classroom questions and student responses using OpenAI's language models.

### AI Summarization Feature

The AI summarization service helps teachers analyze student responses to classroom questions by generating comprehensive summaries based on custom instructions.

### AI Smart Search Feature

The AI smart search service enables teachers to perform semantic searches across their questions using natural language queries. This feature helps teachers quickly find relevant questions even when they don't remember exact keywords or phrases.

**Key Features**:
- **Semantic Matching**: Finds questions based on meaning, not just keywords
- **Natural Language Queries**: Use conversational language to search
- **Intelligent Ranking**: Returns the most relevant questions (1-3 matches)
- **Flexible Search**: Works with partial information or related concepts
- **Fast Results**: Quick response times for efficient question discovery
- **Enhanced Question Processing**: Questions include subject hints for better matching
- **Search Suggestions**: Pre-built suggestions for common search terms

**Usage Examples**:
- "geography" - finds questions about countries, capitals, maps, etc.
- "mathematics" - finds math problems, calculations, equations
- "science" - finds science questions, experiments, concepts
- "history" - finds historical questions and events
- "general knowledge" - finds general knowledge questions

**Request Format**:
```json
{
  "query": "Find questions about human impact on the environment and sustainability policies.",
  "available_questions": [
    {"id": 101, "text": "What are the three forms of matter?"},
    {"id": 102, "text": "Discuss the pros and cons of implementing a carbon tax to reduce pollution."},
    {"id": 103, "text": "Analyze the role of NGOs in promoting sustainable development goals."},
    {"id": 104, "text": "Describe the main battles of World War I."},
    {"id": 105, "text": "How does plastic consumption directly affect marine ecosystems?"}
  ]
}
```

**Response Format**:
```json
{
  "matching_question_ids": [102, 103, 105]
}
```

### Backend Implementation

The AI summarization service uses a robust HTTP-based approach that directly communicates with OpenAI's API, avoiding common client library issues.

**Architecture**:
- **Service Layer**: `AISummarizationService` handles all AI-related operations
- **HTTP Client**: Direct HTTP requests using the `requests` library
- **Error Handling**: Comprehensive error handling with specific error messages
- **Configuration**: Environment-based configuration for API keys and model settings

**Key Features**:
- **Dynamic Instructions**: Teachers can provide specific summarization instructions for each question
- **Student Analysis**: Identifies students with the deepest understanding
- **Confusion Detection**: Highlights common areas of confusion across the class
- **Flexible Formatting**: Supports various output formats and structures
- **Error Handling**: Robust error handling with meaningful error messages
- **HTTP-Based**: Direct API communication for reliability
- **Configurable**: Environment-based configuration for different models and settings

### Usage

#### Request Format

```json
{
  "context": {
    "question_id": 123,
    "question_text": "What is the primary difference between Ecology and Climate?",
    "summary_instructions": "Summarize the student answers into 3 main learning points. List the names of 2-3 students who demonstrated the deepest understanding, and mention one common area of confusion."
  },
  "student_answers": [
    {
      "student_id": "1",
      "student_name": "John Doe",
      "answer_text": "Ecology studies living organisms and their environment...",
      "submitted_at": "2024-10-16T10:00:00Z"
    }
  ]
}
```

#### Response Format

```json
{
  "summary": "Based on the student responses, three main learning points emerge: 1) Ecology focuses on living organisms and their environment... The students who demonstrated the deepest understanding were John Doe and Jane Smith... A common area of confusion was the relationship between climate and weather patterns."
}
```

### Backend Technical Details

**Service Implementation**:
The AI service uses a direct HTTP approach to communicate with OpenAI's API, avoiding client library issues.

**Key Methods**:
- `generate_summary()`: Main method for generating AI summaries
- `_make_openai_request()`: HTTP request handler for OpenAI API
- `_format_system_prompt()`: Creates structured system prompts
- `_format_user_prompt()`: Formats user data for AI processing

**Error Handling**:
- Input validation for empty instructions and missing answers
- HTTP request error handling with specific error messages
- API response validation and error recovery
- Graceful degradation when AI service is unavailable

**Data Models**:
- `SummarizationRequest`: Contains context and student answers
- `SummarizationResponse`: Contains generated summary and optional error
- `SummarizationContext`: Question details and instructions
- `StudentAnswer`: Individual student response data

### Configuration

Set the following environment variables to configure the AI service:

```bash
# Required
OPENAI_API_KEY="your-openai-api-key"

# Optional (with defaults)
OPENAI_MODEL="gpt-3.5-turbo"  # Model to use
OPENAI_TEMPERATURE="0.7"      # Response creativity (0.0-1.0)
OPENAI_MAX_TOKENS="2000"      # Maximum response length
```

### Complete Workflow

The AI summarization feature provides a complete end-to-end workflow for analyzing student responses:

#### Teacher Experience

1. **Access Question**: Teacher navigates to any question with student answers
2. **Initiate Summary**: Clicks "Summary with AI" button
3. **Provide Instructions**: Enters custom analysis instructions in modal dialog
4. **Generate Analysis**: AI processes student responses according to instructions
5. **Review Results**: Views generated summary with insights and recommendations
6. **Take Action**: Uses insights to adjust teaching or provide feedback

#### Example Instructions

Teachers can provide various types of instructions:

- **Theme Analysis**: "Summarize the main themes from student answers"
- **Understanding Assessment**: "Identify students who demonstrated deep understanding"
- **Confusion Detection**: "Highlight common areas of confusion"
- **Learning Points**: "Extract 3 key learning points from the responses"
- **Gap Analysis**: "Identify knowledge gaps that need addressing"

### Integration

The AI summarization service integrates seamlessly with the existing classroom Q&A system:

1. **Teacher Workflow**: After viewing student answers, teachers can request AI summaries
2. **Custom Instructions**: Each summary can be tailored with specific analysis requirements
3. **Student Insights**: AI identifies patterns and highlights exceptional responses
4. **Educational Value**: Helps teachers understand class comprehension and adjust teaching
5. **Real-time Analysis**: Immediate insights without manual analysis
6. **Scalable Solution**: Works with any number of student responses

### Troubleshooting

**Common Issues**:
- **Button Not Working**: Ensure question has student answers and API key is configured
- **Generation Fails**: Check API key validity, internet connectivity, and instructions
- **Poor Quality Summaries**: Provide more specific instructions and ensure meaningful content

**Error Messages**:
- "No student answers provided": Question has no submitted answers
- "Summary instructions cannot be empty": Instructions field is required
- "OpenAI API request failed": Network or API configuration issue
- "Empty response from OpenAI API": API returned no content

**Performance**:
- Response time: 2-5 seconds typically
- Token limits may affect large numbers of answers
- Rate limiting applies to frequent usage

## Development Principles

This project follows these key principles:

1. **Simple Code**: Clean, straightforward implementation without unnecessary complexity
2. **Documentation**: Key parts of the system are well-documented
3. **Modular Design**: Code is organized into logical modules for maintainability
4. **Readable Code**: Clear structure that's easy to understand and modify

## Testing

The project includes comprehensive testing coverage for both backend and frontend components, ensuring reliability and maintainability.

### Test Results Summary
- **Total Tests**: 50 (Backend: 32, Frontend: 18)
- **Pass Rate**: 100% (All tests passing) ✅
- **Coverage**: Complete coverage of core functionality

### Backend Testing
- **Framework**: pytest with pytest-asyncio for async testing
- **Test Types**: Unit tests (21) and Integration tests (11)
- **Coverage**: Question/Answer services, repositories, and API endpoints
- **Database**: Isolated in-memory SQLite for each test

### Frontend Testing
- **Framework**: Vitest with React Testing Library
- **Test Types**: Component tests (8), Hook tests (6), and Integration tests (4)
- **Coverage**: UI components, custom hooks, and user workflows
- **Mocking**: Comprehensive mocking of external dependencies

### Running Tests

**Backend Tests**:
```bash
cd backend
py run_tests.py
```

**Frontend Tests**:
```bash
cd ort-frontend
npm run test
```

### Test Architecture
- **Backend**: Mocked dependencies for unit tests, real database for integration tests
- **Frontend**: Component isolation with mocked APIs and user-centric testing
- **Patterns**: AAA (Arrange, Act, Assert) structure with descriptive test names
- **Isolation**: Each test runs independently with fresh data

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
