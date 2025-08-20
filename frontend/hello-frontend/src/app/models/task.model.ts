export interface Task {
  id?: number;
  description: string;
  status: TaskStatus;
  assignee: string;
  createdDate?: string;
}

export interface TaskStatusCount {
  status: TaskStatus;
  count: number;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}