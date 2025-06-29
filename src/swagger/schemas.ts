/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: 用户名
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: 用户邮箱
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           description: 用户密码（至少6个字符）
 *           example: password123
 * 
 *     LoginUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 用户邮箱
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: 用户密码
 *           example: password123
 * 
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 用户ID
 *           example: 1
 *         name:
 *           type: string
 *           description: 用户名
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: 用户邮箱
 *           example: john@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 * 
 *     UpdateUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 用户名（可选）
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: 用户邮箱（可选）
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           description: 用户密码（可选，至少6个字符）
 *           example: newpassword123
 */

// 这个文件只包含Swagger文档注释，不需要导出任何内容
export {};