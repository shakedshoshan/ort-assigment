import { Link } from 'react-router-dom';
import { type Question } from '../../types/question';
import { DeleteButton } from '../ui';
import { formatCreatedTime, formatCloseTime } from '../../utils/time_format';

interface QuestionCardProps {
  question: Question;
  showActions?: boolean;
  onDelete?: (questionId: number) => void;
  isDeleting?: boolean;
}

export function QuestionCard({ question, showActions = true, onDelete, isDeleting = false }: QuestionCardProps) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(question.id);
    }
  };

  return (
    <div className="card card-interactive">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
              </svg>
              {question.access_code}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Created: {formatCreatedTime(question.created_at)}
            </span>
            {question.close_date && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Closed: {formatCloseTime(question.close_date)}
              </span>
            )}
            <span className={`badge ${question.is_closed ? 'badge-error' : 'badge-success'}`}>
              {question.is_closed ? 'Closed' : 'Open'}
            </span>
          </div>
        </div>
        {showActions && (
          <div className="flex items-center space-x-2">
            <Link
              to={`/teacher/questions/${question.id}`}
              className="btn btn-primary btn-sm"
            >
              View Details
            </Link>
            {onDelete && (
              <DeleteButton
                onDelete={handleDelete}
                isDeleting={isDeleting}
                size="sm"
                confirmMessage="Are you sure you want to delete this question? This action cannot be undone."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
