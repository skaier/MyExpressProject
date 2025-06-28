import dotenv from 'dotenv';
import path from 'path';
import logger from '../utils/logger';

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface AppConfig {
  port: string;
  env: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigin: string;
  apiPrefix: string;
}

const getDatabaseConfig = (): DatabaseConfig => {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'little_express'
  };
};

const getAppConfig = (): AppConfig => {
  return {
    port: process.env.PORT || '3000',
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    apiPrefix: process.env.API_PREFIX || '/api'
  };
};

const config = {
  db: getDatabaseConfig(),
  app: getAppConfig()
};

export function validateEnvVars(): void {
  // Validate required configuration
  if (!process.env.JWT_SECRET) {
    logger.warn('JWT_SECRET is not set. Using default secret key');
  }

  if (!process.env.MYSQL_DATABASE) {
    logger.warn('MYSQL_DATABASE is not set. Using default database name');
  }

  // Validate database credentials
  if (!process.env.MYSQL_PASSWORD) {
    throw new Error(
      'MYSQL_PASSWORD is required. Please set a password for MySQL root user.\n' +
      'For local development, you can set a temporary password with:\n' +
      '1. mysql -u root -p\n' +
      '2. ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'your_password\';\n' +
      '3. FLUSH PRIVILEGES;\n' +
      'Then set MYSQL_PASSWORD=your_password in your .env file'
    );
  }
}

validateEnvVars();

export default config;