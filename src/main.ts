/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-12 19:39:53
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-09 21:32:51
 * @FilePath: /mvw_project/Users/changcheng/Desktop/testjs-demo/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './common/guards/auth.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { http } from './config/database.config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { Logger } from '@nestjs/common';
interface Module {
  hot: {
    accept: () => void;
    dispose: (callback: () => Promise<void>) => void;
  };
}
declare const module: Module;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 使用全局守卫
  app.useGlobalGuards(new AuthGuard());
  // 使用全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter(Logger));
  // 使用全局拦截器
  app.useGlobalInterceptors(new LoggingInterceptor());
  // 使用Winston日志
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // set global proxy
  app.setGlobalPrefix('api/v1');
  // 设置应用关闭钩子
  app.enableShutdownHooks();
  // 设置swagger
  const config = new DocumentBuilder()
    .setTitle('nestjs Demo')
    .setDescription('nestjs 项目')
    .setVersion('1.0')
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
