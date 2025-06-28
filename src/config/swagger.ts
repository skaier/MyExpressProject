import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition, Options } from 'swagger-jsdoc';
import config from './env';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API Documentation',
    version: '1.0.0',
    description: 'API documentation for Express application',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: `http://localhost:${config.app.port}${config.app.apiPrefix}`,
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '用户ID'
          },
          username: {
            type: 'string',
            description: '用户名'
          },
          email: {
            type: 'string',
            format: 'email',
            description: '邮箱'
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
      RegisterUser: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: {
            type: 'string',
            description: '用户名'
          },
          email: {
            type: 'string',
            format: 'email',
            description: '邮箱'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: '密码(最少6位)'
          }
        }
      },
      LoginUser: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: '邮箱'
          },
          password: {
            type: 'string',
            description: '密码'
          }
        }
      },
      UpdateUser: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: '新用户名'
          },
          email: {
            type: 'string',
            format: 'email',
            description: '新邮箱'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: '新密码(最少6位)'
          }
        }
      }
    },
    parameters: {
      UserId: {
        in: 'path',
        name: 'id',
        schema: {
          type: 'string'
        },
        required: true,
        description: '用户ID'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const options: Options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/models/*.ts']
};

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;