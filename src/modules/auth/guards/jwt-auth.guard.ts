/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-05-16 10:53:52
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-04 18:27:27
 * @FilePath: /myself-space/nestjs/src/auth/jwt-auth.guard.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// JwtAuthGuard 继承自 AuthGuard('jwt')，它会调用名为 'jwt' 的 Passport 策略：
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
