import { useState } from 'react';

interface AccessCodeFormProps {
  onSubmit: (accessCode: string, studentId: string) => Promise<void>;
  loading?: boolean;
}

export function AccessCodeForm({ onSubmit, loading = false }: AccessCodeFormProps) {
  const [accessCode, setAccessCode] = useState('');
  const [studentId, setStudentId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim() || !studentId.trim()) return;
    await onSubmit(accessCode.trim(), studentId.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">Access Question</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="accessCode" className="form-label">
              Access Code
            </label>
            <input
              id="accessCode"
              type="text"
              className="form-input"
              placeholder="Enter access code..."
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="studentId" className="form-label">
              Student ID
            </label>
            <input
              id="studentId"
              type="text"
              className="form-input"
              placeholder="Enter your student ID..."
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || !accessCode.trim() || !studentId.trim()}
            className="btn btn-primary btn-lg w-full"
          >
            {loading ? (
              <>
                <div className="loading loading-spinner loading-sm mr-2"></div>
                Loading...
              </>
            ) : (
              'Access Question'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
