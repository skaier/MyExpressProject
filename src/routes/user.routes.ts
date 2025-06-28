/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: 用户管理
 * 
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: 未授权 - 缺少或无效的认证令牌
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: 未授权
 *     AuthenticationFailed:
 *       description: 认证失败 - 用户名或密码错误
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: 认证失败
 */

import { Router } from 'express';
import userController from '../controllers/user.controller';
import validateRequest from '../middlewares/validateRequest';
import auth from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags: [Users]
 *     summary: 用户注册
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: 注册成功
 *       400:
 *         description: 无效输入
 */
router.post('/register', 
  validateRequest({
    name: { type: 'string', required: true },
    email: { type: 'string', format: 'email', required: true },
    password: { type: 'string', minLength: 6, required: true }
  }),
  userController.register
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: 用户登录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: 登录成功
 *       401:
 *         $ref: '#/components/responses/AuthenticationFailed'
 */
router.post('/login',
  validateRequest({
    email: { type: 'string', format: 'email', required: true },
    password: { type: 'string', required: true }
  }),
  userController.login
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: 获取用户信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: 用户不存在
 */
router.get('/:id', 
  auth,
  userController.getProfile
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: 更新用户信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: 更新成功
 *       400:
 *         description: 无效输入
 *       401:
 *         description: 未授权
 */
router.put('/:id',
  auth,
  validateRequest({
    username: { type: 'string', required: false },
    email: { type: 'string', format: 'email', required: false },
    password: { type: 'string', minLength: 6, required: false }
  }),
  userController.updateProfile
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: 删除用户
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       204:
 *         description: 删除成功
 *       401:
 *         description: 未授权
 */
router.delete('/:id',
  auth,
  userController.deleteProfile
);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: 获取所有用户
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权
 */
router.get('/',
  auth,
  userController.getUsers
);

export default router;