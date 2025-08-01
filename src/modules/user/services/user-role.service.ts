/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-06 11:55:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 11:49:26
 * @FilePath: /myself-space/nestjs/src/user/services/user-role.service.ts
 * @Description: 用户角色服务
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../../database/entities/user-role.entity';
import { Role } from '../../../database/entities/role.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  /**
   * 根据用户ID查找角色
   * @param userId 用户ID
   * @returns 角色列表
   */
  async findRoleByUserId(userId: number): Promise<Role[]> {
    const userRole = await this.userRoleRepository.find({
      where: { userId },
    });

    if (userRole.length === 0) {
      return [];
    }

    const roleIds = userRole.map((ur) => ur.roleId);
    return this.rolesRepository.findByIds(roleIds);
  }

  /**
   * 为用户分配角色
   * @param userId 用户ID
   * @param roleIds 角色ID数组
   */
  async assignRole(userId: number, roleIds: number[]): Promise<void> {
    // 先删除现有角色
    await this.userRoleRepository.delete({ userId });

    // 分配新角色
    const userRole = roleIds.map((roleId) => ({
      userId,
      roleId,
    }));

    await this.userRoleRepository.save(userRole);
  }

  /**
   * 检查用户是否有指定角色
   * @param userId 用户ID
   * @param roleName 角色名称
   * @returns 是否有该角色
   */
  async hasRole(userId: number, roleName: string): Promise<boolean> {
    // 先查询用户的角色ID
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
    });

    if (userRoles.length === 0) {
      return false;
    }

    const roleIds = userRoles.map((ur) => ur.roleId);
    // 查询所有角色
    const roles = await this.rolesRepository.findByIds(roleIds);
    // 判断是否有目标角色名
    return roles.some((role) => role.name === roleName);
  }
}
