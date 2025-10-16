import { useState, useEffect } from 'react';
import { type Question, type QuestionCreate, type QuestionResponse, type Answer, type QuestionWithAnswers } from '../types/index';

const API_BASE_URL = 'http://localhost:8000/api/v1/questions';

/**
 * Hook to fetch questions with optional status filtering
 * @param {string} statusFilter - Optional filter for question status ('open' or 'closed')
 * @returns {Object} questions data, loading state, error state, and refetch function
 */
export const useQuestions = (statusFilter?: 'open' | 'closed') => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = statusFilter ? `${API_BASE_URL}?status=${statusFilter}` : API_BASE_URL;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Question[] = await response.json();
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [statusFilter]);

  return {
    questions,
    loading,
    error,
    refetch: fetchQuestions
  };
};

/**
 * Hook to create a new question
 * @returns {Object} createQuestion function, loading state, and error state
 */
export const useCreateQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createQuestion = async (questionData: QuestionCreate): Promise<QuestionResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/open`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const data: QuestionResponse = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createQuestion,
    loading,
    error
  };
};

/**
 * Hook to close an existing question
 * @returns {Object} closeQuestion function, loading state, and error state
 */
export const useCloseQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeQuestion = async (questionId: number): Promise<QuestionResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${questionId}/close`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const data: QuestionResponse = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    closeQuestion,
    loading,
    error
  };
};

/**
 * Hook to fetch question with answers for a specific question
 * @param {number} questionId - The ID of the question to get complete info for
 * @returns {Object} question with answers data, loading state, error state, and refetch function
 */
export const useQuestionWithAnswers = (questionId: number) => {
  const [questionWithAnswers, setQuestionWithAnswers] = useState<QuestionWithAnswers | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestionWithAnswers = async () => {
    if (!questionId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${questionId}/answers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: QuestionWithAnswers = await response.json();
      setQuestionWithAnswers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionWithAnswers();
  }, [questionId]);

  return {
    questionWithAnswers,
    question: questionWithAnswers?.question || null,
    answers: questionWithAnswers?.answers || [],
    answerCount: questionWithAnswers?.answer_count || 0,
    loading,
    error,
    refetch: fetchQuestionWithAnswers
  };
};

/**
 * @deprecated Use useQuestionWithAnswers instead
 * Hook to fetch answers for a specific question
 * @param {number} questionId - The ID of the question to get answers for
 * @returns {Object} answers data, loading state, error state, and refetch function
 */
export const useQuestionAnswers = (questionId: number) => {
  const { answers, loading, error, refetch } = useQuestionWithAnswers(questionId);
  
  return {
    answers,
    loading,
    error,
    refetch
  };
};
