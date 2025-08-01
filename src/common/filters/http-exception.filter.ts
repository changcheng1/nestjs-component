/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-21 15:45:42
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-13 13:48:48
 * @FilePath: /mvw_project/Users/changcheng/Desktop/testjs-demo/src/common/filters/http-exception.filter.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  LoggerService,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// 捕获所有异常,包含HttpException和所有异常
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 处理不同类型的异常
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any = {
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      // 处理 HTTP 异常
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      errorResponse =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : exceptionResponse;
    } else if (exception instanceof Error) {
      // 处理普通 Error 对象
      errorResponse = {
        message: exception.message,
        stack:
          process.env.NODE_ENV === 'development' ? exception.stack : undefined,
      };
    }

    // 记录错误日志
    this.logger.error({
      status,
      path: request.url,
      method: request.method,
      error: errorResponse as object,
      timestamp: new Date().toISOString(),
      ip: request.ip,
      userAgent: request.get('user-agent'),
    });
    console.log('http异常过滤器信息', errorResponse);
    // 返回错误响应
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...errorResponse,
    });
  }
}
