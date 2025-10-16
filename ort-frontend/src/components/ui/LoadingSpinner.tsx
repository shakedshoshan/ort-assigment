interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'loading-sm',
  md: '',
  lg: 'loading-lg',
};

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className={`loading loading-spinner ${sizeClasses[size]}`}></div>
    </div>
  );
}
