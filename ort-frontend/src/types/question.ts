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
