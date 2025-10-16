import { useState } from 'react';
import { type Question } from '../../types/question';

interface AnswerFormProps {
  question: Question;
  onSubmit: (answerText: string) => Promise<void>;
  loading?: boolean;
  onBack: () => void;
}

export function AnswerForm({ question, onSubmit, loading = false, onBack }: AnswerFormProps) {
  const [answerText, setAnswerText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    await onSubmit(answerText.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">Answer Question</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-neutral-900 mb-2">{question.title}</h3>
          <div className="bg-neutral-50 rounded-lg p-4 mb-4">
            <p className="text-neutral-800">{question.text}</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-neutral-600">
            <span className="badge badge-info">Access Code: {question.access_code}</span>
            <span className={`badge ${question.is_closed ? 'badge-error' : 'badge-success'}`}>
              {question.is_closed ? 'Closed' : 'Open'}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="answer" className="form-label">
            Your Answer
          </label>
          <textarea
            id="answer"
            className="form-textarea"
            rows={6}
            placeholder="Type your answer here..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            disabled={question.is_closed}
            required
          />
          {question.is_closed && (
            <p className="text-sm text-error-600 mt-2">
              This question is closed and no longer accepting answers.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary"
          >
            Back to Access Code
          </button>
          <button
            type="submit"
            disabled={loading || question.is_closed || !answerText.trim()}
            className="btn btn-primary btn-lg"
          >
            {loading ? (
              <>
                <div className="loading loading-spinner loading-sm mr-2"></div>
                Submitting...
              </>
            ) : (
              'Submit Answer'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
