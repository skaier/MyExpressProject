import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { HttpStatus, HttpMessage } from '../constants/http.constants';
import logger from '../utils/logger';

/**
 * 全局错误处理中间件
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  let error = err;

  // 如果错误不是 ApiError 实例，转换为 ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = 
      error instanceof SyntaxError 
        ? HttpStatus.BAD_REQUEST 
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const message = 
      error instanceof SyntaxError 
        ? HttpMessage.BAD_REQUEST 
        : HttpMessage.INTERNAL_SERVER_ERROR;
    
    error = new ApiError(
      statusCode,
      message,
      false,
      err.stack
    );
  }

  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
    timestamp: Date.now()
  };

  // 记录非操作性错误
  if (!(error as ApiError).isOperational) {
    logger.error(error);
  }

  res.status((error as ApiError).statusCode).json(response);
};

/**
 * 404错误处理中间件
 */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Cannot ${req.method} ${req.path}`));
};
