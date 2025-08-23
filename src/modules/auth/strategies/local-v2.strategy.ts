/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-21 17:35:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-21 17:44:57
 * @FilePath: /myself-space/nestjs/src/auth/local-v2.strategy.ts
 * @Description: 重写的 Local 认证策略 - 兼容性版本
 */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

// 定义用户类型
interface User {
  id: number;
  username: string;
}

@Injectable()
export class LocalV2Strategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: false,
    });
  }

  async validate(username: string, password: string): Promise<User> {
    console.log(`🔐 LocalV2Strategy.validate 开始验证: username=${username}`);

    try {
      // 调用 AuthService 验证用户名密码
      const user = await this.authService.validateUser(username, password);

      console.log(
        '🔍 验证结果:',
        user ? `用户 ${user.username} 验证成功` : '验证失败',
      );

      if (!user) {
        console.log('❌ 用户名或密码错误');
        throw new UnauthorizedException('用户名或密码错误');
      }

      console.log('✅ LocalV2Strategy 验证成功');
      // 返回用户信息（不包含密码）
      return {
        id: user.id,
        username: user.username,
      };
    } catch (error) {
      console.error('💥 LocalV2Strategy 验证出错:', error.message);
      throw new UnauthorizedException('用户名或密码错误');
    }
  }
}
