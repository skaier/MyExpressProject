import { Request, Response, NextFunction } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import userService from '../services/user.service';
import ApiError from '../utils/ApiError';

@ApiTags('用户管理')
class UserController {
  @ApiOperation({ summary: '用户注册', description: '创建新用户账户' })
  @ApiResponse({ status: 201, description: '用户注册成功' })
  @ApiResponse({ status: 400, description: '无效的用户数据' })
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        throw new ApiError(400, 'Username, email and password are required');
      }

      const user = await userService.createUser({ username, email, password });
      
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  @ApiOperation({ summary: '获取用户资料', description: '获取当前登录用户的资料' })
  @ApiResponse({ status: 200, description: '用户资料获取成功' })
  @ApiResponse({ status: 401, description: '未授权访问' })
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const user = await userService.getUserById(userId);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  @ApiOperation({ summary: '更新用户资料', description: '更新当前登录用户的资料' })
  @ApiResponse({ status: 200, description: '用户资料更新成功' })
  @ApiResponse({ status: 400, description: '无效的用户数据' })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiBody({
    description: '用户资料更新数据',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: '张三' },
        avatar: { type: 'string', example: 'https://example.com/avatar.jpg' }
      }
    }
  })
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { username, email, password } = req.body;
      
      const user = await userService.updateUser(userId, { username, email, password });
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  @ApiOperation({ summary: '删除用户', description: '删除当前登录用户的账户' })
  @ApiResponse({ status: 204, description: '用户删除成功' })
  @ApiResponse({ status: 401, description: '未授权访问' })
  async deleteProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      await userService.deleteUser(userId);
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  @ApiOperation({ summary: '用户登录', description: '使用邮箱和密码登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 400, description: '邮箱或密码无效' })
  @ApiResponse({ status: 401, description: '认证失败' })
  @ApiBody({
    description: '登录凭证',
    required: true,
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' }
      }
    }
  })
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
      }

      const user = await userService.validateUserCredentials(email, password);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  @ApiOperation({ summary: '获取所有用户', description: '获取所有用户列表(管理员权限)' })
  @ApiResponse({ status: 200, description: '用户列表获取成功' })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 403, description: '权限不足' })
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();