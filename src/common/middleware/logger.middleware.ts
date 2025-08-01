/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:41:41
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-13 13:23:51
 * @FilePath: /myself-space/nestjs/src/common/middleware/logger.middleware.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:24:19
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-13 13:20:41
 * @FilePath: /mvw_project/Users/changcheng/Desktop/back/src/common/middleware/logger.middleware.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Request, Response, NextFunction } from 'express';
/**
 * 日志中间件
 * @param req 请求
 * @param res 响应
 * @param next 下一个中间件
 */
export function logger(req: Request, res: Response, next: NextFunction) {
  const host = req.hostname;
  const url = req.originalUrl;
  const method = req.method;
  const statusCode = res.statusCode;
  console.log(
    `请求连接${host}${url} 请求方法${method} 返回状态码${statusCode}`,
  );
  next();
}
