const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

// Swagger定义
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LittleExpress API',
      version: '1.0.0',
      description: '基于Node.js和Express的高性能RESTful API文档',
      contact: {
        name: '开发团队',
        email: 'dev@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:${config.port}/api',
        description: '开发服务器',
      },
      {
        url: 'https://api.example.com/v1',
        description: '生产服务器',
      }
    ],
    tags: [
      { name: 'Auth', description: '用户认证相关接口' },
      { name: 'Users', description: '用户管理相关接口' },
      { name: 'System', description: '系统管理接口' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: '请在Authorization头中使用JWT令牌，格式: Bearer <token>'
        }
      },
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
              description: '创建时间',
              example: '2023-01-01T00:00:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '更新时间',
              example: '2023-01-02T00:00:00Z'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
              example: 400
            },
            message: {
              type: 'string',
              example: '参数验证失败'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: '响应数据'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: '认证失败',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                statusCode: 401,
                message: '无效的认证令牌'
              }
            }
          }
        },
        Success: {
          description: '成功响应',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Success'
              }
            }
          }
        },
        BadRequest: {
          description: '无效请求',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                statusCode: 400,
                message: '参数验证失败'
              }
            }
          }
        },
        NotFound: {
          description: '资源不存在',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                statusCode: 404,
                message: '资源未找到'
              }
            }
          }
        },
        ServerError: {
          description: '服务器错误',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                statusCode: 500,
                message: '服务器内部错误'
              }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['src/routes/*.js', 'src/controllers/*.js', 'src/models/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;