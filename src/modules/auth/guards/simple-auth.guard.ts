/*
 * @Author: changcheng 364000100@qq.com
 * @Date: 2025-08-21 17:40:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-22 11:47:57
 * @FilePath: /myself-space/nestjs/src/auth/simple-auth.guard.ts
 * @Description: 简化的认证守卫 - 不依赖 Passport 策略
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../auth.service';

// 扩展 Request 接口以包含 tenantId
interface RequestWithTenant extends Request {
  tenantId?: string;
  user?: any;
}

@Injectable()
export class SimpleAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否跳过身份验证
    const skipAuth = this.reflector.get<boolean>(
      'skipAuth',
      context.getHandler(),
    );
    if (skipAuth) {
      console.log('🔓 跳过身份验证');
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithTenant>();

    // 获取租户ID
    const tenantId = (request.headers['x-tenant-id'] as string) || '1';

    // 检查是否是文件上传请求
    const isFileUpload = request.headers['content-type']?.includes(
      'multipart/form-data',
    );

    if (isFileUpload) {
      // 文件上传请求：从请求头获取认证信息
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        console.log('❌ 文件上传请求缺少认证头');
        throw new UnauthorizedException('缺少认证信息');
      }

      try {
        // 简单的认证逻辑：检查是否有有效的认证头
        // 这里可以根据实际需求实现更复杂的认证逻辑
        console.log('🔐 SimpleAuthGuard 文件上传认证: 租户ID =', tenantId);

        // 将租户ID附加到请求对象
        request.tenantId = tenantId;

        return true;
      } catch (error: any) {
        console.error('💥 文件上传认证错误:', error.message);
        throw new UnauthorizedException('认证失败');
      }
    } else {
      // 普通请求：从请求体获取用户名和密码
      const { username, password } = request.body || {};

      console.log(
        `🔐 SimpleAuthGuard 验证: username=${username}, tenantId=${tenantId}`,
      );

      if (!username || !password) {
        console.log('❌ 缺少用户名或密码');
        throw new UnauthorizedException('缺少用户名或密码');
      }

      try {
        // 调用 AuthService 验证，传递租户ID
        const user = await this.authService.validateUser(
          username,
          password,
          tenantId,
        );

        if (!user) {
          console.log('❌ 用户验证失败');
          throw new UnauthorizedException('用户名或密码错误');
        }

        console.log('✅ 用户验证成功:', user.username, '租户:', tenantId);

        // 将用户信息和租户ID附加到请求对象
        request.user = user;
        request.tenantId = tenantId;

        return true;
      } catch (error: any) {
        console.error('💥 认证错误:', error.message);
        throw new UnauthorizedException('用户名或密码错误');
      }
    }
  }
}
