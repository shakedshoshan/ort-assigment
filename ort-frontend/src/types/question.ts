export interface Question {
  id: number;
  title: string;
  text: string;
  access_code: string;
  is_closed: boolean;
  created_at: string;
  close_date?: string | null;
  answer_count: number;
  student_id?: string;
  answer?: string | null;
}

export interface QuestionCreate {
  title: string;
  text: string;
  access_code: string;
}

export interface QuestionResponse {
  id: number;
  title: string;
  text: string;
  access_code: string;
  is_closed: boolean;
  close_date?: string | null;
  message?: string;
}

export interface QuestionAccess {
  student_id: string;
}

export interface QuestionDetails {
  id: number;
  title: string;
  text: string;
  access_code: string;
  status: 'Open' | 'Closed';
}

export interface QuestionWithAnswers {
  question: Question;
  answers: import('./answer').Answer[];
  answer_count: number;
}