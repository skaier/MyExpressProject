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
    logger.error('MySQL connection error:', err);
    process.exit(1);
  }
};

module.exports = { connectDB, pool };