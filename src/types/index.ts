export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'complete' | 'incomplete';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  token: string;
}

export type NewTask = Pick<Task, 'title' | 'description' | 'priority'>;

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}
