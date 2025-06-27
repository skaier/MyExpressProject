const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// 创建连接池
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试连接
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('MySQL connected successfully');
    connection.release();
  } catch (err) {
    logger.error('MySQL connection failed:');
    console.error('\x1b[31mMySQL connection failed:\x1b[0m');
    
    // 检查缺少的环境变量
    if (!process.env.MYSQL_HOST) console.error('\x1b[31m- MYSQL_HOST is not set\x1b[0m');
    if (!process.env.MYSQL_USER) console.error('\x1b[31m- MYSQL_USER is not set\x1b[0m');
    if (!process.env.MYSQL_PASSWORD) console.error('\x1b[31m- MYSQL_PASSWORD is not set\x1b[0m');
    if (!process.env.MYSQL_DATABASE) console.error('\x1b[31m- MYSQL_DATABASE is not set\x1b[0m');
    
    console.error('\x1b[31mError details:\x1b[0m', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB, pool };