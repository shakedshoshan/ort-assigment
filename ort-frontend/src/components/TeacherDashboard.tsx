import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { type Question } from '../types/question';

export default function TeacherDashboard() {
  const { questions, loading, error } = useQuestions();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalOpenQuestions: 0,
    totalClosedQuestions: 0,
  });

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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card card-elevated">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-neutral-900">Total Questions</h3>
              <p className="text-2xl font-bold text-primary-600">{stats.totalQuestions}</p>
            </div>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-neutral-900">Open Questions</h3>
              <p className="text-2xl font-bold text-success-600">{stats.totalOpenQuestions}</p>
            </div>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-neutral-900">Closed Questions</h3>
              <p className="text-2xl font-bold text-warning-600">{stats.totalClosedQuestions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Questions</h2>
        </div>

        {questions && questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((question: Question) => (
              <div key={question.id} className="card card-interactive">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      {question.title}
                    </h3>
                    <p className="text-neutral-600 mb-3 line-clamp-2">
                      {question.text}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-neutral-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        {question.access_code}
                      </span>
                      <span className={`badge ${question.is_closed ? 'badge-error' : 'badge-success'}`}>
                        {question.is_closed ? 'Closed' : 'Open'}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/teacher/questions/${question.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
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
