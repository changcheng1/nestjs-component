/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:41:41
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-12 15:15:35
 * @FilePath: /myself-space/nestjs/src/shared/services/user-role.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../database/entities/user-role.entity';
import { Role } from '../../database/entities/role.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getUserRole(userId: number) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
    });

    if (userRoles.length === 0) {
      return [];
    }

    const roleIds = userRoles.map((ur) => ur.roleId);
    return this.roleRepository.findByIds(roleIds);
  }

  async assignRoleToUser(userId: number, roleId: number) {
    const existing = await this.userRoleRepository.findOne({
      where: { userId, roleId },
    });

    if (!existing) {
      const userRole = this.userRoleRepository.create({
        userId,
        roleId,
      });
      return this.userRoleRepository.save(userRole);
    }
    return existing;
  }

  async removeRoleFromUser(userId: number, roleId: number) {
    return this.userRoleRepository.delete({ userId, roleId });
  }
}
