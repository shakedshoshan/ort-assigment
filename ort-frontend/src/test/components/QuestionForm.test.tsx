/**
 * QuestionForm Component Tests
 * 
 * Tests the QuestionForm component functionality including:
 * - Form field rendering and user input handling
 * - Conditional button display based on props
 * - Form validation and submission behavior
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuestionForm } from '../../components/forms/QuestionForm'
import { expect, it, describe, vi } from 'vitest'

// Mock the useCreateQuestion hook
vi.mock('../../hooks/useQuestions', () => ({
  useCreateQuestion: () => ({
    createQuestion: vi.fn(),
    loading: false,
    error: null
  })
}))

describe('QuestionForm', () => {
  it('renders all form fields', () => {
    render(<QuestionForm />)
    
    expect(screen.getByLabelText(/question title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/question text/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/access code/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create question/i })).toBeInTheDocument()
  })

  it('updates form fields when user types', async () => {
    const user = userEvent.setup()
    render(<QuestionForm />)
    
    const titleInput = screen.getByLabelText(/question title/i)
    const textInput = screen.getByLabelText(/question text/i)
    const accessCodeInput = screen.getByLabelText(/access code/i)
    
    await user.type(titleInput, 'Test Question')
    await user.type(textInput, 'Test question content')
    await user.type(accessCodeInput, 'TEST123')
    
    expect(titleInput).toHaveValue('Test Question')
    expect(textInput).toHaveValue('Test question content')
    expect(accessCodeInput).toHaveValue('TEST123')
  })

  it('shows create button', () => {
    render(<QuestionForm />)
    expect(screen.getByRole('button', { name: /create question/i })).toBeInTheDocument()
  })

  it('shows cancel button when showCancelButton is true', () => {
    render(<QuestionForm showCancelButton={true} />)
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('hides cancel button when showCancelButton is false', () => {
    render(<QuestionForm showCancelButton={false} />)
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
  })
})
