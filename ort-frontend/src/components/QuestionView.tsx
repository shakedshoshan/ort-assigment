import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuestionAnswers } from '../hooks/useQuestions';
import { type Question } from '../types/question';
import { type Answer } from '../types/answer';

export default function QuestionView() {
  const { id } = useParams<{ id: string }>();
  const { answers, loading: answersLoading, error: answersError } = useQuestionAnswers(parseInt(id || '0'));
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // For now, we'll create a mock question since we don't have a getQuestion hook
        // In a real app, you'd fetch the question by ID from the API
        const mockQuestion: Question = {
          id: parseInt(id),
          title: 'Sample Question',
          text: 'This is a sample question text. In a real application, this would be fetched from the API.',
          access_code: 'SAMPLE123',
          is_closed: false
        };
        setQuestion(mockQuestion);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  // Answers are already filtered by question ID in the hook
  const questionAnswers = answers || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error || answersError) {
    return (
      <div className="alert alert-error">
        <p>Error loading question: {error || answersError}</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="alert alert-error">
        <p>Question not found</p>
        <Link to="/teacher" className="btn btn-primary btn-sm mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link to="/teacher" className="text-primary-600 hover:text-primary-700">
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">Question Details</h1>
        </div>
      </div>

      {/* Question Card */}
      <div className="card card-elevated">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Question</h2>
          <div className="bg-neutral-50 rounded-lg p-6">
            <p className="text-lg text-neutral-800">{question.text}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-neutral-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {questionAnswers.length} answers
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Access Code: {question.access_code}
            </span>
            <span className={`badge ${question.is_closed ? 'badge-error' : 'badge-success'}`}>
              {question.is_closed ? 'Closed' : 'Open'}
            </span>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Student Answers</h2>
          <div className="badge badge-success">
            {questionAnswers.length} {questionAnswers.length === 1 ? 'Answer' : 'Answers'}
          </div>
        </div>

        {answersLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner"></div>
          </div>
        ) : questionAnswers.length > 0 ? (
          <div className="space-y-4">
            {questionAnswers.map((answer: Answer, index: number) => (
              <div key={answer.id} className="card card-interactive">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-900">Student Answer</h4>
                        <p className="text-sm text-neutral-600">
                          Student ID: {answer.student_id} • Submitted {new Date(answer.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-neutral-800">{answer.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No answers yet</h3>
            <p className="text-neutral-600">Student answers will appear here once they submit their responses.</p>
          </div>
        )}
      </div>
    </div>
  );
}
