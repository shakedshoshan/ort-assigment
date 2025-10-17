import { useState, useEffect, useCallback } from 'react';
import type { AuthState, LoginResponse } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_AUTH_URL || '';


// Global authentication state management
let authStateListeners: Array<(state: AuthState) => void> = [];
let currentAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Function to notify all listeners of state changes
const notifyAuthStateChange = (newState: AuthState) => {
  currentAuthState = newState;
  authStateListeners.forEach(listener => listener(newState));
};

/**
 * Hook for teacher authentication
 * Manages authentication state, login functionality, and localStorage persistence
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(currentAuthState);

  // Subscribe to global auth state changes
  useEffect(() => {
    const listener = (newState: AuthState) => {
      setAuthState(newState);
    };
    
    authStateListeners.push(listener);
    
    // Set initial state
    setAuthState(currentAuthState);
    
    // Check authentication status on mount if not already checked
    if (currentAuthState.isLoading) {
      checkAuthStatus();
    }
    
    return () => {
      authStateListeners = authStateListeners.filter(l => l !== listener);
    };
  }, []);

  /**
   * Check if user is authenticated by verifying localStorage token
   */
  const checkAuthStatus = useCallback(() => {
    try {
      const authData = localStorage.getItem('teacher_auth');
      if (!authData) {
        notifyAuthStateChange({
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return;
      }

      const { expiresAt } = JSON.parse(authData);
      const now = Date.now();

      // Check if token has expired (24 hours)
      if (now > expiresAt) {
        localStorage.removeItem('teacher_auth');
        notifyAuthStateChange({
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return;
      }

      notifyAuthStateChange({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('teacher_auth');
      notifyAuthStateChange({
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication verification failed',
      });
    }
  }, []);

  /**
   * Login with passcode
   */
  const login = useCallback(async (passcode: string): Promise<boolean> => {
    notifyAuthStateChange({ ...currentAuthState, isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LoginResponse = await response.json();

      if (data.success) {
        // Save to localStorage with 24-hour expiration
        const timestamp = Date.now();
        const expiresAt = timestamp + (24 * 60 * 60 * 1000); // 24 hours
        
        const authData = {
          timestamp,
          expiresAt,
          authenticated: true,
        };

        localStorage.setItem('teacher_auth', JSON.stringify(authData));

        notifyAuthStateChange({
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return true;
      } else {
        notifyAuthStateChange({
          isAuthenticated: false,
          isLoading: false,
          error: data.message || 'Authentication failed',
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      notifyAuthStateChange({
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      return false;
    }
  }, []);

  /**
   * Logout and clear authentication data
   */
  const logout = useCallback(() => {
    localStorage.removeItem('teacher_auth');
    notifyAuthStateChange({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    notifyAuthStateChange({ ...currentAuthState, error: null });
  }, []);

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    logout,
    clearError,
    checkAuthStatus,
  };
};
