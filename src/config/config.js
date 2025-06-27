require('dotenv').config();

const config = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  logger: {
    format: process.env.LOG_FORMAT || 'combined'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization'
  }
};

// 验证必要配置
if (!config.app.port) {
  throw new Error('缺少必要的应用配置: PORT');
}

module.exports = config;