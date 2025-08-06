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
import { AppController } from './app.controller';

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
  controllers: [AppController],
})
// 使用函数中间件
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UserController);
  }
}
