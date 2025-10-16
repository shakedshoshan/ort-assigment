interface DeleteButtonProps {
  onDelete: () => void;
  isDeleting?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  confirmMessage?: string;
}

export function DeleteButton({ 
  onDelete, 
  isDeleting = false, 
  disabled = false,
  size = 'sm',
  confirmMessage = 'Are you sure you want to delete this item? This action cannot be undone.'
}: DeleteButtonProps) {
  const handleDelete = () => {
    if (window.confirm(confirmMessage)) {
      onDelete();
    }
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md', 
    lg: 'btn-lg'
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting || disabled}
      className={`btn btn-error ${sizeClasses[size]}`}
    >
      {isDeleting ? (
        <>
          <div className="loading loading-spinner loading-xs"></div>
          Deleting...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </>
      )}
    </button>
  );
}
