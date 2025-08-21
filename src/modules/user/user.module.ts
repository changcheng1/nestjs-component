/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-21 10:28:43
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 11:38:27
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/user/user.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../database/entities/user.entity';
import { ConfigModuleClass } from '../../dynamic/dynamic.module';
import { CommonService } from '../../common/services/common.service';
import { ConfigService } from '@nestjs/config';
import { InstitutionModule } from '../institution/institution.module';
import { DiscoveryModule } from '@nestjs/core';
import { PasswordService } from '../../common/services/password.service';
import { UserRole } from '../../database/entities/user-role.entity';
import { UserRoleUpdateService } from './services/user-role-update.service';
import { UserRoleService } from './services/user-role.service';
import { Role } from '../../database/entities/role.entity';
import { TenantContextService } from '../../common/services/tenant-context.service';
import { createTenantRepositoryProvider } from '../../common/providers/tenant-repository.provider';
@Module({
  imports: [
    // 注册多租户实体到两个数据库连接
    TypeOrmModule.forFeature([User, UserRole, Role], 'tenant1'),
    TypeOrmModule.forFeature([User, UserRole, Role], 'tenant2'),
    // 动态模块
    ConfigModuleClass.register({ foler: 'development' }),
    // 循环依赖
    InstitutionModule,
    // 发现模块
    DiscoveryModule,
  ],
  providers: [
    UserService,
    PasswordService,
    UserRoleUpdateService,
    UserRoleService,
    TenantContextService,
    // 多租户Repository提供者
    createTenantRepositoryProvider(User),
    createTenantRepositoryProvider(UserRole),
    createTenantRepositoryProvider(Role),
    {
      provide: CommonService,
      // 使用工厂函数创建实例
      useFactory: () => {
        return new CommonService('AppService');
      },
      inject: [ConfigService],
      // durable 属性用于控制提供者的生命周期
      // 当设置为 true 时，提供者实例会在整个应用程序生命周期内保持单例
      // 当设置为 false 时，提供者实例会在每次请求时重新创建
      // 默认值为 false
      durable: true,
    },
  ],
  controllers: [UserController],
  exports: [UserService, UserRoleService],
})
export class UserModule {}
