/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-12 19:39:53
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-07 17:04:04
 * @FilePath: /mvw_project/Users/changcheng/Desktop/testjs-demo/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthGuard } from './common/guards/auth.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { http } from './config/database.config';
import { createLogger } from 'winston';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
interface Module {
  hot: {
    accept: () => void;
    dispose: (callback: () => Promise<void>) => void;
  };
}
declare const module: Module;
async function bootstrap() {
  // 创建winston实例
  const instance = createLogger({
    // options of Winston
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike('NestApplication', {
            // 是否使用颜色
            colors: true,
            // 是否使用prettyPrint
            prettyPrint: true,
            // 是否使用processId
            processId: true,
            // 是否使用appName
            appName: true,
          }),
        ),
      }),
    ],
  });
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });
  // 使用全局守卫
  app.useGlobalGuards(new AuthGuard());
  // 使用中间件
  // app.use(logger);
  // 使用全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 使用全局拦截器
  app.useGlobalInterceptors(new LoggingInterceptor());
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
