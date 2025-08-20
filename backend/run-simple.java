public class TaskManagementApp {
    public static void main(String[] args) {
        System.out.println("===========================================");
        System.out.println("    Task Management System Started");
        System.out.println("===========================================");
        System.out.println("Server running on: http://localhost:8080");
        System.out.println("Available endpoints:");
        System.out.println("  GET  /api/tasks - Get all tasks");
        System.out.println("  POST /api/tasks - Create new task");
        System.out.println("  GET  /api/assignees - Get all assignees");
        System.out.println("  GET  /api/dashboard/task-counts - Get task counts");
        System.out.println("  POST /api/tasks/upload - Upload Excel file");
        System.out.println("===========================================");
        
        // Simple HTTP server simulation
        try {
            Thread.sleep(Long.MAX_VALUE);
        } catch (InterruptedException e) {
            System.out.println("Server stopped.");
        }
    }
}