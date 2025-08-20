package com.example;

import com.example.dto.TaskStatusCount;
import com.example.entity.Task;
import com.example.entity.TaskStatus;
import com.example.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:4200", "https://*.amplifyapp.com"})
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @GetMapping("/tasks")
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }
    
    @GetMapping("/tasks/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/tasks/status/{status}")
    public List<Task> getTasksByStatus(@PathVariable TaskStatus status) {
        return taskService.getTasksByStatus(status);
    }
    
    @GetMapping("/tasks/assignee/{assignee}")
    public List<Task> getTasksByAssignee(@PathVariable String assignee) {
        return taskService.getTasksByAssignee(assignee);
    }
    
    @GetMapping("/assignees")
    public List<String> getAllUniqueAssignees() {
        return taskService.getAllUniqueAssignees();
    }
    
    @GetMapping("/dashboard/task-counts")
    public List<TaskStatusCount> getTaskCountsByStatus() {
        return taskService.getTaskCountsByStatus();
    }
    
    @PostMapping("/tasks")
    public Task createTask(@Valid @RequestBody Task task) {
        return taskService.createTask(task);
    }
    
    @PostMapping("/tasks/upload")
    public ResponseEntity<?> uploadTasks(@RequestParam("file") MultipartFile file) {
        try {
            List<Task> tasks = taskService.uploadTasksFromExcel(file);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing file: " + e.getMessage());
        }
    }
    
    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task taskDetails) {
        try {
            Task updatedTask = taskService.updateTask(id, taskDetails);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/tasks/search")
    public List<Task> searchTasks(@RequestParam String description) {
        return taskService.searchTasks(description);
    }
}