import { useAuth } from '../../hooks/useAuth';
import { TeacherLogin } from '../forms/TeacherLogin';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Authentication guard component that protects teacher routes
 * Shows login form if not authenticated, otherwise renders children
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-neutral-600 mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return fallback || <TeacherLogin />;
  }

  // Render protected content if authenticated
  return <>{children}</>;
}
