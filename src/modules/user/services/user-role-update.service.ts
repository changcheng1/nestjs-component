/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-01 11:35:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 11:37:24
 * @FilePath: /myself-space/nestjs/src/modules/user/services/user-role-update.service.ts
 * @Description: 用户角色中间表更新服务
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../../database/entities/user-role.entity';
import { Role } from '../../../database/entities/role.entity';

// 角色数据类型定义
type RoleId = number;
type RoleObject = { id: number; name?: string; [key: string]: any };
type RoleData = RoleId | RoleObject;

@Injectable()
export class UserRoleUpdateService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 更新用户角色（支持多种数据格式）
   * @param userId 用户ID
   * @param roles 角色数据（可以是ID数组或对象数组）
   * @param strategy 更新策略：'replace' | 'add' | 'remove'
   */
  async updateUserRoles(
    userId: number,
    roles: RoleData[],
    strategy: 'replace' | 'add' | 'remove' = 'replace',
  ): Promise<void> {
    // 1. 提取角色ID
    const roleIds = this.extractRoleIds(roles);

    // 2. 验证角色是否存在
    await this.validateRoles(roleIds);

    // 3. 根据策略更新中间表
    switch (strategy) {
      case 'replace':
        await this.replaceUserRoles(userId, roleIds);
        break;
      case 'add':
        await this.addUserRoles(userId, roleIds);
        break;
    }
  }

  /**
   * 提取角色ID（处理不同格式）
   */
  private extractRoleIds(roles: RoleData[]): number[] {
    return roles.map((role) => {
      if (typeof role === 'number') {
        return role;
      } else if (typeof role === 'object' && role.id) {
        return role.id;
      } else {
        throw new Error(`Invalid role format: ${JSON.stringify(role)}`);
      }
    });
  }

  /**
   * 验证角色是否存在
   */
  private async validateRoles(roleIds: number[]): Promise<void> {
    const existingRoles = await this.roleRepository.findByIds(roleIds);
    if (existingRoles.length !== roleIds.length) {
      const existingIds = existingRoles.map((role) => role.id);
      const missingIds = roleIds.filter((id) => !existingIds.includes(id));
      throw new Error(`Roles not found: ${missingIds.join(', ')}`);
    }
  }

  /**
   * 完全替换用户角色
   */
  private async replaceUserRoles(
    userId: number,
    roleIds: number[],
  ): Promise<void> {
    // 删除现有角色
    await this.userRoleRepository.delete({ userId });

    // 添加新角色
    if (roleIds.length > 0) {
      const userRoles = roleIds.map((roleId) => ({
        userId,
        roleId,
      }));
      await this.userRoleRepository.save(userRoles);
    }
  }

  /**
   * 添加角色（不删除现有）
   */
  private async addUserRoles(userId: number, roleIds: number[]): Promise<void> {
    // 获取现有角色
    const existingRoles = await this.userRoleRepository.find({
      where: { userId },
    });
    const existingRoleIds = existingRoles.map((ur) => ur.roleId);

    // 只添加不存在的角色
    const newRoleIds = roleIds.filter(
      (roleId) => !existingRoleIds.includes(roleId),
    );

    if (newRoleIds.length > 0) {
      const userRoles = newRoleIds.map((roleId) => ({
        userId,
        roleId,
      }));
      await this.userRoleRepository.save(userRoles);
    }
  }

  /**
   * 获取用户角色ID列表
   */
  async getUserRoleIds(userId: number): Promise<number[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
    });
    return userRoles.map((ur) => ur.roleId);
  }

  /**
   * 获取用户角色对象列表
   */
  async getUserRoles(userId: number): Promise<Role[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
    });

    if (userRoles.length === 0) {
      return [];
    }

    const roleIds = userRoles.map((ur) => ur.roleId);
    return this.roleRepository.findByIds(roleIds);
  }

  /**
   * 检查用户是否有指定角色
   */
  async hasRole(userId: number, roleId: number): Promise<boolean> {
    const userRole = await this.userRoleRepository.findOne({
      where: { userId, roleId },
    });
    return !!userRole;
  }

  /**
   * 检查用户是否有指定角色（通过角色名）
   */
  async hasRoleByName(userId: number, roleName: string): Promise<boolean> {
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });

    if (!role) {
      return false;
    }

    return this.hasRole(userId, role.id);
  }
}
