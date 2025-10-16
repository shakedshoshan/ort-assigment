import { useState } from 'react';
import { type Question, type QuestionAccess, type AnswerSubmission, type AnswerResponse } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_ANSWERS_URL || '';

/**
 * Hook to get a question by its access code
 * @returns {Object} getQuestionByCode function, loading state, and error state
 */
export const useGetQuestionByCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuestionByCode = async (accessCode: string, studentId: string): Promise<Question | null> => {
    setLoading(true);
    setError(null);
    try {
      const requestData: QuestionAccess = { student_id: studentId };
      
      const response = await fetch(`${API_BASE_URL}/question/${accessCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const data: Question = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getQuestionByCode,
    loading,
    error
  };
};

/**
 * Hook to submit an answer to a question
 * @returns {Object} submitAnswer function, loading state, and error state
 */
export const useSubmitAnswer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAnswer = async (submission: AnswerSubmission): Promise<AnswerResponse | null> => {
    setLoading(true);
    setError(null);
    
    // Frontend validation for character limit
    if (submission.answer_text.length > 200) {
      setError('Answer text cannot exceed 200 characters');
      setLoading(false);
      return null;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const data: AnswerResponse = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitAnswer,
    loading,
    error
  };
};
