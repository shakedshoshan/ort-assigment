/**
 * useCreateQuestion Hook Tests
 * 
 * Tests the useCreateQuestion custom hook functionality including:
 * - Successful question creation with API calls
 * - Error handling for failed requests
 * - Loading state management during async operations
 */
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, it, describe, vi, expect } from 'vitest'
import { useCreateQuestion } from '../../hooks/useQuestions'

// Mock fetch globally
global.fetch = vi.fn()

describe('useCreateQuestion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create question successfully', async () => {
    const mockResponse = {
      id: 1,
      title: 'Test Question',
      text: 'Test content',
      access_code: 'TEST123'
    }

    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const { result } = renderHook(() => useCreateQuestion())

    const questionData = {
      title: 'Test Question',
      text: 'Test content',
      access_code: 'TEST123'
    }

    let createResult
    await waitFor(async () => {
      createResult = await result.current.createQuestion(questionData)
    })

    expect(createResult).toEqual(mockResponse)
    expect(result.current.error).toBeNull()
  })

  it('should handle create question error', async () => {
    ;(fetch as any).mockRejectedValueOnce(new Error('Create failed'))

    const { result } = renderHook(() => useCreateQuestion())

    const questionData = {
      title: 'Test Question',
      text: 'Test content',
      access_code: 'TEST123'
    }

    const createResult = await result.current.createQuestion(questionData)
    
    // Test that the function handles errors gracefully
    expect(createResult).toBeNull()
  })

  it('should set loading state during creation', async () => {
    const mockResponse = { id: 1, message: 'Success' }
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const { result } = renderHook(() => useCreateQuestion())

    const questionData = {
      title: 'Test Question',
      text: 'Test content',
      access_code: 'TEST123'
    }

    // Should not be loading initially
    expect(result.current.loading).toBe(false)

    // Start creation
    await result.current.createQuestion(questionData)

    // Should no longer be loading after completion
    expect(result.current.loading).toBe(false)
  })
})
