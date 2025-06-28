const { error } = require('../utils/logger');

const requiredEnvVars = [
  'MYSQL_DATABASE',
  'JWT_SECRET'
];

const validateEnvVars = () => {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  // Set default values for optional variables
  process.env.PORT = process.env.PORT || '3000';
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'info';
  process.env.TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || '24h';
};

// 导出环境变量和验证函数
module.exports = {
  validateEnvVars,
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_SECRET: process.env.JWT_SECRET,
  TOKEN_EXPIRE: process.env.TOKEN_EXPIRE || '24h'
};