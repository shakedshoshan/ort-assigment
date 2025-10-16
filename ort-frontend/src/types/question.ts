export interface Question {
  id: number;
  title: string;
  text: string;
  access_code: string;
  is_closed: boolean;
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