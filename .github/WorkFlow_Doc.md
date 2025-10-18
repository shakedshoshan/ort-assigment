# GitHub Actions CI/CD

This directory contains GitHub Actions workflows for automated testing and deployment.

## Workflows

### 1. `test.yml` - Simple Test Runner
**Purpose**: Runs all tests on every commit and pull request
**Triggers**: Push and Pull Request events on main/master/develop branches
**Features**:
- Backend tests using pytest (32 tests)
- Frontend tests using Vitest (18 tests)
- Frontend linting with ESLint
- Test summary in GitHub Actions summary

## Test Coverage

Based on the project's testing summary:

- **Backend**: 32 tests (100% pass rate)
  - Unit tests: 21 (QuestionService, AnswerService, Repositories)
  - Integration tests: 11 (API endpoints)
- **Frontend**: 18 tests (100% pass rate)
  - Component tests: 8 (Forms, UI components)
  - Hook tests: 6 (Custom React hooks)
  - Integration tests: 4 (User workflows)

## Usage

The workflows run automatically on:
- Every push to main, master, or develop branches
- Every pull request targeting main, master, or develop branches

## Manual Trigger

You can also trigger workflows manually from the GitHub Actions tab in your repository.

## Dependencies

- **Backend**: Python 3.11+, pytest, FastAPI
- **Frontend**: Node.js 18+, Vitest, React Testing Library
- **Database**: SQLite (in-memory for tests)

## Test Commands

**Backend**:
```bash
cd backend
python run_tests.py
```

**Frontend**:
```bash
cd ort-frontend
npm run test
npm run lint
```
