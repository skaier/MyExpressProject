-- 删除旧表（如果存在）
DROP TABLE IF EXISTS user_table;

-- 创建新用户表
CREATE TABLE `user_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户头像URL，存储相对路径如/uploads/avatars/avatar_1.jpg',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`), 
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

-- 添加示例数据
INSERT IGNORE INTO user_table (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQRjQmpC3n6cVJwW6vJX8bPzVYl2HdO', 'admin'),
('Test User', 'user@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQRjQmpC3n6cVJwW6vJX8bPzVYl2HdO', 'user');