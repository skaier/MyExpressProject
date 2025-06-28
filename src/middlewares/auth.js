const jwt = require('jsonwebtoken');
const config = require('../config/env');
const logger = require('../utils/logger');

/**
 * 验证用户是否已认证的中间件
 * 检查请求头中的 Authorization 字段是否包含有效的 JWT 令牌
 */
const authenticate = (req, res, next) => {
  try {
    // 从请求头中获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌',
        errors: ['请提供有效的认证令牌']
      });
    }

    // 提取 token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌',
        errors: ['请提供有效的认证令牌']
      });
    }

    // 验证 token
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.error(`Token verification failed: ${err.message}`);
        return res.status(401).json({
          success: false,
          message: '无效的认证令牌',
          errors: ['认证令牌已过期或无效']
        });
      }

      // 将解码后的用户信息添加到请求对象中
      req.user = decoded;
      next();
    });
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: '认证过程中发生错误',
      errors: [error.message]
    });
  }
};

module.exports = authenticate;