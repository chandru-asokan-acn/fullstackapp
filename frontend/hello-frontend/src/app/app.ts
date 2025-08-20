import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard.component';
import { TaskListComponent } from './components/task-list.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, DashboardComponent, TaskListComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Task Management System</h1>
        <nav class="nav-tabs">
          <button 
            (click)="activeTab.set('dashboard')" 
            [class.active]="activeTab() === 'dashboard'"
            class="nav-tab">
            📊 Dashboard
          </button>
          <button 
            (click)="activeTab.set('tasks')" 
            [class.active]="activeTab() === 'tasks'"
            class="nav-tab">
            📋 Tasks
          </button>
        </nav>
      </header>
      
      <main class="app-main">
        <app-dashboard *ngIf="activeTab() === 'dashboard'"></app-dashboard>
        <app-task-list *ngIf="activeTab() === 'tasks'"></app-task-list>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f5f5f5;
    }
    
    .app-header {
      background: white;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 0;
    }
    
    .app-header h1 {
      margin: 0 0 20px 0;
      color: #333;
      text-align: center;
    }
    
    .nav-tabs {
      display: flex;
      justify-content: center;
      gap: 10px;
    }
    
    .nav-tab {
      padding: 12px 24px;
      border: none;
      background: #f8f9fa;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    
    .nav-tab:hover {
      background: #e9ecef;
    }
    
    .nav-tab.active {
      background: #007bff;
      color: white;
    }
    
    .app-main {
      padding: 0;
    }
  `]
})
export class App {
  activeTab = signal<'dashboard' | 'tasks'>('dashboard');
}