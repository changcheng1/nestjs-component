/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-22 15:20:51
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-04-24 16:00:49
 * @FilePath: /mvw_project/Users/changcheng/Desktop/testjs-demo/src/common/guards/auth.guard.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request): boolean {
    // const authHeader = request.headers['authorization'] as string;
    // if (!authHeader) {
    //   return false;
    // }
    // // 通常token格式为 "Bearer <token>"
    // const [type, token] = authHeader.split(' ');
    // if (type !== 'Bearer' || !token) {
    //   return false;
    // }
    return true;
  }
}
