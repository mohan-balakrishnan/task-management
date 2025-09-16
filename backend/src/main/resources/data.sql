-- Insert default roles
INSERT IGNORE INTO roles (id, role_name, description) VALUES
(1, 'ADMIN', 'Administrator with full access'),
(2, 'USER', 'Regular user with limited access');

-- Insert default categories
INSERT IGNORE INTO categories (name, color) VALUES
('Work', '#3498db'),
('Personal', '#e74c3c'),
('Shopping', '#f39c12'),
('Health', '#2ecc71'),
('Education', '#9b59b6'),
('Home', '#e67e22');