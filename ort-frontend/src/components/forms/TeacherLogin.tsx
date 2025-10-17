import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface TeacherLoginProps {
  onSuccess?: () => void;
}

export function TeacherLogin({ onSuccess }: TeacherLoginProps) {
  const { login, isLoading, error, clearError } = useAuth();
  const [passcode, setPasscode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    clearError();
    const success = await login(passcode.trim());

    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className=" flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-primary-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">Teacher Access</h1>
          <p className="text-neutral-600 mt-2">
            Enter your teacher passcode to access the dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="alert alert-error">
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-medium">Authentication Failed</h3>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="passcode" className="form-label">
                Teacher Passcode
              </label>
              <input
                id="passcode"
                type="password"
                className="form-input"
                placeholder="Enter your teacher passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                autoFocus
                autoComplete="current-password"
              />
              <p className="form-help">
                Contact your administrator if you don't have a passcode.
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !passcode.trim()}
                className="btn btn-primary btn-lg w-full"
              >
                {isLoading ? (
                  <>
                    <div className="loading loading-spinner loading-sm mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <svg 
                      className="w-5 h-5 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                      />
                    </svg>
                    Access Dashboard
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-neutral-500">
            Secure teacher authentication required
          </p>
        </div>
      </div>
    </div>
  );
}
