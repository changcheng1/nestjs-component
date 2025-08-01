/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-05-15 19:11:54
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 15:30:00
 * @FilePath: /myself-space/nestjs/src/auth/auth.module.ts
 * @Description: 优化的认证模块
 */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import { YamlConfig } from '../../config/database.config';
import { PasswordService } from '../../common/services/password.service';
const env = process.env.NODE_ENV || 'production';
const {
  jwt: { secret },
} = yaml.load(
  readFileSync(join(__dirname, `../env.${env}.yml`), 'utf8'),
) as YamlConfig;
// 获取环境变量

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
  ],
  exports: [AuthService],
})
export class AuthModule {}
