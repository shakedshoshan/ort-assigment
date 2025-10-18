import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuestionForm } from '../../components/forms/QuestionForm'
import { beforeEach, vi, it, describe, expect } from 'vitest'

// Mock the useCreateQuestion hook
const mockCreateQuestion = vi.fn()
vi.mock('../../hooks/useQuestions', () => ({
  useCreateQuestion: () => ({
    createQuestion: mockCreateQuestion,
    loading: false,
    error: null
  })
}))

describe('Question Creation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle complete question creation flow', async () => {
    const user = userEvent.setup()
    mockCreateQuestion.mockResolvedValueOnce({ id: 1, message: 'Success' })

    render(<QuestionForm />)

    // Fill out the form
    const titleInput = screen.getByLabelText(/question title/i)
    const textInput = screen.getByLabelText(/question text/i)
    const accessCodeInput = screen.getByLabelText(/access code/i)
    const submitButton = screen.getByRole('button', { name: /create question/i })

    await user.type(titleInput, 'Test Question')
    await user.type(textInput, 'This is a test question content')
    await user.type(accessCodeInput, 'TEST123')

    // Submit the form
    await user.click(submitButton)

    // Verify the hook was called with correct data
    await waitFor(() => {
      expect(mockCreateQuestion).toHaveBeenCalledWith({
        title: 'Test Question',
        text: 'This is a test question content',
        access_code: 'TEST123'
      })
    })
  })

  it('should handle form validation', async () => {
    const user = userEvent.setup()
    render(<QuestionForm />)

    const submitButton = screen.getByRole('button', { name: /create question/i })

    // Try to submit empty form
    await user.click(submitButton)

    // Form should not submit with empty fields
    expect(mockCreateQuestion).not.toHaveBeenCalled()
  })
})
