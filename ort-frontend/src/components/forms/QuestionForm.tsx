import { useState } from 'react';
import { useCreateQuestion } from '../../hooks/useQuestions';
import { type QuestionCreate } from '../../types/question';

interface QuestionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export function QuestionForm({ 
  onSuccess, 
  onCancel, 
  showCancelButton = true 
}: QuestionFormProps) {
  const { createQuestion, loading: createLoading, error: createError } = useCreateQuestion();
  const [formData, setFormData] = useState<QuestionCreate>({
    title: '',
    text: '',
    access_code: '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    
    if (!formData.title.trim() || !formData.text.trim() || !formData.access_code.trim()) {
      return;
    }

    const result = await createQuestion(formData);
    if (result) {
      setSuccessMessage('Question created successfully!');
      setFormData({ title: '', text: '', access_code: '' });
      onSuccess?.();
    }
  };

  const resetForm = () => {
    setFormData({ title: '', text: '', access_code: '' });
    setSuccessMessage(null);
    onCancel?.();
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Create New Question</h2>
        
        {createError && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error creating question: {createError}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label" htmlFor="title">
              <span className="label-text font-medium">Question Title</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter question title"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="text">
              <span className="label-text font-medium">Question Text</span>
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              placeholder="Enter the question content"
              className="textarea textarea-bordered w-full h-24"
              required
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="access_code">
              <span className="label-text font-medium">Access Code</span>
            </label>
            <input
              type="text"
              id="access_code"
              name="access_code"
              value={formData.access_code}
              onChange={handleInputChange}
              placeholder="Enter access code for students"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createLoading}
            >
              {createLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                'Create Question'
              )}
            </button>
            {showCancelButton && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-ghost"
                disabled={createLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
