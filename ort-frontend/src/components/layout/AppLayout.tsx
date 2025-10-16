import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-neutral-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-neutral-900">
                ORT Assignment System
              </h1>
            </div>
            
            <nav className="flex space-x-6">
              <Link
                to="/teacher"
                className={`nav-link ${isActive('/teacher') ? 'nav-link-active' : ''}`}
              >
                Teacher Dashboard
              </Link>
              <Link
                to="/student"
                className={`nav-link ${isActive('/student') ? 'nav-link-active' : ''}`}
              >
                Student Form
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="section-padding">
        <div className="container-custom">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-auto">
        <div className="container-custom">
          <div className="py-6 text-center text-neutral-600">
            <p>&copy; 2024 ORT Assignment System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
