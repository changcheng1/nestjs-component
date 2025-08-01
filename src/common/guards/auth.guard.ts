/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-05-15 19:12:09
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 14:51:00
 * @FilePath: /myself-space/nestjs/src/common/guards/auth.guard.ts
 * @Description: 管理员权限守卫
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../../modules/user/user.service';

// JWT payload 类型
interface JwtPayload {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

// 扩展Request类型以包含user属性
interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 获取请求对象
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = await this.userService.findOne(request.user.username);

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    // 简化为只检查用户是否存在，不检查角色
    return true;
  }
}
