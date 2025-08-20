import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { TaskStatusCount, TaskStatus } from '../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>Task Dashboard</h2>
      
      <div class="stats-cards">
        <div class="stat-card todo">
          <h3>{{ getCountByStatus('TODO') }}</h3>
          <p>To Do</p>
        </div>
        
        <div class="stat-card in-progress">
          <h3>{{ getCountByStatus('IN_PROGRESS') }}</h3>
          <p>In Progress</p>
        </div>
        
        <div class="stat-card done">
          <h3>{{ getCountByStatus('DONE') }}</h3>
          <p>Completed</p>
        </div>
        
        <div class="stat-card total">
          <h3>{{ getTotalTasks() }}</h3>
          <p>Total Tasks</p>
        </div>
      </div>
      
      <div class="chart-section">
        <h3>Task Distribution</h3>
        <div class="simple-chart">
          <div *ngFor="let count of taskCounts()" class="chart-bar">
            <div class="bar" [style.height.px]="getBarHeight(count.count)" 
                 [class]="'bar-' + count.status.toLowerCase()"></div>
            <span class="bar-label">{{ count.status.replace('_', ' ') }}</span>
            <span class="bar-count">{{ count.count }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }
    
    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      color: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .stat-card h3 {
      font-size: 2.5em;
      margin: 0 0 10px 0;
    }
    
    .stat-card p {
      margin: 0;
      font-size: 1.1em;
    }
    
    .todo { background: linear-gradient(135deg, #ffc107, #ff8f00); }
    .in-progress { background: linear-gradient(135deg, #17a2b8, #007bff); }
    .done { background: linear-gradient(135deg, #28a745, #20c997); }
    .total { background: linear-gradient(135deg, #6c757d, #495057); }
    
    .chart-section {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .simple-chart {
      display: flex;
      align-items: end;
      justify-content: space-around;
      height: 200px;
      margin-top: 20px;
    }
    
    .chart-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    
    .bar {
      width: 60px;
      min-height: 20px;
      border-radius: 4px 4px 0 0;
      transition: all 0.3s ease;
    }
    
    .bar-todo { background: #ffc107; }
    .bar-in_progress { background: #17a2b8; }
    .bar-done { background: #28a745; }
    
    .bar-label {
      font-size: 12px;
      font-weight: bold;
      text-align: center;
    }
    
    .bar-count {
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
  `]
})
export class DashboardComponent implements OnInit {
  taskCounts = signal<TaskStatusCount[]>([]);
  
  constructor(private taskService: TaskService) {}
  
  ngOnInit() {
    this.loadTaskCounts();
  }
  
  loadTaskCounts() {
    this.taskService.getTaskCountsByStatus().subscribe(counts => {
      this.taskCounts.set(counts);
    });
  }
  
  getCountByStatus(status: string): number {
    const count = this.taskCounts().find(c => c.status === status);
    return count ? count.count : 0;
  }
  
  getTotalTasks(): number {
    return this.taskCounts().reduce((total, count) => total + count.count, 0);
  }
  
  getBarHeight(count: number): number {
    const maxCount = Math.max(...this.taskCounts().map(c => c.count));
    return maxCount > 0 ? (count / maxCount) * 150 + 20 : 20;
  }
}