import path from 'path';
import { Server } from 'http';
import logger from './utils/logger';
let server: Server; // 声明server变量在模块作用域

// 加载环境变量
import dotenv from 'dotenv';
dotenv.config({ 
  path: path.join(__dirname, '..', '.env')
});

// 检查关键环境变量
logger.info('Checking environment variables...');
const requiredEnvVars = [
  'MYSQL_HOST',
  'MYSQL_PORT',
  'MYSQL_USER',
  'MYSQL_PASSWORD',
  'MYSQL_DATABASE',
  'JWT_SECRET'
] as const;

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

logger.info('Environment variables loaded successfully');
logger.info(`Database: ${process.env.MYSQL_DATABASE} at ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}`);

import db from './config/database';
import { validateEnvVars } from './config/env';
import app from './app';
const port = parseInt(process.env.PORT || '3000');

// 验证环境变量
validateEnvVars();

// 使用async IIFE包装启动代码
(async () => {
  try {
    await db.testConnection();
    console.log('Database connection tested successfully');
    
    // 启动服务器
    server = app.listen(port, () => {
      const serverUrl = `http://localhost:${port}`;
      
      console.log('\n\x1b[36m%s\x1b[0m', '======================================');
      console.log('\x1b[36m%s\x1b[0m', `  Server running at: ${serverUrl}`);
      console.log('\x1b[33m%s\x1b[0m', `  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('\x1b[36m%s\x1b[0m', '======================================\n');
      
      logger.info(`Server running on port ${port}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${port} is already in use`);
        console.error(`\x1b[31mError: Port ${port} is already in use\x1b[0m`);
      } else {
        logger.error('Server error:', error);
        console.error('\x1b[31mServer error:\x1b[0m', error);
      }
      process.exit(1);
    });

    server.on('listening', () => {
      logger.debug('Server is now listening');
    });
  } catch (error: unknown) {
    logger.error('Failed to start server:', error);
    console.error('\x1b[31m%s\x1b[0m', 'Failed to start server:', 
      error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
})();

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server?.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// 不导出server变量，因为它是在异步代码中初始化的