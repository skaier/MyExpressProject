import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userService from '../services/user.service';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import config from '../config/env';
import { UserQueryParams } from '../interfaces/user.interface';
import { DEFAULT_PAGINATION } from '../constants/app.constants';

class UserController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw ApiError.badRequest('name, email and password are required');
      }

      const user = await userService.createUser({ name, email, password });

      ApiResponse.created(res, user, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const user = await userService.getUserById(userId);

      ApiResponse.success(res, user, 'User profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { name, email, password } = req.body;
      const user = await userService.updateUser(userId, { name, email, password });

      ApiResponse.success(res, user, 'User profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      await userService.deleteUser(userId);
      
      ApiResponse.success(res, undefined, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw ApiError.badRequest('Email and password are required');
      }

      const user = await userService.validateUserCredentials(email, password);

      // 生成JWT token，24小时后过期
      const token = jwt.sign({ userId: user.id }, config.app.jwtSecret, { expiresIn: '24h' });

      ApiResponse.success(res, {
        user,
        token,
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, pageSize, ...otherParams } = req.query;

      // 转换分页参数为数字类型并提供默认值
      const query = {
        page: page ? Number(page) : DEFAULT_PAGINATION.page,
        pageSize: pageSize ? Number(pageSize) : DEFAULT_PAGINATION.pageSize,
        ...otherParams,
      } as UserQueryParams;

      // 验证转换后的值是否有效
      if (isNaN(query.page) || isNaN(query.pageSize) || query.page < 1 || query.pageSize < 1) {
        throw ApiError.badRequest('Invalid pagination parameters');
      }

      const data = await userService.getUsersWithPagination(query);

      ApiResponse.success(res, data, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();