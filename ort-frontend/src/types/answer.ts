export interface Answer {
  id: number;
  question_id: number;
  student_id: string;
  student_name: string | null;
  text: string;
  timestamp: string;
}

export interface AnswerSubmission {
  access_code: string;
  student_id: string;
  answer_text: string;
}

export interface AnswerResponse {
  id: number;
  question_id: number;
  student_id: string;
  text: string;
  timestamp: string;
  student_name: string;
  message: string;
}
