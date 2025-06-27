const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

module.exports = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    name: process.env.APP_NAME || 'Express API'
  },
  db: {
    host: process.env.MYSQL_HOST || 'localhost',
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
    dialect: 'mysql'
  },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  logger: {
    format: process.env.LOG_FORMAT || 'dev'
  }
};