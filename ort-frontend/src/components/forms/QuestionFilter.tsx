
export type FilterOption = 'all' | 'open' | 'closed';

interface QuestionFilterProps {
  selectedFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  disabled?: boolean;
}

export default function QuestionFilter({ 
  selectedFilter, 
  onFilterChange, 
  disabled = false 
}: QuestionFilterProps) {
  const filterOptions: { value: FilterOption; label: string; count?: number }[] = [
    { value: 'all', label: 'All Questions' },
    { value: 'open', label: 'Open Questions' },
    { value: 'closed', label: 'Closed Questions' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          disabled={disabled}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${selectedFilter === option.value
              ? 'bg-primary-600 text-neutral-800 shadow-medium border border-neutral-800'
              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 hover:text-neutral-900 border border-neutral-200'
            }
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer hover:shadow-soft'
            }
          `}
        >
          {option.label}
          {option.count !== undefined && (
            <span className="ml-1 text-xs opacity-75">
              ({option.count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
