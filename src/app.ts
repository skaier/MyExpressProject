import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes';
import uploadRoutes from './routes/upload.routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import config from './config/env';
import logger from './utils/logger';
import swaggerSpec from './config/swagger';
import swaggerUi from 'swagger-ui-express';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: config.app.corsOrigin,
      credentials: true
    }));

    // Request parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('combined', {
        stream: {
          write: (message: string) => logger.info(message.trim())
        }
      }));
    }
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/upload', uploadRoutes);

    // Health check endpoint
    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'OK' });
    });

    // Swagger documentation
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private initializeErrorHandling(): void {
    // 404 handler - 应该在所有路由之后，错误处理之前
    this.app.use(notFoundHandler);
    
    // Global error handler - 应该在最后
    this.app.use(errorHandler);
  }

  public getServer(): Application {
    return this.app;
  }
}

const app = new App().app;
export default app;