package com.example.repository;

import com.example.entity.Task;
import com.example.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByAssignee(String assignee);
    List<Task> findByDescriptionContainingIgnoreCase(String description);
    
    @Query("SELECT DISTINCT t.assignee FROM Task t ORDER BY t.assignee")
    List<String> findAllUniqueAssignees();
    
    @Query("SELECT t.status, COUNT(t) FROM Task t GROUP BY t.status")
    List<Object[]> countTasksByStatus();
}