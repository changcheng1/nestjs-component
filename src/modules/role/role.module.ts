/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:28:29
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-12 13:37:43
 * @FilePath: /myself-space/nestjs/src/modules/role/role.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from '../../database/entities/role.entity';
import { TenantContextService } from '../../common/services/tenant-context.service';
import { createTenantRepositoryProvider } from '../../common/providers/tenant-repository.provider';

@Module({
  imports: [
    // 注册多租户实体到两个数据库连接
    TypeOrmModule.forFeature([Role], 'tenant1'),
    TypeOrmModule.forFeature([Role], 'tenant2'),
  ],
  controllers: [RoleController],
  providers: [
    RoleService,
    TenantContextService,
    // 多租户Repository提供者
    createTenantRepositoryProvider(Role),
  ],
  exports: [RoleService],
})
export class RoleModule {}
