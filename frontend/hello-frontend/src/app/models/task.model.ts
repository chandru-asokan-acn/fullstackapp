export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdDate?: string;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}