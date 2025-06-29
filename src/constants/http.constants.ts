/**
 * HTTP 状态码常量
 */
export const HttpStatus = {
  // 2xx 成功响应
  OK: 200,                    // 请求成功
  CREATED: 201,              // 创建成功
  ACCEPTED: 202,             // 已接受请求，但尚未处理完成
  NO_CONTENT: 204,           // 请求成功，无返回内容

  // 4xx 客户端错误
  BAD_REQUEST: 400,          // 错误的请求
  UNAUTHORIZED: 401,         // 未授权
  FORBIDDEN: 403,            // 禁止访问
  NOT_FOUND: 404,           // 资源未找到
  METHOD_NOT_ALLOWED: 405,  // 方法不允许
  CONFLICT: 409,            // 资源冲突
  UNPROCESSABLE_ENTITY: 422, // 请求格式正确，但语义错误

  // 5xx 服务器错误
  INTERNAL_SERVER_ERROR: 500, // 服务器内部错误
  NOT_IMPLEMENTED: 501,      // 未实现
  BAD_GATEWAY: 502,         // 错误网关
  SERVICE_UNAVAILABLE: 503,  // 服务不可用
  GATEWAY_TIMEOUT: 504,      // 网关超时
} as const;

/**
 * 响应消息常量
 */
export const HttpMessage = {
  // 2xx
  OK: 'Success',
  CREATED: 'Resource created successfully',
  ACCEPTED: 'Request accepted',
  NO_CONTENT: 'No content',

  // 4xx
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  METHOD_NOT_ALLOWED: 'Method not allowed',
  CONFLICT: 'Resource conflict',
  UNPROCESSABLE_ENTITY: 'Unprocessable entity',

  // 5xx
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NOT_IMPLEMENTED: 'Not implemented',
  BAD_GATEWAY: 'Bad gateway',
  SERVICE_UNAVAILABLE: 'Service unavailable',
  GATEWAY_TIMEOUT: 'Gateway timeout',
} as const;