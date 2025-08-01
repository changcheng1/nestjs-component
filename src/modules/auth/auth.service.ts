/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-05-15 19:12:09
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-12 13:40:46
 * @FilePath: /myself-space/nestjs/src/auth/auth.service.ts
 * @Description: 优化的认证服务
 */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../../common/services/password.service';
import { plainToClass } from 'class-transformer';
import { SignUpResponseDto } from './dto/signup.dto';

// 定义登录响应类型
interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  /**
   * 验证用户
   * @param username 用户名
   * @param pass 密码
   * @returns 返回用户信息（不包含密码）
   */
  async validateUser(
    username: string,
    pass: string,
  ): Promise<{
    id: number;
    username: string;
  } | null> {
    try {
      console.log('validateUser 开始验证:', {
        username,
        passLength: pass?.length,
      });

      const user = await this.usersService.findOne(username);
      if (user) {
        // 验证密码
        const isPasswordValid = await this.passwordService.verifyPassword(
          pass,
          user.password,
        );
        if (isPasswordValid) {
          // 直接返回用户对象，让 @Exclude() 装饰器处理密码排除
          return user;
        }
      } else {
        console.log('用户不存在:', username);
      }
      return null;
    } catch (error) {
      console.error('验证用户时出错:', error);
      return null;
    }
  }

  /**
   * 登录并生成JWT
   * @param username 用户名
   * @param password 密码
   * @returns 返回token和用户信息
   */
  async signIn(username: string, password: string): Promise<LoginResponse> {
    try {
      // 使用 validateUser 方法验证用户和密码
      const validatedUser = await this.validateUser(username, password);

      if (!validatedUser) {
        throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED);
      }

      // 生成JWT payload（不包含敏感信息）
      const payload = {
        sub: validatedUser.id, // 用户ID
        username: validatedUser.username, // 用户名
      };

      // 生成JWT token
      const access_token = await this.jwtService.signAsync(payload);
      return {
        access_token,
        user: {
          id: validatedUser.id,
          username: validatedUser.username,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('登录失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 注册新用户
   * @param username 用户名
   * @param password 密码
   * @returns 返回注册的用户信息
   */
  async signUp(username: string, password: string): Promise<SignUpResponseDto> {
    try {
      // 查找用户是否存在
      const findUser = await this.usersService.findOne(username);
      if (findUser) {
        throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
      }
      // 创建新用户
      const user = await this.usersService.addUser({
        username,
        password,
      });

      // 使用 plainToClass 确保密码字段被排除
      const responseDto = plainToClass(SignUpResponseDto, user, {
        excludeExtraneousValues: true,
      });

      return responseDto;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('注册失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 生成JWT token
   * @param userId 用户ID
   * @param username 用户名
   * @returns 返回token
   */
  async generateToken(
    userId: number,
    username: string,
  ): Promise<{ access_token: string }> {
    try {
      // 生成JWT payload（不包含敏感信息）
      const payload = {
        sub: userId, // 用户ID
        username: username, // 用户名
      };

      // 生成JWT token
      const access_token = await this.jwtService.signAsync(payload);

      return { access_token };
    } catch {
      throw new HttpException(
        '生成token失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 刷新JWT token
   * @param username 用户名
   * @returns 返回新的token
   */
  async refreshToken(username: string): Promise<{ access_token: string }> {
    try {
      const user = await this.usersService.findOne(username);
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.UNAUTHORIZED);
      }

      const payload = {
        sub: user.id,
        username: user.username,
      };

      const access_token = await this.jwtService.signAsync(payload);
      return { access_token };
    } catch {
      throw new HttpException('刷新token失败', HttpStatus.UNAUTHORIZED);
    }
  }
}
