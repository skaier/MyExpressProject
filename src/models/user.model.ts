import db from '../config/database';
import ApiError from '../utils/ApiError';

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
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - email
 *         - password
 */
interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class UserModel {
  private tableName = 'user_table';

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const { name, email, password } = user;
    const query = `INSERT INTO ${this.tableName} (name, email, password) VALUES (?, ?, ?)`;
    
    try {
      const result = await db.query({ sql: query, values: [name, email, password] }); 
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
      return rows  || null;
    } catch (error) {
      throw new ApiError(500, 'Failed to get user');
    }
  }

  async getByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE email = ?`;
    
    try {
      const [rows] = await db.query({ sql: query, values: [email] });
      return rows  || null;
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

    const setClause = fields.map(field => `${field} = ?`).join(', ');
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
    const query = `SELECT id, name, email, role, createdAt, updatedAt FROM ${this.tableName}`;
    
    try {
      const [rows] = await db.query({ sql: query });
      return rows;
    } catch (error) {
      throw new ApiError(500, 'Failed to get users');
    }
  }
}

export default new UserModel();