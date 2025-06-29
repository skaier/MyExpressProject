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
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'token',
        description: 'Please enter your JWT token in the token header'
      }
    }
  },
  security: [
    {
      apiKeyAuth: []
    }
  ]
};

const options: Options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/models/*.ts', './src/swagger/*.ts']
};

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;