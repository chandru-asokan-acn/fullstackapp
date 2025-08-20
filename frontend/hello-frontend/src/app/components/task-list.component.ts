import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { Task, TaskStatus } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="task-list-container">
      <h2>Task Management</h2>
      
      <!-- Assignee Filter -->
      <div class="filters">
        <label for="assigneeFilter">Filter by Assignee:</label>
        <select id="assigneeFilter" (change)="onAssigneeChange($event)" class="filter-select">
          <option value="">All Assignees</option>
          <option *ngFor="let assignee of assignees()" [value]="assignee">{{ assignee }}</option>
        </select>
      </div>
      
      <!-- Add Task Form -->
      <div class="task-form">
        <h3>Add New Task</h3>
        <div class="form-row">
          <input 
            type="text" 
            placeholder="Task description" 
            [(ngModel)]="newTask.description"
            class="form-input">
          
          <select [(ngModel)]="newTask.status" class="form-select">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          
          <input 
            type="text" 
            placeholder="Assignee" 
            [(ngModel)]="newTask.assignee"
            class="form-input">
          
          <button (click)="createTask()" class="btn btn-primary">Add Task</button>
        </div>
      </div>
      
      <!-- Excel Upload -->
      <div class="upload-section">
        <h3>Upload Tasks from Excel</h3>
        <input type="file" (change)="onFileSelected($event)" accept=".xlsx,.xls" class="file-input">
        <button (click)="uploadFile()" [disabled]="!selectedFile" class="btn btn-secondary">Upload Excel</button>
        <small>Format: Column 1 = Description, Column 2 = Status, Column 3 = Assignee</small>
      </div>
      
      <!-- Task List -->
      <div class="tasks-section">
        <h3>Tasks {{ selectedAssignee() ? 'for ' + selectedAssignee() : '' }} ({{ filteredTasks().length }})</h3>
        
        <div *ngIf="filteredTasks().length === 0" class="no-tasks">
          No tasks found.
        </div>
        
        <div *ngFor="let task of filteredTasks()" class="task-item">
          <div class="task-content">
            <div class="task-description">{{ task.description }}</div>
            <div class="task-meta">
              <span class="assignee">👤 {{ task.assignee }}</span>
              <span class="status-badge" [class]="'status-' + task.status.toLowerCase()">
                {{ task.status.replace('_', ' ') }}
              </span>
              <span class="date">📅 {{ task.createdDate | date:'short' }}</span>
            </div>
          </div>
          <div class="task-actions">
            <button (click)="editTask(task)" class="btn btn-edit">Edit</button>
            <button (click)="deleteTask(task.id!)" class="btn btn-delete">Delete</button>
          </div>
        </div>
      </div>
      
      <!-- Edit Modal -->
      <div *ngIf="editingTask()" class="modal-overlay" (click)="cancelEdit()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>Edit Task</h3>
          <input 
            type="text" 
            [(ngModel)]="editingTask()!.description"
            class="form-input">
          
          <select [(ngModel)]="editingTask()!.status" class="form-select">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          
          <input 
            type="text" 
            [(ngModel)]="editingTask()!.assignee"
            class="form-input">
          
          <div class="modal-actions">
            <button (click)="updateTask()" class="btn btn-primary">Update</button>
            <button (click)="cancelEdit()" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .filters {
      margin-bottom: 30px;
    }
    
    .filter-select {
      padding: 8px;
      margin-left: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .task-form, .upload-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    
    .form-row {
      display: flex;
      gap: 15px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .form-input, .form-select {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      flex: 1;
      min-width: 150px;
    }
    
    .file-input {
      margin-right: 15px;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .btn-primary {
      background: #007bff;
      color: white;
    }
    
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    
    .btn-edit {
      background: #ffc107;
      color: #212529;
    }
    
    .btn-delete {
      background: #dc3545;
      color: white;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .tasks-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .task-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #eee;
    }
    
    .task-content {
      flex: 1;
    }
    
    .task-description {
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .task-meta {
      display: flex;
      gap: 15px;
      font-size: 14px;
      color: #666;
    }
    
    .status-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
    
    .status-todo { background: #fff3cd; color: #856404; }
    .status-in_progress { background: #d1ecf1; color: #0c5460; }
    .status-done { background: #d4edda; color: #155724; }
    
    .task-actions {
      display: flex;
      gap: 10px;
    }
    
    .no-tasks {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 40px;
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal {
      background: white;
      padding: 30px;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
    }
    
    .modal .form-input, .modal .form-select {
      width: 100%;
      margin-bottom: 15px;
    }
    
    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  filteredTasks = signal<Task[]>([]);
  assignees = signal<string[]>([]);
  selectedAssignee = signal<string>('');
  editingTask = signal<Task | null>(null);
  selectedFile: File | null = null;
  
  newTask: Task = {
    description: '',
    status: TaskStatus.TODO,
    assignee: ''
  };
  
  constructor(private taskService: TaskService) {}
  
  ngOnInit() {
    this.loadTasks();
    this.loadAssignees();
  }
  
  loadTasks() {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks.set(tasks);
      this.applyFilter();
    });
  }
  
  loadAssignees() {
    this.taskService.getAllUniqueAssignees().subscribe(assignees => {
      this.assignees.set(assignees);
    });
  }
  
  onAssigneeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedAssignee.set(target.value);
    this.applyFilter();
  }
  
  applyFilter() {
    let filtered = this.tasks();
    
    if (this.selectedAssignee()) {
      filtered = filtered.filter(task => task.assignee === this.selectedAssignee());
    }
    
    this.filteredTasks.set(filtered);
  }
  
  createTask() {
    if (this.newTask.description.trim() && this.newTask.assignee.trim()) {
      this.taskService.createTask(this.newTask).subscribe(() => {
        this.loadTasks();
        this.loadAssignees();
        this.newTask = { description: '', status: TaskStatus.TODO, assignee: '' };
      });
    }
  }
  
  editTask(task: Task) {
    this.editingTask.set({ ...task });
  }
  
  updateTask() {
    const task = this.editingTask();
    if (task && task.id) {
      this.taskService.updateTask(task.id, task).subscribe(() => {
        this.loadTasks();
        this.loadAssignees();
        this.editingTask.set(null);
      });
    }
  }
  
  cancelEdit() {
    this.editingTask.set(null);
  }
  
  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
        this.loadAssignees();
      });
    }
  }
  
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files?.[0] || null;
  }
  
  uploadFile() {
    if (this.selectedFile) {
      this.taskService.uploadTasksFromExcel(this.selectedFile).subscribe(() => {
        this.loadTasks();
        this.loadAssignees();
        this.selectedFile = null;
        alert('Tasks uploaded successfully!');
      });
    }
  }
}