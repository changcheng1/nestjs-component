/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-22 17:38:53
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-06 10:11:19
 * @FilePath: /mvw_project/Users/changcheng/Desktop/testjs-demo/src/common/interceptors/logging.interceptor.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    console.log('拦截器执行之前');
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `拦截器执行之后模块:${context.getClass().name} 方法:${context.getHandler().name} 耗时:${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
