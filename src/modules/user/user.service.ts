/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:18:14
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-21 11:29:04
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/user/user.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { CommonService } from '../../common/services/common.service';
import { ModuleRef } from '@nestjs/core';
import { Body, OnModuleInit, Request } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { GetUserDto } from './dto/user';
import { PasswordService } from '../../common/services/password.service';
import { UserRole } from '../../database/entities/user-role.entity';
import { UserRoleUpdateService } from './services/user-role-update.service';
import { Role } from '../../database/entities/role.entity';
export interface defaultUser {
  username: string;
  password: string;
}

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @Inject('UserRepository')
    private readonly usersRepository: Repository<User>,
    @Inject('UserRoleRepository')
    private readonly userRolesRepository: Repository<UserRole>,
    @Inject('RoleRepository')
    private readonly roleRepository: Repository<Role>,
    private CommonService: CommonService,
    private moduleRef: ModuleRef,
    private discoveryService: DiscoveryService,
    private passwordService: PasswordService,
    private userRoleUpdateService: UserRoleUpdateService,
  ) {}

  // 在模块初始化时，调用
  onModuleInit() {
    this.CommonService.logParentName('传入的值');
  }

  // 在应用关闭时，调用
  onApplicationShutdown(signal: string) {
    console.log(signal); // e.g. "SIGINT"
  }

  /**
   * 添加用户
   * @param user 用户（包含从拦截器注入的 tenantId）
   * @returns 添加后的用户
   */
  async addUser(user: Partial<GetUserDto>): Promise<User> {
    const { password, roles, tenantId } = user;

    // 验证密码是否存在
    if (!password) {
      throw new Error('密码不能为空');
    }

    // 验证租户ID是否存在（由拦截器注入）
    if (!tenantId) {
      throw new Error('租户ID不能为空');
    }

    console.log(`🏢 创建用户 - 租户ID: ${tenantId}`);

    // 加密密码
    user.password = await this.passwordService.hashPassword(password);

    // 创建用户数据（tenantId 由拦截器提供）
    const userData = {
      ...user,
      tenantId, // 使用拦截器注入的 tenantId
    } as User;

    console.log(`💾 保存用户到租户${tenantId}数据库:`, {
      ...userData,
      password: '[HIDDEN]',
    });

    // 保存用户
    const savedUser = await this.usersRepository.save(userData);

    console.log(
      `✅ 用户已保存到租户${tenantId}数据库, 用户ID: ${savedUser.id}`,
    );

    // 如果有角色数据，更新中间表
    if (roles && Array.isArray(roles) && roles.length > 0) {
      await this.userRoleUpdateService.updateUserRoles(
        savedUser.id,
        roles,
        'replace',
      );
    }

    return savedUser;
  }

  /**
   * 删除用户
   * @param id 用户id
   * @param tenantId 租户ID（从拦截器注入）
   */
  async removeUser(id: number, tenantId?: string): Promise<void> {
    console.log(`🗑️ 删除用户 ID: ${id}, 租户: ${tenantId}`);

    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    // 使用softRemove进行软删除，这样数据不会真正从数据库中删除
    // 而是将deletedAt字段设置为当前时间
    await this.usersRepository.softRemove(user);

    console.log(`✅ 用户 ID: ${id} 已从租户${tenantId}数据库软删除`);
  }

  /**
   * 更新用户
   * @param id 用户id
   * @param updateData 更新数据
   * @returns 更新后的用户
   */
  async updateUser(id: number, updateData: Partial<User>) {
    const userToUpdate = await this.usersRepository.findOne({
      where: { id },
    });

    if (!userToUpdate) {
      throw new Error(`User with id ${id} not found`);
    }
    // 如果传入有密码，则加密保存
    if (updateData.password) {
      updateData.password = await this.passwordService.hashPassword(
        updateData.password,
      );
    }
    // 合并用户数据
    const newUser = this.usersRepository.merge(userToUpdate, updateData);
    return await this.usersRepository.save(newUser);
  }

  /**
   * 查找用户
   * @param id 用户id
   * @returns 用户
   */
  async findUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  /**
   * 查找用户
   * @param username 用户名
   * @returns 用户或null
   */
  async findOne(username: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    return user;
  }

  /**
   * 登录
   * @param username 用户名
   * @param password 密码
   * @returns 用户信息（不包含密码）
   */
  async Login(
    username: string,
    password: string,
  ): Promise<Partial<User> & { message: string }> {
    // 先根据用户名查找用户
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new Error(`用户 ${username} 不存在`);
    }

    // 验证密码
    const isPasswordValid = await this.passwordService.verifyPassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error('密码错误');
    }

    // 直接返回用户实体，@Exclude() 装饰器会自动排除密码字段
    return {
      ...user,
      message: '登录成功',
    };
  }
  /**
   * 获取用户角色
   * @param id 用户ID
   * @returns 用户角色
   */
  async getRole(id: number) {
    const userRole = await this.userRolesRepository.findOne({
      where: { userId: id },
    });
    // 通过roleId获取角色
    const role = await this.roleRepository.findOne({
      where: { id: userRole?.roleId },
    });
    return role;
  }
}
