/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-04 18:30:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-12 13:41:25
 * @FilePath: /myself-space/nestjs/src/auth/local.strategy.ts
 * @Description: Local认证策略
 */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PasswordService } from '../../../common/services/password.service';

// 定义用户类型
interface User {
  id: number;
  username: string;
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private authService: AuthService,
    private passwordService: PasswordService,
  ) {
    super();
  }
  async validate(username: string, password: string): Promise<User> {
    // 调用 AuthService 验证用户名密码
    const user = (await this.authService.validateUser(
      username,
      password,
    )) as User;
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    //  返回用户信息（不包含密码）
    return user;
  }
}
