/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:19:41
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-04-24 16:00:47
 * @FilePath: /mvw_project/Users/changcheng/Desktop/back/src/common/guards/roles.guard.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get(Roles, context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const user = ['admin', 'user'];
    const hasRole = requiredRoles.some((role) => user.includes(role));
    return hasRole;
  }
}
