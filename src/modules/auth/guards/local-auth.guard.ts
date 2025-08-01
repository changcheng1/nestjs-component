/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-05-16 10:25:58
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-20 18:21:46
 * @FilePath: /myself-space/nestjs/src/auth/local-auth.guard.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// 创建本地认证守卫
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }
}
