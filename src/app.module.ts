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
  ContractModule,
} from './modules';
import { DownloadModule } from './modules/download/download.module';
import { LoggerMiddleware } from './common/middleware/loggerClass.middleware';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { TenantContextService } from './common/services/tenant-context.service';
import { UserController } from './modules/user/user.controller';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';

@Global()
@Module({
  imports: [
    // 使用多租户数据库配置 - Tenant1 + Tenant2 + MongoDB
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
    ContractModule,
    DownloadModule,
  ],
  controllers: [AppController],
  providers: [TenantContextService],
  exports: [TenantContextService],
})
// 使用函数中间件
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 应用日志中间件
    consumer.apply(LoggerMiddleware).forRoutes(UserController);

    // 应用租户中间件到所有路由
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
