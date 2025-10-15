import { useState } from 'react';
import { useGetQuestionByCode, useSubmitAnswer } from '../hooks/useAnswers';
import { type Question } from '../types/question';

export default function StudentForm() {
  const { getQuestionByCode, loading: questionLoading, error: questionError } = useGetQuestionByCode();
  const { submitAnswer, loading: submitLoading, error: submitError } = useSubmitAnswer();
  const [question, setQuestion] = useState<Question | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [studentId, setStudentId] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!accessCode.trim() || !studentId.trim()) {
      setError('Please enter both access code and student ID');
      return;
    }

    try {
      const questionData = await getQuestionByCode(accessCode.trim(), studentId.trim());
      if (questionData) {
        setQuestion(questionData);
      } else {
        setError('Question not found or access denied');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load question');
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!answerText.trim()) {
      setError('Please enter your answer');
      return;
    }

    try {
      const result = await submitAnswer({
        access_code: accessCode,
        student_id: studentId,
        answer_text: answerText.trim()
      });

      if (result) {
        setSubmitted(true);
        setAnswerText('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    }
  };

  const resetForm = () => {
    setQuestion(null);
    setAccessCode('');
    setStudentId('');
    setAnswerText('');
    setSubmitted(false);
    setError(null);
  };

  if (questionLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (questionError || submitError) {
    return (
      <div className="alert alert-error">
        <p>Error: {questionError || submitError}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="card card-elevated">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Thank You!</h1>
          <p className="text-neutral-600 mb-6">
            Your answer has been submitted successfully. Your response has been recorded.
          </p>
          <button
            onClick={resetForm}
            className="btn btn-primary"
          >
            Submit New Answer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Student Answer Form</h1>
        <p className="text-neutral-600">
          Enter your access code and student ID to answer a question.
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <p>{error}</p>
        </div>
      )}

      {!question ? (
        <form onSubmit={handleAccessCodeSubmit} className="space-y-6">
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
                disabled={questionLoading}
                className="btn btn-primary btn-lg w-full"
              >
                {questionLoading ? (
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
      ) : (
        <form onSubmit={handleAnswerSubmit} className="space-y-6">
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
                onClick={() => setQuestion(null)}
                className="btn btn-secondary"
              >
                Back to Access Code
              </button>
              <button
                type="submit"
                disabled={submitLoading || question.is_closed || !answerText.trim()}
                className="btn btn-primary btn-lg"
              >
                {submitLoading ? (
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
      )}
    </div>
  );
}
