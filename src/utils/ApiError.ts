import { HttpStatus, HttpMessage } from '../constants/http.constants';

/**
 * API错误类
 * 用于统一处理错误响应
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly timestamp: number;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    message: string = HttpMessage.INTERNAL_SERVER_ERROR,
    isOperational = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.timestamp = Date.now();
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * 创建400错误（错误的请求）
   */
  static badRequest(message: string = HttpMessage.BAD_REQUEST): ApiError {
    return new ApiError(HttpStatus.BAD_REQUEST, message);
  }

  /**
   * 创建401错误（未授权）
   */
  static unauthorized(message: string = HttpMessage.UNAUTHORIZED): ApiError {
    return new ApiError(HttpStatus.UNAUTHORIZED, message);
  }

  /**
   * 创建403错误（禁止访问）
   */
  static forbidden(message: string = HttpMessage.FORBIDDEN): ApiError {
    return new ApiError(HttpStatus.FORBIDDEN, message);
  }

  /**
   * 创建404错误（未找到）
   */
  static notFound(message: string = HttpMessage.NOT_FOUND): ApiError {
    return new ApiError(HttpStatus.NOT_FOUND, message);
  }

  /**
   * 创建409错误（资源冲突）
   */
  static conflict(message: string = HttpMessage.CONFLICT): ApiError {
    return new ApiError(HttpStatus.CONFLICT, message);
  }

  /**
   * 创建422错误（无法处理的实体）
   */
  static unprocessableEntity(
    message: string = HttpMessage.UNPROCESSABLE_ENTITY
  ): ApiError {
    return new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, message);
  }

  /**
   * 创建500错误（服务器内部错误）
   */
  static internal(
    message: string = HttpMessage.INTERNAL_SERVER_ERROR,
    isOperational = true
  ): ApiError {
    return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message, isOperational);
  }
}