/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-05-15 19:12:09
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-09-06 14:13:26
 * @FilePath: /myself-space/nestjs/src/auth/jwt.strategy.ts
 * @Description: JWT策略
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { YamlConfig } from '../../../database/typeorm/database.config';
// 获取环境变量
const env = process.env.NODE_ENV || 'production';

const {
  jwt: { secret },
} = yaml.load(
  readFileSync(join(process.cwd(), `env.${env}.yml`), 'utf8'),
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
  constructor() {
    // JwtStrategy 配置
    super({
      // 从 Authorization 头提取 token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 不忽略过期时间，过期token会被拒绝
      ignoreExpiration: false,
      // 使用配置文件中的密钥验证签名
      secretOrKey: secret,
    });
    console.log('✅ JwtStrategy 初始化完成');
  }

  async validate(payload: JwtPayload): Promise<UserInfo> {
    try {
      // 简化验证逻辑：只验证token本身，不查询数据库
      // 因为JWT本身已经包含了用户信息，且签名已经验证过了
      if (!payload.username || !payload.sub) {
        console.log('❌ Token payload 无效');
        throw new UnauthorizedException('Token无效');
      }
      console.log('✅ JWT验证成功:', payload.username);
      return {
        id: payload.sub,
        username: payload.username,
      };
    } catch (error) {
      console.log('❌ JWT验证失败:', (error as Error).message);
      throw new UnauthorizedException('Token验证失败');
    }
  }
}
