/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-05 16:42:43
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-19 16:21:18
 * @FilePath: /myself-space/nestjs/src/app.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigBuilder } from './database/typeorm/database-factory';
import {
  AuthModule,
  UserModule,
  ProfileModule,
  RoleModule,
  LogsModule,
  InstitutionModule,
  MenusModule,
} from './modules';
import { LoggerMiddleware } from './common/middleware/loggerClass.middleware';
import { UserController } from './modules/user/user.controller';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';

@Global()
@Module({
  imports: [
    // 使用简化的多数据库配置 - MySQL(默认) + MongoDB
    ...DatabaseConfigBuilder.create().map((config) =>
      TypeOrmModule.forRootAsync(config),
    ),
    UserModule,
    InstitutionModule,
    LogsModule,
    AuthModule,
    ProfileModule,
    RoleModule,
    MenusModule,
  ],
  controllers: [AppController],
})
// 使用函数中间件
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UserController);
  }
}
