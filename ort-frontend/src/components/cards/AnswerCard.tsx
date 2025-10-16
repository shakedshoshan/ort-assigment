import { type Answer } from '../../types/answer';

interface AnswerCardProps {
  answer: Answer;
  index: number;
}

export function AnswerCard({ answer, index }: AnswerCardProps) {
  return (
    <div className="card card-interactive">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-600">
                {index + 1}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900">Student Answer</h4>
              <p className="text-sm text-neutral-600">
                Student ID: {answer.student_id} • Submitted {new Date(answer.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="bg-neutral-50 rounded-lg p-4">
            <p className="text-neutral-800">{answer.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
