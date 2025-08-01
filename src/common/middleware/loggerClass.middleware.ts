/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-13 13:24:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-13 13:24:06
 * @FilePath: /myself-space/nestjs/src/common/middleware/loggerClass.middleware.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const host = req.hostname;
    const url = req.originalUrl;
    const method = req.method;
    const statusCode = res.statusCode;
    console.log(
      `请求连接${host}${url} 请求方法${method} 返回状态码${statusCode}`,
    );
    next();
  }
}
