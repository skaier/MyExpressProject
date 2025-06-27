const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

// Swagger定义
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express Demo API',
      version: '1.0.0',
      description: '一个基础的Express应用框架的API文档',
      contact: {
        name: '开发团队',
        email: 'dev@example.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: '开发服务器',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            id: {
              type: 'integer',
              description: '用户ID',
              example: 1
            },
            name: {
              type: 'string',
              description: '用户名称',
              example: '张三'
            },
            email: {
              type: 'string',
              description: '用户邮箱',
              format: 'email',
              example: 'zhangsan@example.com'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '创建时间'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '更新时间'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            code: {
              type: 'integer'
            }
          }
        }
      }
    }
  },
  apis: ['src/routes/*.js', 'src/controllers/*.js'], // 指定API路由文件的位置
};

const specs = swaggerJsdoc(options);

module.exports = specs;