import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;

public class SimpleTaskServer {
    private static final int PORT = 8080;
    private static List<Task> tasks = new ArrayList<>();
    private static int nextId = 1;
    
    static {
        // Sample data
        tasks.add(new Task(nextId++, "Setup project repository", "DONE", "John Smith"));
        tasks.add(new Task(nextId++, "Design database schema", "DONE", "Jane Doe"));
        tasks.add(new Task(nextId++, "Implement REST APIs", "IN_PROGRESS", "Mike Johnson"));
        tasks.add(new Task(nextId++, "Create frontend components", "IN_PROGRESS", "Sarah Wilson"));
        tasks.add(new Task(nextId++, "Write unit tests", "TODO", "John Smith"));
        tasks.add(new Task(nextId++, "Deploy to production", "TODO", "Mike Johnson"));
    }
    
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(PORT);
        System.out.println("===========================================");
        System.out.println("    Task Management System Started");
        System.out.println("===========================================");
        System.out.println("Server running on: http://localhost:" + PORT);
        System.out.println("Available endpoints:");
        System.out.println("  GET  /api/tasks - Get all tasks");
        System.out.println("  GET  /api/assignees - Get all assignees");
        System.out.println("  GET  /api/dashboard/task-counts - Get task counts");
        System.out.println("===========================================");
        
        while (true) {
            Socket clientSocket = serverSocket.accept();
            new Thread(() -> handleRequest(clientSocket)).start();
        }
    }
    
    private static void handleRequest(Socket clientSocket) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
             PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {
            
            String requestLine = in.readLine();
            if (requestLine == null) return;
            
            String[] parts = requestLine.split(" ");
            String method = parts[0];
            String path = parts[1];
            
            // Skip headers
            String line;
            while ((line = in.readLine()) != null && !line.isEmpty()) {}
            
            // CORS headers
            out.println("HTTP/1.1 200 OK");
            out.println("Content-Type: application/json");
            out.println("Access-Control-Allow-Origin: *");
            out.println("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            out.println("Access-Control-Allow-Headers: Content-Type");
            out.println();
            
            if (method.equals("OPTIONS")) {
                return;
            }
            
            if (path.equals("/api/tasks")) {
                out.println(tasksToJson());
            } else if (path.equals("/api/assignees")) {
                out.println(assigneesToJson());
            } else if (path.equals("/api/dashboard/task-counts")) {
                out.println(taskCountsToJson());
            } else {
                out.println("{\"message\":\"Task Management System API\"}");
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                clientSocket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    
    private static String tasksToJson() {
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < tasks.size(); i++) {
            if (i > 0) json.append(",");
            Task task = tasks.get(i);
            json.append("{")
                .append("\"id\":").append(task.id).append(",")
                .append("\"description\":\"").append(task.description).append("\",")
                .append("\"status\":\"").append(task.status).append("\",")
                .append("\"assignee\":\"").append(task.assignee).append("\",")
                .append("\"createdDate\":\"2025-08-20T10:00:00\"")
                .append("}");
        }
        json.append("]");
        return json.toString();
    }
    
    private static String assigneesToJson() {
        Set<String> assignees = new HashSet<>();
        for (Task task : tasks) {
            assignees.add(task.assignee);
        }
        StringBuilder json = new StringBuilder("[");
        int i = 0;
        for (String assignee : assignees) {
            if (i > 0) json.append(",");
            json.append("\"").append(assignee).append("\"");
            i++;
        }
        json.append("]");
        return json.toString();
    }
    
    private static String taskCountsToJson() {
        Map<String, Integer> counts = new HashMap<>();
        counts.put("TODO", 0);
        counts.put("IN_PROGRESS", 0);
        counts.put("DONE", 0);
        
        for (Task task : tasks) {
            counts.put(task.status, counts.get(task.status) + 1);
        }
        
        StringBuilder json = new StringBuilder("[");
        int i = 0;
        for (Map.Entry<String, Integer> entry : counts.entrySet()) {
            if (i > 0) json.append(",");
            json.append("{")
                .append("\"status\":\"").append(entry.getKey()).append("\",")
                .append("\"count\":").append(entry.getValue())
                .append("}");
            i++;
        }
        json.append("]");
        return json.toString();
    }
    
    static class Task {
        int id;
        String description;
        String status;
        String assignee;
        
        Task(int id, String description, String status, String assignee) {
            this.id = id;
            this.description = description;
            this.status = status;
            this.assignee = assignee;
        }
    }
}