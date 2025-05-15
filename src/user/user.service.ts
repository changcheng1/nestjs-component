/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:18:14
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-15 16:16:46
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/user/user.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entites/user.entity';
import { CommonService } from '../common/services/common.service';
import { ModuleRef } from '@nestjs/core';
import { OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { Logs } from '../entites/logs.entity';
import { Profile } from '../entites/profile.entity';
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private CommonService: CommonService,
    private moduleRef: ModuleRef,
    private discoveryService: DiscoveryService,
  ) {}
  // 在模块初始化时，调用
  onModuleInit() {
    // 获取所有提供者
    // const providers = this.discoveryService.getProviders();
    // // 遍历providers
    // providers.forEach((provider) => {
    //   console.log('provider 获取所有提供者', provider.name);
    // });
    // // 获取所有控制器
    // const controllers: any = this.discoveryService.getControllers();
    // console.log('controllers 获取所有控制器', controllers);
    this.CommonService.logParentName('传入的值');
  }
  // 在应用关闭时，调用
  onApplicationShutdown(signal: string) {
    console.log(signal); // e.g. "SIGINT"
  }
  /**
   * 添加用户
   * @param user 用户
   * @returns 添加后的用户
   */
  async addUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
  /**
   * 删除用户
   * @param id 用户id
   */
  async removeUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile', 'logs'],
    });

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    // 使用softRemove进行软删除，这样数据不会真正从数据库中删除
    // 而是将deletedAt字段设置为当前时间
    await this.usersRepository.softRemove(user);
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
      relations: ['profile', 'roles'],
    });

    if (!userToUpdate) {
      throw new Error(`User with id ${id} not found`);
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
      where: {
        id,
      },
      relations: ['profile', 'logs', 'roles'],
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }
}
