const User = require('../models/user.model');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

// 获取所有用户
const getAllUsers = async (req, res) => {
  try {
    logger.info('Fetching all users');
    const users = await User.findAll();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// 根据ID获取用户
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching user with ID: ${id}`);
    const user = await User.findById(id);
    
    if (!user) {
      logger.warn(`User not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error(`Error fetching user: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

// 创建用户
const createUser = async (req, res) => {
  try {
    const userData = req.body;
    logger.info('Creating new user');
    
    // 检查邮箱是否已被使用
    if (await User.isEmailTaken(userData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Email already taken'
      });
    }

    const userId = await User.create(userData);
    const newUser = await User.findById(userId);
    
    logger.info(`User created with ID: ${userId}`);
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    res.status(400).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

// 更新用户
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    logger.info(`Updating user with ID: ${id}`);
    
    // 检查用户是否存在
    const existingUser = await User.findById(id);
    if (!existingUser) {
      logger.warn(`User not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // 如果更新邮箱，检查是否已被使用
    if (updateData.email && updateData.email !== existingUser.email) {
      if (await User.isEmailTaken(updateData.email)) {
        return res.status(400).json({
          success: false,
          message: 'Email already taken'
        });
      }
    }

    // 执行更新
    const updatedUser = await User.update(id, updateData);
    
    logger.info(`User updated with ID: ${id}`);
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);
    res.status(400).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// 删除用户
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting user with ID: ${id}`);
    
    // 直接使用User模型的delete方法，它会检查用户是否存在
    await User.delete(id);

    logger.info(`User deleted with ID: ${id}`);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    if (error.statusCode === 404) {
      logger.warn(`User not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    logger.error(`Error deleting user: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// 用户登录
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 验证请求体
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '邮箱和密码不能为空' 
      });
    }
    
    // 查找用户
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: '邮箱或密码不正确' 
      });
    }
    
    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: '邮箱或密码不正确' 
      });
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.TOKEN_EXPIRE }
    );
    
    logger.info(`User logged in: ${user.email}`);
    
    // 返回令牌
    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    logger.error(`登录失败: ${err.message}`);
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: err.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser
};