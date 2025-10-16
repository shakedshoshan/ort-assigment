export interface SummarizationContext {
  question_id: number;
  question_text: string;
  summary_instructions: string;
}

export interface StudentAnswer {
  student_id: string;
  student_name: string;
  answer_text: string;
  submitted_at: string;
}

export interface SummarizationRequest {
  context: SummarizationContext;
  student_answers: StudentAnswer[];
}

export interface SummarizationResponse {
  summary: string;
  error?: string;
}
