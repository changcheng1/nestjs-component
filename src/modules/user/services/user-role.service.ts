/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-06 11:55:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 16:31:18
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
   * 根据用户ID查找角色 - 优化版本
   * @param userId 用户ID
   * @returns 角色列表
   */
  async findRoleByUserId(userId: number): Promise<Role[]> {
    // 使用原生 SQL 查询优化性能
    const roles = await this.rolesRepository
      .createQueryBuilder('role') // 1. 从 roles 表开始
      .innerJoin('user_roles', 'ur', 'ur.role_id = role.id') // 2. 连接 user_roles 表
      .where('ur.user_id = :userId', { userId }) // 3. 过滤用户ID
      .getMany(); // 4. 获取结果

    return roles;
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
   * 检查用户是否有指定角色 - 优化版本
   * @param userId 用户ID
   * @param roleName 角色名称
   * @returns 是否有该角色
   */
  async hasRole(userId: number, roleName: string): Promise<boolean> {
    // 使用原生 SQL 查询优化性能
    const count = await this.rolesRepository
      .createQueryBuilder('role')
      .innerJoin('user_roles', 'ur', 'ur.role_id = role.id')
      .where('ur.user_id = :userId', { userId })
      .andWhere('role.name = :roleName', { roleName })
      .getCount();

    return count > 0;
  }
}
