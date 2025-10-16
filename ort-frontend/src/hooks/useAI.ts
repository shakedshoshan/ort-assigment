import { useState } from 'react';
import { type SummarizationRequest, type SummarizationResponse, type SmartSearchRequest, type SmartSearchResponse } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_AI_URL || '';

/**
 * Hook to generate AI-powered summary of student answers
 * @returns {Object} summarizeAnswers function, loading state, and error state
 */
export const useSummarizeAnswers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarizeAnswers = async (request: SummarizationRequest): Promise<SummarizationResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const data: SummarizationResponse = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    summarizeAnswers,
    loading,
    error
  };
};

/**
 * Hook to perform AI-powered semantic search for questions
 * @returns {Object} smartSearch function, loading state, and error state
 */
export const useSmartSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const smartSearch = async (request: SmartSearchRequest): Promise<SmartSearchResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/smart-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const data: SmartSearchResponse = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    smartSearch,
    loading,
    error
  };
};
