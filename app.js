const express = require('express');
const morgan = require('morgan');
const config = require('./config/config');
const app = express();

// 日志中间件
app.use(morgan(config.logger.format));

// 常用中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由模块
const usersRouter = require('./routes/users');

// 基本路由
app.get('/', (req, res) => {
  res.json({ message: '欢迎使用Express框架' });
});

// 用户路由
app.use('/users', usersRouter);

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 404处理
app.use((req, res, next) => {
  res.status(404).json({ error: '未找到路由' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器错误' });
});

// 设置端口
app.listen(config.app.port, () => {
  console.log(`服务器运行在 http://localhost:${config.app.port}`);
  console.log(`环境: ${config.app.env}`);
});