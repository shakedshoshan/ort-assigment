export interface LoginResponse {
    success: boolean;
    message: string;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
