import { Express } from 'express';
import db from './database';
import config from './env';
import logger from '../utils/logger';
import { Server } from 'http';

class AppServer {
  private app: Express;
  private server?: Server;

  constructor(app: Express) {
    this.app = app;
  }

  async start(): Promise<void> {
    try {
      // 测试数据库连接
      await db.testConnection();
      
      // 启动服务器
      this.server = this.app.listen(config.app.port, () => {
        logger.info(`Server running in ${config.app.env} mode on port ${config.app.port}`);
      });

      // 处理服务器关闭
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));
      
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown(): Promise<void> {
    logger.info('Server is shutting down...');
    
    if (this.server) {
      this.server.close(async () => {
        await db.close();
        logger.info('Server has been shut down');
        process.exit(0);
      });
    }
  }
}

export default AppServer;