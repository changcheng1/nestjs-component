/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-06 11:50:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-12 13:40:33
 * @FilePath: /myself-space/nestjs/src/user/services/user-profile.service.ts
 * @Description: 用户资料服务
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../../database/entities/profile.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  /**
   * 根据用户ID查找资料
   * @param userId 用户ID
   * @returns 用户资料
   */
  async findByUserId(userId: number): Promise<Profile | null> {
    return this.profileRepository.findOne({
      where: { userId },
    });
  }

  /**
   * 创建用户资料
   * @param profile 资料信息
   * @returns 创建的资料
   */
  async create(profile: Partial<Profile>): Promise<Profile> {
    return this.profileRepository.save(profile);
  }

  /**
   * 更新用户资料
   * @param userId 用户ID
   * @param profile 资料信息
   * @returns 更新后的资料
   */
  async update(userId: number, profile: Partial<Profile>): Promise<Profile> {
    const existingProfile = await this.findByUserId(userId);
    if (!existingProfile) {
      throw new Error('用户资料不存在');
    }

    const updatedProfile = this.profileRepository.merge(
      existingProfile,
      profile,
    );
    return this.profileRepository.save(updatedProfile);
  }

  /**
   * 删除用户资料
   * @param userId 用户ID
   */
  async delete(userId: number): Promise<void> {
    const profile = await this.findByUserId(userId);
    if (profile) {
      await this.profileRepository.softRemove(profile);
    }
  }
}
