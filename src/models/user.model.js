const { pool } = require('../config/db.js');
const ApiError = require('../utils/ApiError');

class User {
  constructor({ id, name, email, password, role = 'user', is_active = true, created_at, updated_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // 检查邮箱是否已被使用
  static async isEmailTaken(email) {
    const [rows] = await pool.execute(
      'SELECT id FROM user_table WHERE email = ?',
      [email]
    );
    return rows.length > 0;
  }

  // 创建用户
  static async create(userData) {
    const { name, email, password, role } = userData;
    const [result] = await pool.execute(
      'INSERT INTO user_table (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return result.insertId;
  }

  // 根据ID获取用户
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, is_active, created_at, updated_at FROM user_table WHERE id = ?',
      [id]
    );
    return rows[0] ? new User(rows[0]) : null;
  }

  // 根据邮箱获取用户
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM user_table WHERE email = ?',
      [email]
    );
    return rows[0] ? new User(rows[0]) : null;
  }

  // 转换为JSON格式
  toJSON() {
    const user = { ...this };
    delete user.password;
    return user;
  }

  // 更新用户信息
  static async update(id, updateData) {
    const allowedFields = ['name', 'email', 'role', 'is_active'];
    const updates = [];
    const values = [];

    // 构建更新语句
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (updates.length === 0) {
      throw new ApiError(400, 'No valid fields to update');
    }

    values.push(id);
    const [result] = await pool.execute(
      `UPDATE user_table SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      throw new ApiError(404, 'User not found');
    }

    return this.findById(id);
  }

  // 删除用户
  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM user_table WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      throw new ApiError(404, 'User not found');
    }

    return true;
  }

  // 获取所有用户
  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, is_active, created_at, updated_at FROM user_table'
    );
    return rows.map(row => new User(row));
  }
}

// 初始化用户表
async function initUserTable() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS user_table (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT email_format CHECK (email REGEXP '^[\\\\w\\\\.-]+@[\\\\w\\\\.-]+\\\\.[\\\\w]{2,4})
    )
  `);
}

// 确保表存在
initUserTable().catch(err => {
  console.error('Failed to initialize user table:', err);
});

module.exports = User;