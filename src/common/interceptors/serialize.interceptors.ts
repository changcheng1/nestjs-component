/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-06 11:07:01
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-31 14:45:09
 * @FilePath: /myself-space/nestjs/src/common/interceptors/serialize.interceptors.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 序列化拦截器
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // 只保留dto中定义的属性，过滤掉其他属性
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
