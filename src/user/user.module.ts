/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-21 10:28:43
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-07 17:30:16
 * @FilePath: /mvw_project/Users/changcheng/Desktop/testjs-demo/src/user/user.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../entites/user.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModuleClass } from '../dynamic/dynamic.module';
import { CommonService } from '../common/services/common.service';
import { ConfigService } from '@nestjs/config';
import { InstutionModule } from '../instution/instution.module';
import { DiscoveryModule } from '@nestjs/core';
import { Logs } from '../entites/logs.entity';
@Module({
  imports: [
    // 注册User实体，Logs实体
    TypeOrmModule.forFeature([User, Logs]),
    // 动态模块
    ConfigModuleClass.register({ foler: 'development' }),
    // 循环依赖
    InstutionModule,
    // 发现模块
    DiscoveryModule,
  ], // 注册User实体
  providers: [
    UsersService,
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
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ], // 注册UsersService
  controllers: [UserController], // 注册UserController
})
export class UsersModule {}
