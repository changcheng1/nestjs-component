/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:41:41
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 16:10:05
 * @FilePath: /myself-space/nestjs/src/common/guards/roles.guard.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:41:41
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 11:23:32
 * @FilePath: /myself-space/nestjs/src/common/guards/roles.guard.ts
 * @Description: 角色权限守卫
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../enum/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { UserRoleService } from '../../modules/user/services/user-role.service';
interface RequestWithUser {
  user: {
    id: number;
    username: string;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRoleService: UserRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('requiredRoles', requiredRoles);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { user } = request;

    if (!user) {
      return false;
    }

    // 从 token 中获取用户信息，然后获取角色
    const userRoles = await this.getUserRolesFromToken(user);
    // 是否包含角色
    return requiredRoles.some((role) => userRoles.includes(role));
  }

  // 从 token 中的用户信息获取角色
  private async getUserRolesFromToken(user: {
    id: number;
    username: string;
  }): Promise<Role[]> {
    console.log(
      `Getting roles for user from token: ${user.username} (ID: ${user.id})`,
    );
    // 通过id查询user_roles表
    const userRoles = await this.userRoleService.findRoleByUserId(user.id);
    return userRoles.map((role) => role.id as Role);
  }
}
