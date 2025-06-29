/**
 * @swagger
 * components:
 *   parameters:
 *     UserId:
 *       name: id
 *       in: path
 *       description: 用户ID
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *       example: 1
 *     
 *     Page:
 *       name: page
 *       in: query
 *       description: 页码（从1开始）
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         default: 1
 *       example: 1
 *     
 *     PageSize:
 *       name: pageSize
 *       in: query
 *       description: 每页记录数
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 100
 *         default: 10
 *       example: 10
 *     
 *     NameFilter:
 *       name: name
 *       in: query
 *       description: 按用户名筛选（模糊匹配）
 *       required: false
 *       schema:
 *         type: string
 *       example: John
 */

// 这个文件只包含Swagger文档注释，不需要导出任何内容
export {};