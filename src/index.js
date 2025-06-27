const path = require('path');
let server; // 声明server变量在模块作用域
require('dotenv').config({ 
  path: path.join(__dirname, '..', '.env'),
  debug: true 
});
console.log('Environment variables:', {
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  JWT_SECRET: process.env.JWT_SECRET
});

const db = require('./config/db.js');
const configureServer = require('./config/server');
const validateEnvVars = require('./config/env');
const logger = require('./utils/logger');
const app = require('../app');
const port = process.env.PORT || 3000;

// 验证环境变量
validateEnvVars();

// 配置服务器中间件
configureServer(app);

// 使用async IIFE包装启动代码
(async () => {
  try {
    await db.connectDB();
    console.log('Database connected successfully');
    
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

    server.on('error', (error) => {
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
  } catch (error) {
    logger.error('Failed to start server:', error);
    console.error('\x1b[31m%s\x1b[0m', 'Failed to start server:', error.message);
    process.exit(1);
  }
})();

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(async () => {
    await db.disconnect();
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = server;