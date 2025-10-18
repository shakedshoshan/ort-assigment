import { useState } from 'react';
import { useGetQuestionByCode, useSubmitAnswer } from '../../hooks/useAnswers';
import { type Question } from '../../types/question';
import { AccessCodeForm } from '../../components/forms';
import { AnswerForm } from '../../components/forms';
import { SuccessMessage } from '../../components/ui';
import { ErrorAlert } from '../../components/ui';
import { LoadingSpinner } from '../../components/ui';

export default function StudentForm() {
  const { getQuestionByCode, loading: questionLoading, error: questionError } = useGetQuestionByCode();
  const { submitAnswer, loading: submitLoading, error: submitError } = useSubmitAnswer();
  const [question, setQuestion] = useState<Question | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [studentId, setStudentId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccessCodeSubmit = async (accessCode: string, studentId: string) => {
    setError(null);

    try {
      const questionData = await getQuestionByCode(accessCode, studentId);
      if (questionData) {
        setQuestion(questionData);
        setAccessCode(accessCode);
        setStudentId(studentId);
      } else {
        setError('Question not found or access denied');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load question');
    }
  };

  const handleAnswerSubmit = async (answerText: string) => {
    setError(null);

    try {
      const result = await submitAnswer({
        access_code: accessCode,
        student_id: studentId,
        answer_text: answerText
      });

      if (result) {
        setIsUpdate(!!question?.answer);
        setSubmitted(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    }
  };

  const resetForm = () => {
    setQuestion(null);
    setAccessCode('');
    setStudentId('');
    setSubmitted(false);
    setIsUpdate(false);
    setError(null);
  };

  if (questionLoading) {
    return <LoadingSpinner size="lg" />;
  }


  if (submitted) {
    return (
      <SuccessMessage
        title="Thank You!"
        message={isUpdate 
          ? "Your answer has been updated successfully. Your changes have been recorded."
          : "Your answer has been submitted successfully. Your response has been recorded."
        }
        actionText="Submit New Answer"
        onAction={resetForm}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Student Answer Form</h1>
        <p className="text-neutral-600">
          Enter your access code and student ID to answer a question.
        </p>
      </div>

      {(error || questionError || submitError) && (
        <ErrorAlert 
          title="Error"
          message={error || questionError || submitError || 'An error occurred'}
        />
      )}

      {!question ? (
        <AccessCodeForm
          onSubmit={handleAccessCodeSubmit}
          loading={questionLoading}
        />
      ) : (
        <AnswerForm
          question={question}
          onSubmit={handleAnswerSubmit}
          loading={submitLoading}
          onBack={() => setQuestion(null)}
          existingAnswer={question.answer}
        />
      )}
    </div>
  );
}
