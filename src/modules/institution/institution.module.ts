/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-24 10:40:45
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-04-24 11:30:03
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/instution/instution.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionController } from './institution.controller';
import { InstitutionService } from './institution.service';
import { Institution } from '../../database/entities/institution.entity';
import { TenantContextService } from '../../common/services/tenant-context.service';
import { createTenantRepositoryProvider } from '../../common/providers/tenant-repository.provider';

@Module({
  imports: [
    // 注册多租户实体到两个数据库连接
    TypeOrmModule.forFeature([Institution], 'tenant1'),
    TypeOrmModule.forFeature([Institution], 'tenant2'),
  ],
  controllers: [InstitutionController],
  providers: [
    InstitutionService,
    TenantContextService,
    // 多租户Repository提供者
    createTenantRepositoryProvider(Institution),
  ],
  exports: [InstitutionService],
})
export class InstitutionModule {}
