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

const express = require('express');
const app = express();
const db = require('./config/db');
const configureServer = require('./config/server');
const validateEnvVars = require('./config/env');
const logger = require('./utils/logger');

// 验证环境变量
validateEnvVars();

// 配置服务器中间件
configureServer(app);

// 连接数据库
db.connectDB();

// 启动服务器
const port = process.env.PORT || 3000; // 添加默认端口
try {
  const server = app.listen(port, () => {
    const serverUrl = `http://localhost:${port}`;
    
    console.log('\n\x1b[36m%s\x1b[0m', '======================================');
    console.log('\x1b[36m%s\x1b[0m', `  Server running at: ${serverUrl}`);
    console.log('\x1b[33m%s\x1b[0m', `  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('\x1b[36m%s\x1b[0m', '======================================\n');
    
    logger.info(`Server running on port ${port}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
  });

  server.on('error', (err) => {
    logger.error('Server error:', err);
    console.error('\x1b[31m%s\x1b[0m', 'Server failed to start:', err.message);
    process.exit(1);
  });
} catch (err) {
  logger.error('Failed to start server:', err);
  console.error('\x1b[31m%s\x1b[0m', 'Failed to start server:', err.message);
  process.exit(1);
}

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