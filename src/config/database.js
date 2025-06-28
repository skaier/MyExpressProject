const mysql = require('mysql2/promise');
const { error, info } = require('../utils/logger');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    info('Database connection established successfully');
    connection.release();
  } catch (err) {
    error('Failed to connect to the database:', err.message);
    process.exit(1);
  }
};

module.exports = {
  pool,
  testConnection
};