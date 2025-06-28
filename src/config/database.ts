import mysql from 'mysql2/promise';
import config from './env';
import logger from '../utils/logger';

interface QueryOptions {
  sql: string;
  values?: any[];
}

class Database {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async query({ sql, values }: QueryOptions): Promise<any> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query(sql, values);
      return rows;
    } catch (error) {
      logger.error('Database query error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async connect(): Promise<void> {
    try {
      await this.query({ sql: 'SELECT 1' });
      logger.info('Successfully connected to database');
    } catch (error) {
      logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await this.query({ sql: 'SELECT 1' });
      return { 
        success: true,
        message: 'Database connection test successful'
      };
    } catch (error) {
      return {
        success: false,
        message: `Database connection test failed: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
}

const db = new Database();
export default db;