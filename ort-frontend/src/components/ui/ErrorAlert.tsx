import { type ReactNode } from 'react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorAlert({ title, message, action, className = '' }: ErrorAlertProps) {
  return (
    <div className={`alert alert-error ${className}`}>
      <div>
        {title && <h3 className="font-medium">{title}</h3>}
        <p>{message}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
