import http from 'http';
import app from './app';
import config from './config/env';
import logger from './utils/logger';
import db from './config/database';

// Normalize port
const normalizePort = (val: string): number => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return 3000;
  if (port >= 0) return port;
  return 3000;
};

const port = normalizePort(config.app.port || '3000');
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Event listener for HTTP server "error" event
const onError = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Event listener for HTTP server "listening" event
const onListening = (): void => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  logger.info(`Server listening on ${bind}`);
};

// Connect to database and start server
const startServer = async (): Promise<void> => {
  try {
    await db.connect();
    logger.info('Connected to database');

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  } catch (error) {
    logger.error('Failed to connect to database', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    db.close().then(() => {
      logger.info('Database connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully');
  server.close(() => {
    db.close().then(() => {
      logger.info('Database connection closed');
      process.exit(0);
    });
  });
});