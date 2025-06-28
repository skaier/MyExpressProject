import winston from 'winston';
import config from '../config/env';

const { combine, timestamp, printf, colorize, align } = winston.format;

// Default to development if config not loaded properly
const env = config?.app?.env || 'development';
const logger = winston.createLogger({
  level: env === 'development' ? 'debug' : 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${typeof info.message === 'string' ? info.message : JSON.stringify(info.message)}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;