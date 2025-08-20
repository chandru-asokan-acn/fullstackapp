package com.example.service;

import com.example.dto.TaskStatusCount;
import com.example.entity.Task;
import com.example.entity.TaskStatus;
import com.example.repository.TaskRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
    
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }
    
    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }
    
    public List<Task> getTasksByAssignee(String assignee) {
        return taskRepository.findByAssignee(assignee);
    }
    
    public List<String> getAllUniqueAssignees() {
        return taskRepository.findAllUniqueAssignees();
    }
    
    public List<TaskStatusCount> getTaskCountsByStatus() {
        List<Object[]> results = taskRepository.countTasksByStatus();
        List<TaskStatusCount> counts = new ArrayList<>();
        
        for (Object[] result : results) {
            TaskStatus status = (TaskStatus) result[0];
            Long count = (Long) result[1];
            counts.add(new TaskStatusCount(status, count));
        }
        
        return counts;
    }
    
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }
    
    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setAssignee(taskDetails.getAssignee());
        
        return taskRepository.save(task);
    }
    
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
    
    public List<Task> searchTasks(String description) {
        return taskRepository.findByDescriptionContainingIgnoreCase(description);
    }
    
    public List<Task> uploadTasksFromExcel(MultipartFile file) throws IOException {
        List<Task> tasks = new ArrayList<>();
        
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }
        
        // Clear all existing tasks before uploading new ones
        taskRepository.deleteAll();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Skip header
                
                Cell descCell = row.getCell(0);
                Cell statusCell = row.getCell(1);
                Cell assigneeCell = row.getCell(2);
                
                if (descCell != null && statusCell != null && assigneeCell != null) {
                    String description = getCellValueAsString(descCell);
                    String statusStr = getCellValueAsString(statusCell).toUpperCase().replace(" ", "_");
                    String assignee = getCellValueAsString(assigneeCell);
                    
                    if (!description.trim().isEmpty() && !assignee.trim().isEmpty()) {
                        TaskStatus status;
                        try {
                            status = TaskStatus.valueOf(statusStr);
                        } catch (IllegalArgumentException e) {
                            status = TaskStatus.TODO; // Default status
                        }
                        
                        Task task = new Task(description.trim(), status, assignee.trim());
                        tasks.add(taskRepository.save(task));
                    }
                }
            }
        } catch (Exception e) {
            throw new IOException("Error processing Excel file: " + e.getMessage());
        }
        
        return tasks;
    }
    
    private String getCellValueAsString(Cell cell) {
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }
}