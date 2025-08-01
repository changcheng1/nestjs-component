/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-05-15 19:12:09
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 15:28:43
 * @FilePath: /myself-space/nestjs/src/auth/jwt.strategy.ts
 * @Description: JWT策略
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { YamlConfig } from '../../config/database.config';

// 获取环境变量
const env = process.env.NODE_ENV || 'production';
const {
  jwt: { secret },
} = yaml.load(
  readFileSync(join(__dirname, `../env.${env}.yml`), 'utf8'),
) as YamlConfig;
// JWT payload 类型
interface JwtPayload {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

// 用户信息类型
interface UserInfo {
  id: number;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UserService) {
    super({
      // 从 Authorization 头提取 token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 不忽略过期时间
      ignoreExpiration: false,
      // JWT 密钥
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserInfo> {
    try {
      // 从数据库获取用户信息
      const user = await this.usersService.findOne(payload.username);

      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      // 返回用户信息（不包含敏感信息如密码）
      return {
        id: user.id,
        username: user.username,
      };
    } catch {
      throw new UnauthorizedException('Token验证失败');
    }
  }
}
