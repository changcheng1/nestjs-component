/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-05-15 19:12:04
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-13 15:43:42
 * @FilePath: /myself-space/nestjs/src/auth/auth.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignUpDto } from './dto/signup.dto';
import { SerializeInterceptor } from '../../common/interceptors/serialize.interceptors';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { RedisService } from '../../common/services/redis.service';

// 定义请求类型
interface RequestWithUser {
  user: {
    id: number;
    username: string;
    roles?: any[];
  };
}

@ApiTags('认证管理')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private redisService: RedisService, // 使用 RedisService 替代 Redis 类
  ) {}

  /**
   * 使用Local认证登录
   * @param req 请求对象
   * @returns 返回token
   */
  @ApiOperation({ summary: '用户登录', description: '使用用户名密码登录' })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @Post('/signIn')
  @UseGuards(LocalAuthGuard)
  async signIn(@Request() req: RequestWithUser): Promise<any> {
    // LocalAuthGuard 验证成功后，用户信息会被附加到 req.user
    // LocalStrategy.validate 已经验证了用户名密码，返回的用户信息不包含密码
    const { id, username } = req.user;
    // 直接生成 JWT token，不需要再次验证密码
    const result = await this.authService.generateToken(id, username);
    await this.redisService.set('token', result.access_token);
    return {
      access_token: result.access_token,
    };
  }

  /**
   * 注册
   * @param signUpDto
   * @returns
   */
  @ApiOperation({ summary: '用户注册', description: '创建新用户账户' })
  @Post('/signUp')
  // 返回拦截器进行拦截，返回UserResponseDto
  @UseInterceptors(new SerializeInterceptor(UserResponseDto))
  signUp(@Body() signUpDto: SignUpDto) {
    const { username, password } = signUpDto;
    if (!username || !password) {
      throw new HttpException('用户名和密码不能为空', HttpStatus.BAD_REQUEST);
    }
    return this.authService.signUp(username, password);
  }
}
