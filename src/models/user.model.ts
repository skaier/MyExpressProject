import { UserQueryParams } from '@/interfaces/user.interface';
import db from '../config/database';
import { ApiError } from '../utils/ApiError';
import { PaginationResult } from '@/interfaces/common.interface';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           writeOnly: true
 *         role:
 *           type: string
 *           example: user
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         avatar:
 *           type: string
 *           description: User profile image URL
 *           nullable: true
 *           example: "/uploads/avatars/u123456.jpg"
 *       required:
 *         - name
 *         - email
 *         - password
 */
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: string;
  avatar?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

class UserModel {
  private tableName = 'user_table';

  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { name, email, password, avatar } = user;
    const query = `INSERT INTO ${this.tableName} (name, email, password, avatar) VALUES (?, ?, ?, ?)`;

    try {
      const result = await db.query({ sql: query, values: [name, email, password, avatar || null] });
      const user = await this.getById(result.insertId);
      if (!user) {
        throw new ApiError(500, 'Failed to retrieve created user');
      }
      return user;
    } catch (error) {
      throw new ApiError(500, 'Failed to create user');
    }
  }

  async getById(id: number): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;

    try {
      const [rows] = await db.query({ sql: query, values: [id] });
      return rows || null;
    } catch (error) {
      throw new ApiError(500, 'Failed to get user');
    }
  }

  async getByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE email = ?`;

    try {
      const [rows] = await db.query({ sql: query, values: [email] });
      return rows || null;
    } catch (error) {
      throw new ApiError(500, 'Failed to get user by email');
    }
  }

  async update(id: number, updates: Partial<User>): Promise<User> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      throw new ApiError(400, 'No fields to update');
    }

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;

    try {
      await db.query({ sql: query, values: [...values, id] });
      const user = await this.getById(id);
      if (!user) {
        throw new ApiError(500, 'Failed to retrieve updated user');
      }
      return user;
    } catch (error) {
      throw new ApiError(500, 'Failed to update user');
    }
  }

  async delete(id: number): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;

    try {
      await db.query({ sql: query, values: [id] });
    } catch (error) {
      throw new ApiError(500, 'Failed to delete user');
    }
  }

  async getAll(): Promise<User[]> {
    const query = `SELECT id, name, email, role, created_at, updated_at FROM ${this.tableName}`;
    try {
      const rows = await db.query({ sql: query });
      return rows;
    } catch (error) {
      throw new ApiError(500, 'Failed to get users');
    }
  }

  async getWithPagination(params: UserQueryParams): Promise<PaginationResult<User>> {
    // 使用控制器层已转换的数字类型参数
    const { page, pageSize, ...conditions } = params || {};
    
    // 计算偏移量
    const offset = (page - 1) * pageSize;

    // 构建基础查询
    const selectFields = 'id, name, email, role, created_at, updated_at';
    let query = `SELECT ${selectFields} FROM ${this.tableName}`;
    let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const values: any[] = [];
    const whereClauses: string[] = [];

    // 处理查询条件
    if (conditions.name) {
      whereClauses.push('name LIKE ?');
      values.push(`%${conditions.name}%`);
    }
    if (conditions.email) {
      whereClauses.push('email = ?');
      values.push(conditions.email);
    }
    if (conditions.role) {
      whereClauses.push('role = ?');
      values.push(conditions.role);
    }

    // 添加WHERE条件
    if (whereClauses.length > 0) {
      const whereClause = ' WHERE ' + whereClauses.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    // 添加排序和分页
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(pageSize, offset);

    try {
      const list = await db.query({ sql: query, values });
      const [countResult] = await db.query({
        sql: countQuery,
        values: whereClauses.length > 0 ? values.slice(0, -2) : [],
      });

      if (!Array.isArray(list)) {
        throw new Error('Database query did not return an array');
      }

      return {
        list,
        total: countResult?.total || 0,
        page,
        pageSize,
      };
    } catch (error) {
      throw new ApiError(500, 'Failed to get users with pagination');
    }
  }
}

export default new UserModel();