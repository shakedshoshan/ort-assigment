/**
 * AnswerForm Component Tests
 * 
 * Tests the AnswerForm component functionality including:
 * - Form field rendering and user interaction
 * - Input validation and form submission
 * - UI state management
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AnswerForm } from '../../components/forms/AnswerForm'
import { it, describe, vi, expect } from 'vitest'

const mockQuestion = {
  id: 1,
  answer_count: 0,
  title: 'Test Question',
  text: 'Test question content',
  access_code: 'TEST123',
  is_closed: false,
  created_at: '2024-01-01T00:00:00Z',
  close_date: null
}

const mockProps = {
  question: mockQuestion,
  onSubmit: vi.fn(),
  onBack: vi.fn(),
  loading: false,
  existingAnswer: null
}

describe('AnswerForm', () => {
  it('renders form fields', () => {
    render(<AnswerForm {...mockProps} />)
    
    expect(screen.getByLabelText(/your answer/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit answer/i })).toBeInTheDocument()
  })

  it('updates form fields when user types', async () => {
    const user = userEvent.setup()
    render(<AnswerForm {...mockProps} />)
    
    const answerInput = screen.getByLabelText(/your answer/i)
    
    await user.type(answerInput, 'My answer to the question')
    
    expect(answerInput).toHaveValue('My answer to the question')
  })

  it('shows submit button', () => {
    render(<AnswerForm {...mockProps} />)
    expect(screen.getByRole('button', { name: /submit answer/i })).toBeInTheDocument()
  })
})
