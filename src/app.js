const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const validateRequest = require('./middlewares/validateRequest');
const logger = require('./utils/logger');
const swaggerSpecs = require('./config/swagger');

const app = express();

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP限制100个请求
  message: 'Too many requests from this IP, please try again later'
});

// 安全中间件
app.use(helmet());
app.use(cors(config.cors));
app.use(limiter);

// 日志中间件
if (config.app.env !== 'test') {
  app.use(morgan(config.logger.format));
}

// 请求体解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Swagger文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, { explorer: true }));

// API路由
app.use('/api', routes);

// 测试路由
app.get('/api/test', (req, res) => {
  logger.info('Test endpoint accessed');
  res.json({ message: 'Test route working' });
});

// 健康检查
app.get('/health', (req, res) => {
  logger.info('Health check performed');
  res.json({ 
    status: 'ok',
    timestamp: new Date(),
    environment: config.app.env 
  });
});

// 404 处理
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
    code: 404
  });
});

// 错误处理
app.use(errorHandler);

module.exports = app;