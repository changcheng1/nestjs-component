/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:11:55
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-10 11:31:27
 * @FilePath: /mvw_project/Users/changcheng/Desktop/back/src/common/dynamic/app.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE∏
 */
import { Module, Logger, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entites/user.entity';
import { UsersModule } from './user/user.module';
import { InstutionModule } from './instution/instution.module';
import { db } from './config/database.config';
import { Logs } from './entites/logs.entity';
import { Profile } from './entites/profile.entity';
import { Roles } from './entites/roles.entity';
import { LogsModule } from './logs/logs.module';
// 全局模块，exports logger，其他模块中可以注入，不用重复创建
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
      entities: [User, Logs, Profile, Roles], // 注册实体
      synchronize: db.mysql.synchronize, // 自动同步数据库，根据环境变量设置
      autoLoadEntities: true, // 自动加载实体
      // logging: true, // 打印日志
    }),
    UsersModule,
    InstutionModule,
    LogsModule, // 注册用户模块
  ],
  // providers 用于声明模块的提供者，这些提供者可以被注入到其他组件中
  // 这里提供 Logger 服务，使其可以在整个应用中通过依赖注入使用
  providers: [Logger],
  // exports 用于声明模块的导出，这些导出可以被其他模块导入
  exports: [Logger],
})
// 使用中间件
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes(UserController);
//   }
// }
export class AppModule {}
