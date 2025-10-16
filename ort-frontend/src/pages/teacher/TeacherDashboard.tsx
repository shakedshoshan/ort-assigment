import { useEffect, useState } from 'react';
import { useQuestions } from '../../hooks/useQuestions';
import { type Question } from '../../types/question';
import { StatsCard } from '../../components/cards';
import { QuestionCard } from '../../components/cards';
import { QuestionForm } from '../../components/forms';

export default function TeacherDashboard() {
  const { questions, loading, error, refetch } = useQuestions();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalOpenQuestions: 0,
    totalClosedQuestions: 0,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (questions) {
      const openQuestions = questions.filter(q => !q.is_closed).length;
      const closedQuestions = questions.filter(q => q.is_closed).length;
      
      setStats({
        totalQuestions: questions.length,
        totalOpenQuestions: openQuestions,
        totalClosedQuestions: closedQuestions,
      });
    }
  }, [questions]);

  const handleQuestionCreated = () => {
    setShowCreateForm(false);
    refetch(); // Refresh the questions list
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <p>Error loading questions: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Teacher Dashboard</h1>
          <p className="text-neutral-600 mt-2">
            Manage questions and view student answers
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          {showCreateForm ? 'Cancel' : 'Create Question'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Questions"
          value={stats.totalQuestions}
          icon="question"
          color="primary"
        />
        <StatsCard
          title="Open Questions"
          value={stats.totalOpenQuestions}
          icon="check"
          color="success"
        />
        <StatsCard
          title="Closed Questions"
          value={stats.totalClosedQuestions}
          icon="clock"
          color="warning"
        />
      </div>

      {/* Create Question Form */}
      {showCreateForm && (
        <QuestionForm
          onSuccess={handleQuestionCreated}
          onCancel={handleCancelCreate}
          showCancelButton={true}
        />
      )}

      {/* Questions List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Questions</h2>
        </div>

        {questions && questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((question: Question) => (
              <QuestionCard
                key={question.id}
                question={question}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No questions yet</h3>
            <p className="text-neutral-600">Questions will appear here once they are created.</p>
          </div>
        )}
      </div>
    </div>
  );
}
