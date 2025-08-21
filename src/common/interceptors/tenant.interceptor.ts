/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-21 11:35:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-21 11:53:22
 * @FilePath: /myself-space/nestjs/src/common/interceptors/tenant.interceptor.ts
 * @Description: 租户拦截器 - 统一在请求参数中添加 tenantId
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    // 获取租户ID（由中间件设置）
    const tenantId = request.tenantId || '1';

    // 将 tenantId 添加到请求体中
    if (request.body && typeof request.body === 'object') {
      request.body.tenantId = tenantId;
    }
    return next.handle();
  }
}
