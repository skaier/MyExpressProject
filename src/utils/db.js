const mongoose = require('mongoose');
const config = require('../config');
const logger = require('./logger');

// 连接数据库
const connect = async () => {
  try {
    await mongoose.connect(config.db.uri, config.db.options);
    logger.info('MongoDB connected successfully');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// 断开数据库连接
const disconnect = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected successfully');
  } catch (err) {
    logger.error('MongoDB disconnection error:', err);
    process.exit(1);
  }
};

// 监听连接事件
mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

module.exports = {
  connect,
  disconnect
};