-- Sample data for Task Management System
INSERT INTO tasks (description, status, assignee, created_date) VALUES 
('Setup project repository', 'DONE', 'John Smith', CURRENT_TIMESTAMP),
('Design database schema', 'DONE', 'Jane Doe', CURRENT_TIMESTAMP),
('Implement REST APIs', 'IN_PROGRESS', 'Mike Johnson', CURRENT_TIMESTAMP),
('Create frontend components', 'IN_PROGRESS', 'Sarah Wilson', CURRENT_TIMESTAMP),
('Write unit tests', 'TODO', 'John Smith', CURRENT_TIMESTAMP),
('Deploy to production', 'TODO', 'Mike Johnson', CURRENT_TIMESTAMP);