const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');

/**
 * 获取所有用户
 */
const getAllUsers = async () => {
  return await User.find();
};

/**
 * 根据ID获取用户
 */
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

/**
 * 创建用户
 */
const createUser = async (userData) => {
  if (await User.isEmailTaken(userData.email)) {
    throw new ApiError(400, 'Email already taken');
  }
  return await User.create(userData);
};

/**
 * 更新用户
 */
const updateUser = async (userId, updateData) => {
  const user = await getUserById(userId);
  Object.assign(user, updateData);
  await user.save();
  return user;
};

/**
 * 删除用户
 */
const deleteUser = async (userId) => {
  const user = await getUserById(userId);
  await user.remove();
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};