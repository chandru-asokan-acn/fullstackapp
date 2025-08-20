import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStatus, TaskStatusCount } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${id}`);
  }

  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks/status/${status}`);
  }

  getTasksByAssignee(assignee: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks/assignee/${assignee}`);
  }

  getAllUniqueAssignees(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/assignees`);
  }

  getTaskCountsByStatus(): Observable<TaskStatusCount[]> {
    return this.http.get<TaskStatusCount[]>(`${this.baseUrl}/dashboard/task-counts`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks`, task);
  }

  uploadTasksFromExcel(file: File): Observable<Task[]> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Task[]>(`${this.baseUrl}/tasks/upload`, formData);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
  }

  searchTasks(description: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks/search?description=${description}`);
  }
}