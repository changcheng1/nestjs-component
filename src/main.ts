/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-12 19:39:53
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-19 15:27:56
 * @FilePath: /mvw_project/Users/changcheng/Desktop/testjs-demo/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { http } from './database/typeorm/database.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { createWinstonLogger } from './common/logger/winston.logger';
import {
  Logger,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// winston 细节已抽离，无需在此直接引用
interface Module {
  hot: {
    accept: () => void;
    dispose: (callback: () => Promise<void>) => Promise<void>;
  };
}
declare const module: Module;

async function bootstrap() {
  // 直接在创建阶段替换默认日志，实现系统默认日志的关闭与统一输出到 winston
  const app = await NestFactory.create(AppModule, {
    logger: createWinstonLogger(),
  });

  // 使用全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter(Logger));
  // 使用全局拦截器
  app.useGlobalInterceptors(new LoggingInterceptor());
  // 添加响应拦截器，统一处理API响应格式
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 添加 ClassSerializerInterceptor 以支持 @Exclude() 装饰器
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
  // 默认日志已被替换为 winston
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除请求体中没有的属性,用户传不存在字段不会报错，也不会保存到数据库
      whitelist: true,
    }),
  );
  // 已在创建阶段注入，无需再次调用 app.useLogger
  app.setGlobalPrefix('api/v1');
  // 启用 CORS
  app.enableCors({
    origin: [
      'http://localhost:4001',
      'http://127.0.0.1:4001',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
  });

  // 设置应用关闭钩子
  app.enableShutdownHooks();

  // 设置swagger
  const config = new DocumentBuilder()
    .setTitle('nestjs Demo')
    .setDescription('nestjs 项目')
    .setVersion('1.0')
    .addServer(`http://127.0.0.1:${http.port}`, '开发环境')
    .addServer(`http://127.0.0.1:${http.port}/api/v1`, 'API v1 版本')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // 设置端口
  await app.listen(http.port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap().catch((error) => {
  console.error(error);
});
