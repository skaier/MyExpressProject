const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

module.exports = {
  // 应用配置
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'Express API'
  },

  // 数据库配置
  db: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'test',
    dialect: 'mysql'
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-32-character-secret-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },

  // 日志配置
  logger: {
    format: process.env.LOG_FORMAT || 'dev'
  }
};