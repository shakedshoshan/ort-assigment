import { useEffect, useState, useMemo } from 'react';
import { useQuestions, useDeleteQuestion } from '../../hooks/useQuestions';
import { useAuth } from '../../hooks/useAuth';
import { type Question } from '../../types/question';
import { StatsCard } from '../../components/cards';
import { QuestionCard } from '../../components/cards';
import { QuestionForm, SmartSearchBar, QuestionFilter } from '../../components/forms';
import type { FilterOption } from '../../components/forms/QuestionFilter';

export default function TeacherDashboard() {
  const { questions, loading, error, refetch } = useQuestions();
  const { deleteQuestion, error: deleteError } = useDeleteQuestion();
  const { logout } = useAuth();
  
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalOpenQuestions: 0,
    totalClosedQuestions: 0,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');

  // Convert questions to QuestionItem format for search with enhanced context
  const searchableQuestions = useMemo(() => {
    if (!questions) return [];
    return questions.slice(0, 20).map(q => {
      // Create enhanced text that includes multiple aspects for better semantic matching
      const enhancedText = [
        q.title,
        q.text,
        // Add subject hints based on common patterns
        ...(q.text.toLowerCase().includes('capital') || q.text.toLowerCase().includes('country') || q.text.toLowerCase().includes('continent') ? ['geography'] : []),
        ...(q.text.toLowerCase().includes('solve') || q.text.toLowerCase().includes('calculate') || q.text.toLowerCase().includes('equation') ? ['mathematics'] : []),
        ...(q.text.toLowerCase().includes('explain') || q.text.toLowerCase().includes('what is') || q.text.toLowerCase().includes('describe') ? ['science', 'general knowledge'] : []),
        ...(q.text.toLowerCase().includes('when') || q.text.toLowerCase().includes('history') || q.text.toLowerCase().includes('war') ? ['history'] : []),
        ...(q.text.toLowerCase().includes('analyze') || q.text.toLowerCase().includes('compare') || q.text.toLowerCase().includes('evaluate') ? ['literature', 'critical thinking'] : [])
      ].join(' ');
      
      return {
        id: q.id,
        text: enhancedText
      };
    });
  }, [questions]);

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

  const handleSearchResults = (results: number[]) => {
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleFilterChange = (filter: FilterOption) => {
    setSelectedFilter(filter);
  };

  // Filter questions based on search results and status filter
  const displayedQuestions = useMemo(() => {
    if (!questions) return [];
    
    let filteredQuestions = questions;
    
    // Apply status filter
    if (selectedFilter === 'open') {
      filteredQuestions = filteredQuestions.filter(q => !q.is_closed);
    } else if (selectedFilter === 'closed') {
      filteredQuestions = filteredQuestions.filter(q => q.is_closed);
    }
    
    // Apply search filter if searching
    if (hasSearched) {
      if (searchResults.length === 0) return []; // Return empty array when search has no results
      filteredQuestions = filteredQuestions.filter(q => searchResults.includes(q.id));
    }
    
    return filteredQuestions;
  }, [questions, searchResults, hasSearched, selectedFilter]);

  const handleDeleteQuestion = async (questionId: number) => {
    setDeletingQuestionId(questionId);
    try {
      const result = await deleteQuestion(questionId);
      if (result) {
        // Show success message
        // You could add a toast notification here
        refetch(); // Refresh the questions list
      }
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to delete question:', err);
    } finally {
      setDeletingQuestionId(null);
    }
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

  if (deleteError) {
    return (
      <div className="alert alert-error">
        <p>Error deleting question: {deleteError}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-sm btn-outline mt-2"
        >
          Retry
        </button>
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
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-primary"
          >
            {showCreateForm ? 'Cancel' : 'Create Question'}
          </button>
          <button
            onClick={logout}
            className="btn btn-outline"
            title="Logout (valid for 24 hours)"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            Logout
          </button>
        </div>
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
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">Questions</h2>
          </div>

          {/* Question Filter */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-neutral-700">Filter by Status</h3>
            </div>
            <QuestionFilter
              selectedFilter={selectedFilter}
              onFilterChange={handleFilterChange}
              disabled={loading}
            />
          </div>

          {/* Smart Search */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-neutral-700">Search Questions</h3>
            </div>
            <SmartSearchBar
              searchableQuestions={searchableQuestions}
              onSearchResults={handleSearchResults}
              onClearSearch={handleClearSearch}
              disabled={loading}
            />
          </div>
          
          {hasSearched && searchResults.length > 0 && (
            <p className="text-sm text-success-600" role="status">
              Found {displayedQuestions.length} matching question{displayedQuestions.length !== 1 ? 's' : ''}
              {selectedFilter !== 'all' && ` (${selectedFilter} questions)`}
            </p>
          )}
        </div>

        {hasSearched && searchResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No results found</h3>
            <p className="text-neutral-600 mb-4">
              No questions match your search criteria. Try different keywords or phrases.
            </p>
            <button
              onClick={handleClearSearch}
              className="btn btn-outline btn-sm"
            >
              Clear Search
            </button>
          </div>
        ) : displayedQuestions && displayedQuestions.length > 0 ? (
          <div className="space-y-4">
            {displayedQuestions.map((question: Question) => (
              <QuestionCard
                key={question.id}
                question={question}
                showActions={true}
                onDelete={handleDeleteQuestion}
                isDeleting={deletingQuestionId === question.id}
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
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              {selectedFilter !== 'all' ? `No ${selectedFilter} questions` : 'No questions yet'}
            </h3>
            <p className="text-neutral-600">
              {selectedFilter !== 'all' 
                ? `${selectedFilter === 'open' ? 'Open' : 'Closed'} questions will appear here once they are created.`
                : 'Questions will appear here once they are created.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
