import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuestionAnswers } from '../../hooks/useQuestions';
import { type Question } from '../../types/question';
import { type Answer } from '../../types/answer';
import { QuestionCard } from '../../components/cards';
import { AnswerCard } from '../../components/cards';
import { LoadingSpinner } from '../../components/ui';
import { ErrorAlert } from '../../components/ui';

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
    return <LoadingSpinner size="lg" />;
  }

  if (error || answersError) {
    return (
      <ErrorAlert 
        title="Error loading question"
        message={error || answersError || 'An error occurred'}
        action={
          <Link to="/teacher" className="btn btn-primary btn-sm mt-4">
            Back to Dashboard
          </Link>
        }
      />
    );
  }

  if (!question) {
    return (
      <ErrorAlert 
        title="Question not found"
        message="The requested question could not be found."
        action={
          <Link to="/teacher" className="btn btn-primary btn-sm mt-4">
            Back to Dashboard
          </Link>
        }
      />
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
      <QuestionCard question={question} showActions={false} />

      {/* Answers Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Student Answers</h2>
          <div className="badge badge-success">
            {questionAnswers.length} {questionAnswers.length === 1 ? 'Answer' : 'Answers'}
          </div>
        </div>

        {answersLoading ? (
          <LoadingSpinner />
        ) : questionAnswers.length > 0 ? (
          <div className="space-y-4">
            {questionAnswers.map((answer: Answer, index: number) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                index={index}
              />
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
