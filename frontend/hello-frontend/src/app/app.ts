import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from './services/task.service';
import { Task, TaskStatus } from './models/task.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  tasks = signal<Task[]>([]);
  filteredTasks = signal<Task[]>([]);
  currentTask = signal<Task>({ title: '', description: '', status: TaskStatus.TODO });
  isEditing = signal(false);
  searchTerm = signal('');
  filterStatus = signal<TaskStatus | 'ALL'>('ALL');
  
  TaskStatus = TaskStatus;
  
  constructor(private taskService: TaskService) {}
  
  ngOnInit() {
    this.loadTasks();
  }
  
  loadTasks() {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks.set(tasks);
      this.applyFilters();
    });
  }
  
  applyFilters() {
    let filtered = this.tasks();
    
    if (this.searchTerm()) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
    }
    
    if (this.filterStatus() !== 'ALL') {
      filtered = filtered.filter(task => task.status === this.filterStatus());
    }
    
    this.filteredTasks.set(filtered);
  }
  
  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.applyFilters();
  }
  
  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.filterStatus.set(target.value as TaskStatus | 'ALL');
    this.applyFilters();
  }
  
  createTask() {
    if (this.currentTask().title.trim()) {
      this.taskService.createTask(this.currentTask()).subscribe(() => {
        this.loadTasks();
        this.resetForm();
      });
    }
  }
  
  editTask(task: Task) {
    this.currentTask.set({ ...task });
    this.isEditing.set(true);
  }
  
  updateTask() {
    if (this.currentTask().id && this.currentTask().title.trim()) {
      this.taskService.updateTask(this.currentTask().id!, this.currentTask()).subscribe(() => {
        this.loadTasks();
        this.resetForm();
      });
    }
  }
  
  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }
  
  resetForm() {
    this.currentTask.set({ title: '', description: '', status: TaskStatus.TODO });
    this.isEditing.set(false);
  }
  
  updateTaskField(field: keyof Task, event: Event) {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const current = this.currentTask();
    this.currentTask.set({ ...current, [field]: target.value });
  }
}