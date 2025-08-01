/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:41:41
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-31 20:09:48
 * @FilePath: /myself-space/nestjs/src/app.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:11:55
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-13 13:28:44
 * @FilePath: /myself-space/nestjs/src/app.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:11:55
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-11 17:49:33
 * @FilePath: /mvw_project/Users/changcheng/Desktop/back/src/common/dynamic/app.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE∏
 */
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { db } from './config/database.config';
import {
  User,
  Logs,
  Profile,
  Role,
  UserRole,
  UserProfile,
  Institution,
  Menu,
} from './database';
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

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: db.mysql.type, // 数据库类型
      host: db.mysql.host, // 数据库地址
      port: db.mysql.port, // 数据库端口
      username: db.mysql.username, // 数据库用户名
      password: db.mysql.password, // 数据库密码
      database: db.mysql.database, // 数据库名称
      entities: [
        User,
        Logs,
        Profile,
        Role,
        UserRole,
        UserProfile,
        Institution,
        Menu,
      ], // 注册实体
      synchronize: db.mysql.synchronize, // 自动同步数据库，根据环境变量设置
      autoLoadEntities: true, // 自动加载实体
      // logging: true, // 打印日志
    }),
    UserModule,
    InstitutionModule,
    LogsModule,
    AuthModule,
    ProfileModule,
    RoleModule,
    MenusModule,
  ],
})
// 使用函数中间件
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UserController);
  }
}
