/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:30:06
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-12 15:15:43
 * @FilePath: /myself-space/nestjs/src/shared/services/user-profile.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../../database/entities/user-profile.entity';
import { Profile } from '../../database/entities/profile.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async getUserProfile(userId: number) {
    const userProfile = await this.userProfileRepository.findOne({
      where: { userId },
    });

    if (!userProfile) {
      return null;
    }

    return this.profileRepository.findOne({
      where: { id: userProfile.profileId },
    });
  }

  async createUserProfile(userId: number, profileId: number) {
    const userProfile = this.userProfileRepository.create({
      userId,
      profileId,
    });
    return this.userProfileRepository.save(userProfile);
  }

  async updateUserProfile(userId: number, profileId: number) {
    const existing = await this.userProfileRepository.findOne({
      where: { userId },
    });

    if (existing) {
      return this.userProfileRepository.update(existing.id, { profileId });
    } else {
      return this.createUserProfile(userId, profileId);
    }
  }
}
