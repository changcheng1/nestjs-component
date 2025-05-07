/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-21 15:45:42
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-07 17:22:49
 * @FilePath: /mvw_project/Users/changcheng/Desktop/testjs-demo/src/common/filters/http-exception.filter.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

// 引入HttpException
@Catch(HttpException)
// 全局异常过滤器
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    console.log(
      `错误连接${request.url} 返回错误信息${JSON.stringify(
        exception.getResponse(),
      )}`,
    );
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
