/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-21 10:59:49
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-21 11:27:20
 * @FilePath: /myself-space/nestjs/src/common/middleware/tenant.middleware.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-20 18:50:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-20 18:50:00
 * @FilePath: /myself-space/nestjs/src/common/middleware/tenant.middleware.ts
 * @Description: 租户中间件 - 解析请求头中的租户ID
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// 扩展 Request 接口，添加 tenantId 属性
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 从请求头获取租户ID (支持多种格式)
    const tenantId = (req.headers['x-tenant-id'] || '1') as string;
    // 验证租户ID是否有效（只允许 1 或 2）
    if (tenantId && ['1', '2'].includes(tenantId)) {
      req.tenantId = tenantId;
    } else {
      // 默认使用租户1
      req.tenantId = '1';
    }
    next();
  }
}
