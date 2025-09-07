/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-21 10:28:43
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-09-07 12:21:41
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/user/user.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { UserRole } from '../../database/entities/user-role.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRoleService } from './services/user-role.service';
import { UserRoleUpdateService } from './services/user-role-update.service';
import { createTenantRepositoryProvider } from '../../common/providers/tenant-repository.provider';
import { ConfigModuleClass } from '../../dynamic/dynamic.module';
import { PasswordService } from '../../common/services/password.service';
import { Role } from '../../database/entities/role.entity';
@Module({
  imports: [
    // 注册多租户实体到两个数据库连接
    TypeOrmModule.forFeature([User, UserRole, Role], 'tenant1'),
    TypeOrmModule.forFeature([User, UserRole, Role], 'tenant2'),
    ConfigModuleClass.register({ foler: 'development' }),
  ],
  providers: [
    UserService,
    PasswordService,
    UserRoleUpdateService,
    UserRoleService,
    createTenantRepositoryProvider(User), // 动态注入UserRepository
    createTenantRepositoryProvider(UserRole), // 动态注入UserRoleRepository
    createTenantRepositoryProvider(Role), // 动态注入RoleRepository
  ],
  controllers: [UserController],
  exports: [UserService, UserRoleService],
})
export class UserModule {}
