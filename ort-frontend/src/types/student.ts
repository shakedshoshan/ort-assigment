export interface Student {
  id: string;
  name: string;
}

export interface StudentCreate {
  name: string;
}

export interface StudentUpdate {
  name?: string;
}
