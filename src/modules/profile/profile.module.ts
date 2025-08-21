/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:27:58
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-12 13:28:08
 * @FilePath: /myself-space/nestjs/src/modules/profile/profile.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile } from '../../database/entities/profile.entity';
import { TenantContextService } from '../../common/services/tenant-context.service';
import { createTenantRepositoryProvider } from '../../common/providers/tenant-repository.provider';

@Module({
  imports: [
    // 注册多租户实体到两个数据库连接
    TypeOrmModule.forFeature([Profile], 'tenant1'),
    TypeOrmModule.forFeature([Profile], 'tenant2'),
  ],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    TenantContextService,
    // 多租户Repository提供者
    createTenantRepositoryProvider(Profile),
  ],
  exports: [ProfileService],
})
export class ProfileModule {}
