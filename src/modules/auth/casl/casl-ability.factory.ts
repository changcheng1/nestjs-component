/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-01 19:12:34
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 19:39:11
 * @FilePath: /myself-space/nestjs/src/modules/auth/casl/casl-ability.factory.ts
 * @Description: CASL 权限能力工厂
 */
import { Injectable } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { UserRoleService } from '../../user/services/user-role.service';

// 用户信息接口
interface UserInfo {
  id: number;
  username: string;
}

@Injectable()
export class CaslAbilityFactory {
  constructor(private userRoleService: UserRoleService) {}
  /**
   * 为用户创建权限能力
   * @param user 用户信息
   * @returns 权限能力对象
   */
  async createForUser(user: UserInfo) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    // 获取用户角色
    const userRoles = await this.userRoleService.findRoleByUserId(user.id);
    const roleNames = userRoles.map((role) => role.name);

    console.log(`为用户 ${user.username} (ID: ${user.id}) 创建权限能力`);
    console.log('用户角色:', roleNames);
    // 根据角色分配权限
    if (roleNames.includes('admin')) {
      // 管理员权限：可以做任何事
      can('manage', 'all');
      console.log('分配管理员权限');
    } else if (roleNames.includes('user')) {
      // 普通用户权限
      can('read', 'User');
      can('read', 'Logs'); // 用户可以查看日志
      can('create', 'Logs'); // 用户可以创建日志
      console.log('分配普通用户权限');
    } else {
      // 访客权限：只能读取公开内容
      cannot('read', 'User');
      cannot('read', 'Logs'); // 访客可以查看日志
      console.log('分配访客权限');
    }
    return build();
  }
}
