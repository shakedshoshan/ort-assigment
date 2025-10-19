/**
 * useQuestions Hook Tests
 * 
 * Tests the useQuestions custom hook functionality including:
 * - Fetching questions from API with proper state management
 * - Error handling for network failures
 * - Loading state transitions during data fetching
 */
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, it, describe, vi, expect } from 'vitest'
import { useQuestions } from '../../hooks/useQuestions'


// Mock fetch globally
global.fetch = vi.fn()

describe('useQuestions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch questions successfully', async () => {
    const mockQuestions = [
      { id: 1, title: 'Test Question 1', text: 'Test content 1', access_code: 'TEST1', is_closed: false },
      { id: 2, title: 'Test Question 2', text: 'Test content 2', access_code: 'TEST2', is_closed: true }
    ]

    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockQuestions,
    })

    const { result } = renderHook(() => useQuestions())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.questions).toEqual(mockQuestions)
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch error', async () => {
    ;(fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useQuestions())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.questions).toEqual([])
    expect(result.current.error).toBe('Network error')
  })

  it('should set loading state initially', () => {
    const { result } = renderHook(() => useQuestions())
    
    expect(result.current.loading).toBe(true)
    expect(result.current.questions).toEqual([])
    expect(result.current.error).toBeNull()
  })
})
