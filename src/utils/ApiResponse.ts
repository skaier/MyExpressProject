import { Response } from 'express';
import { HttpStatus, HttpMessage } from '../constants/http.constants';

/**
 * 统一的API响应格式
 */
interface ApiResponseFormat<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: number;
}

/**
 * API响应工具类
 * 用于统一处理成功响应的格式
 */
export class ApiResponse {
  /**
   * 发送成功响应
   * @param res Express Response 对象
   * @param data 响应数据
   * @param message 响应消息
   * @param statusCode HTTP状态码
   */
  static success<T>(
    res: Response,
    data?: T,
    message: string = HttpMessage.OK,
    statusCode: number = HttpStatus.OK
  ): Response {
    const response: ApiResponseFormat<T> = {
      success: true,
      message,
      timestamp: Date.now(),
    };

    if (data !== undefined) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * 发送创建成功响应
   * @param res Express Response 对象
   * @param data 响应数据
   * @param message 响应消息
   */
  static created<T>(
    res: Response,
    data?: T,
    message: string = HttpMessage.CREATED
  ): Response {
    return this.success(res, data, message, HttpStatus.CREATED);
  }

  /**
   * 发送无内容响应
   * @param res Express Response 对象
   * @param message 响应消息
   */
  static noContent(
    res: Response,
    message: string = HttpMessage.NO_CONTENT
  ): Response {
    return this.success(res, undefined, message, HttpStatus.NO_CONTENT);
  }

  /**
   * 发送已接受响应
   * @param res Express Response 对象
   * @param data 响应数据
   * @param message 响应消息
   */
  static accepted<T>(
    res: Response,
    data?: T,
    message: string = HttpMessage.ACCEPTED
  ): Response {
    return this.success(res, data, message, HttpStatus.ACCEPTED);
  }
}