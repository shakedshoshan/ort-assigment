import { useParams, Link } from 'react-router-dom';
import { useQuestionWithAnswers, useCloseQuestion } from '../../hooks/useQuestions';
import { useSummarizeAnswers } from '../../hooks/useAI';
import { useState } from 'react';
import { type Answer } from '../../types/answer';
import { type StudentAnswer, type SummarizationRequest } from '../../types/ai';
import { LoadingSpinner } from '../../components/ui';
import { ErrorAlert } from '../../components/ui';

export default function QuestionView() {
  const { id } = useParams<{ id: string }>();
  const questionId = parseInt(id || '0');
  
  // State for AI summary feature
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryInstructions, setSummaryInstructions] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  
  // Fetch question with answers data using the new hook
  const { 
    question, 
    answers, 
    answerCount,
    loading, 
    error, 
    refetch: refetchQuestion 
  } = useQuestionWithAnswers(questionId);
  
  // Close question functionality
  const { closeQuestion, loading: closeLoading } = useCloseQuestion();
  
  // AI summary functionality
  const { summarizeAnswers, loading: summaryLoading, error: summaryError } = useSummarizeAnswers();

  const handleCloseQuestion = async () => {
    if (question && !question.is_closed) {
      const result = await closeQuestion(question.id);
      if (result) {
        console.log('Question Closed', { questionId: question.id, title: question.title });
        alert('Question has been closed successfully!');
        // Refetch question data to update the UI
        refetchQuestion();
      }
    }
  };

  const handleOpenSummaryModal = () => {
    setShowSummaryModal(true);
  };

  const handleCloseSummaryModal = () => {
    setShowSummaryModal(false);
    setSummaryInstructions('');
  };

  const handleAISummary = async () => {
    if (!question || !summaryInstructions.trim()) return;
    
    // Format student answers for the AI request
    const formattedAnswers: StudentAnswer[] = answers.map(answer => ({
      student_id: answer.student_id,
      student_name: answer.student_name || answer.student_id, // Use actual student name if available
      answer_text: answer.text,
      submitted_at: answer.timestamp
    }));
    
    // Create the summarization request
    const request: SummarizationRequest = {
      context: {
        question_id: question.id,
        question_text: question.text,
        summary_instructions: summaryInstructions
      },
      student_answers: formattedAnswers
    };
    
    // Send request to AI service
    const result = await summarizeAnswers(request);
    
    if (result) {
      setSummary(result.summary);
      handleCloseSummaryModal();
    }
  };

  // Convert Question to QuestionDetails format for display
  const questionDetails = question ? {
    id: question.id,
    title: question.title,
    text: question.text,
    access_code: question.access_code,
    status: question.is_closed ? 'Closed' as const : 'Open' as const
  } : null;

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <ErrorAlert 
        title="Error loading question"
        message={error}
        action={
          <Link to="/teacher" className="btn btn-primary btn-sm mt-4">
            Back to Dashboard
          </Link>
        }
      />
    );
  }

  if (!question || !questionDetails) {
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

      {/* Question Details Section */}
      <div className="card">
        <div className="space-y-6">
          {/* Question Title */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">{questionDetails.title}</h2>
            <div className="flex items-center space-x-4">
              <span className={`badge ${questionDetails.status === 'Open' ? 'badge-success' : 'badge-warning'}`}>
                {questionDetails.status}
              </span>
              <span className="text-sm text-neutral-600">Access Code: {questionDetails.access_code}</span>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Question Prompt</h3>
            <div className="bg-neutral-50 rounded-lg p-4">
              <p className="text-neutral-700 leading-relaxed">{questionDetails.text}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {questionDetails.status === 'Open' && (
              <button
                onClick={handleCloseQuestion}
                disabled={closeLoading}
                className="btn btn-warning"
              >
                {closeLoading ? 'Closing...' : 'Close Question'}
              </button>
            )}
            <button
              onClick={handleOpenSummaryModal}
              disabled={summaryLoading || answers.length === 0}
              className="btn btn-primary"
            >
              {summaryLoading ? 'Generating...' : 'Summary with AI'}
            </button>
          </div>
        </div>
      </div>

      {/* Student Responses Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Student Responses</h2>
          <div className="badge badge-info">
            {answerCount} {answerCount === 1 ? 'Response' : 'Responses'}
          </div>
        </div>

        {answers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-auto w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Answer Text</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Submission Time</th>
                </tr>
              </thead>
              <tbody>
                {answers.map((answer: Answer) => (
                  <tr key={answer.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4 font-medium text-neutral-900">
                      <div>
                        <div className="font-semibold">{answer.student_name || `Student ${answer.student_id}`}</div>
                        {answer.student_name && (
                          <div className="text-sm text-neutral-500">ID: {answer.student_id}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-neutral-700 max-w-md">
                      <div className="line-clamp-3">{answer.text}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-600">
                      {new Date(answer.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* AI Summary Section - Show when summary is available */}
      {summary && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">AI Summary</h2>
            <button 
              onClick={() => setSummary(null)} 
              className="btn btn-sm btn-neutral"
            >
              Clear Summary
            </button>
          </div>
          <div className="bg-primary-50 rounded-lg p-6 border border-primary-100">
            <p className="text-neutral-800 leading-relaxed whitespace-pre-line">{summary}</p>
          </div>
        </div>
      )}

      {/* AI Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 mx-4">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Generate AI Summary</h3>
            
            <div className="mb-6">
              <label htmlFor="summary-instructions" className="form-label block mb-2 text-neutral-700">
                Instructions for Summary
              </label>
              <textarea
                id="summary-instructions"
                className="form-textarea w-full rounded-lg border-neutral-300 focus:border-primary-500 focus:ring focus:ring-primary-200 transition"
                rows={4}
                placeholder="E.g., Summarize the main themes from student answers, identify common misconceptions, or suggest topics for further discussion"
                value={summaryInstructions}
                onChange={(e) => setSummaryInstructions(e.target.value)}
              />
              {summaryError && (
                <p className="text-error-600 text-sm mt-2">{summaryError}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={handleCloseSummaryModal}
                className="btn btn-neutral"
              >
                Cancel
              </button>
              <button
                onClick={handleAISummary}
                disabled={summaryLoading || !summaryInstructions.trim()}
                className="btn btn-primary"
              >
                {summaryLoading ? (
                  <>
                    <span className="loading-spinner loading-spinner-sm mr-2"></span>
                    Generating...
                  </>
                ) : (
                  'Generate Summary'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
