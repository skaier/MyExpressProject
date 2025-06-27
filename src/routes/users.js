const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const logger = require('../utils/logger');

// 记录请求日志的中间件
router.use((req, res, next) => {
  logger.info(`${req.method} ${req.baseUrl}${req.path} request received`);
  next();
});

// 获取所有用户
router.get('/', userController.getAllUsers);

// 获取单个用户
router.get('/:id', userController.getUserById);

// 创建用户
router.post('/', userController.createUser);

// 更新用户
router.put('/:id', userController.updateUser);

// 删除用户
router.delete('/:id', userController.deleteUser);

module.exports = router;