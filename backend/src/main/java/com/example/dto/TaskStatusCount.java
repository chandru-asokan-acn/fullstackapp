package com.example.dto;

import com.example.entity.TaskStatus;

public class TaskStatusCount {
    private TaskStatus status;
    private Long count;
    
    public TaskStatusCount() {}
    
    public TaskStatusCount(TaskStatus status, Long count) {
        this.status = status;
        this.count = count;
    }
    
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
    
    public Long getCount() { return count; }
    public void setCount(Long count) { this.count = count; }
}