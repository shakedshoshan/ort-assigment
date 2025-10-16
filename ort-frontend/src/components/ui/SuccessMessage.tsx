interface SuccessMessageProps {
  title: string;
  message: string;
  actionText: string;
  onAction: () => void;
  className?: string;
}

export function SuccessMessage({ 
  title, 
  message, 
  actionText, 
  onAction, 
  className = '' 
}: SuccessMessageProps) {
  return (
    <div className={`max-w-2xl mx-auto text-center py-12 ${className}`}>
      <div className="card card-elevated">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">{title}</h1>
        <p className="text-neutral-600 mb-6">{message}</p>
        <button onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      </div>
    </div>
  );
}
