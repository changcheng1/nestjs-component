/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-05-15 19:11:54
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-13 15:42:54
 * @FilePath: /myself-space/nestjs/src/auth/auth.module.ts
 * @Description: 优化的认证模块
 */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import { YamlConfig } from '../../config/database.config';
import { PasswordService } from '../../common/services/password.service';
import { RedisService } from '../../common/services/redis.service';

const env = process.env.NODE_ENV || 'production';
const {
  jwt: { secret },
} = yaml.load(
  readFileSync(join(process.cwd(), `env.${env}.yml`), 'utf8'),
) as YamlConfig;

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => {
        return {
          secret,
          signOptions: {
            expiresIn: '24h', // Token 24小时过期
            issuer: 'nestjs-app', // 签发者
            audience: 'nestjs-users', // 受众
          },
          verifyOptions: {
            issuer: 'nestjs-app',
            audience: 'nestjs-users',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtAuthGuard,
    LocalAuthGuard,
    JwtStrategy,
    LocalStrategy,
    AuthService,
    PasswordService,
    RedisService, // 使用 RedisService 替代 Redis 类
  ],
  exports: [AuthService],
})
export class AuthModule {}
