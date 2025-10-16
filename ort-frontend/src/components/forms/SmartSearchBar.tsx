import { useState } from 'react';
import { useSmartSearch } from '../../hooks/useAI';
import { type QuestionItem } from '../../types/ai';

interface SmartSearchBarProps {
  searchableQuestions: QuestionItem[];
  onSearchResults: (results: number[]) => void;
  onClearSearch: () => void;
  disabled?: boolean;
}

export default function SmartSearchBar({
  searchableQuestions,
  onSearchResults,
  onClearSearch,
  disabled = false
}: SmartSearchBarProps) {
  const { smartSearch, loading: searchLoading, error: searchError } = useSmartSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Quick search suggestions
  const searchSuggestions = [
    'general knowledge',
    'geography',
    'mathematics', 
    'science',
    'history',
    'literature',
    'capital cities',
    'math problems',
    'science questions'
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchableQuestions.length === 0) {
      onSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const result = await smartSearch({
        query: searchQuery,
        available_questions: searchableQuestions
      });
      console.log(result);

      if (result) {
        onSearchResults(result.matching_question_ids);
      } else {
        onSearchResults([]);
      }
    } catch (err) {
      console.error('Search failed:', err);
      onSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onClearSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const isDisabled = disabled || searchLoading || isSearching || !searchQuery.trim();

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="smartSearch" className="form-label text-neutral-700">
        Smart Search
        <span className="ml-1 text-sm text-neutral-500">
          (e.g., "geography", "math problems", "science questions", "history")
        </span>
      </label>
      
      <div className="flex space-x-2">
        <input
          id="smartSearch"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your search query..."
          className="form-input flex-1"
          disabled={disabled || searchLoading || isSearching}
          aria-label="Smart search input"
        />
        
        <button
          onClick={handleSearch}
          disabled={isDisabled}
          className="btn btn-primary"
          aria-label="Perform smart search"
        >
          {searchLoading || isSearching ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Search'
          )}
        </button>
        
        {searchQuery && (
          <button
            onClick={handleClear}
            className="btn btn-ghost"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
      
      {searchError && (
        <div className="alert alert-error mt-2" role="alert">
          <p>Search failed: {searchError}</p>
        </div>
      )}
      
      {/* Search suggestions */}
      {!searchQuery && !isSearching && (
        <div className="mt-2">
          <p className="text-sm text-neutral-600 mb-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {searchSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setSearchQuery(suggestion)}
                className="btn btn-sm btn-outline"
                disabled={disabled}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
