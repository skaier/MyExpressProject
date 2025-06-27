-- 删除旧表（如果存在）
DROP TABLE IF EXISTS user_table;

-- 创建新用户表
CREATE TABLE user_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT email_format CHECK (email REGEXP '^[\\w\\.-]+@[\\w\\.-]+\\.[\\w]{2,4}')
);

-- 添加示例数据
INSERT IGNORE INTO user_table (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQRjQmpC3n6cVJwW6vJX8bPzVYl2HdO', 'admin'),
('Test User', 'user@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQRjQmpC3n6cVJwW6vJX8bPzVYl2HdO', 'user');