/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:17:59
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 15:16:26
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/user/user.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Controller,
  Get,
  Body,
  Post,
  Patch,
  Param,
  UseFilters,
  Delete,
  Headers,
  UseGuards,
  ParseIntPipe,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { TypeOrmExceptionFilter } from '../../common/filters/typeOrm.filter';
import { UserPipes } from './pipes/pipes.pipe';
import { GetUserDto } from './dto/user';
import { LoginDto } from './dto/login.dto';
import { User } from '../../database/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SerializeInterceptor } from '../../common/interceptors/serialize.interceptors';
import { UserResponseDto } from './dto/user-response.dto';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';

// 定义请求类型
interface RequestWithUser extends Request {
  user: {
    id: number;
    username: string;
    roles: any[];
  };
}

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TenantInterceptor) // 应用租户拦截器
@UseFilters(new TypeOrmExceptionFilter()) // Changed to use class reference instead of instance
export class UserController {
  constructor(private readonly userService: UserService) {}
  /**
   * 添加用户
   * @param user
   * @returns
   */
  @ApiOperation({ summary: '添加用户', description: '创建新用户' })
  @ApiBody({ type: GetUserDto, description: '用户信息' })
  @Post('addUser')
  @UseInterceptors(new SerializeInterceptor(UserResponseDto))
  addUser(@Body(UserPipes) user: GetUserDto): Promise<User> {
    console.log('user', user);
    return this.userService.addUser(user);
  }
  /**
   * 删除用户
   * @param id
   * @returns
   */
  @ApiOperation({ summary: '删除用户', description: '根据ID删除用户' })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
  @Delete('removeUser/:id')
  async removeUser(@Param('id') id: number) {
    return await this.userService.removeUser(id);
  }
  /**
   * 更新用户
   * @param Authorization
   * @param id
   * @param user
   * @returns
   */
  @ApiOperation({ summary: '更新用户', description: '根据ID更新用户信息' })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
  @ApiBody({ type: User, description: '用户信息' })
  @Patch('updateUser/:id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User) {
    return this.userService.updateUser(id, user);
  }
  /**
   * 用户登录
   * @param loginData 登录数据
   * @returns 用户信息
   */
  @ApiOperation({ summary: '用户登录', description: '用户登录验证' })
  @ApiBody({ type: LoginDto, description: '登录信息' })
  @Post('login')
  async login(
    @Body() loginData: LoginDto,
  ): Promise<Partial<User> & { message: string }> {
    try {
      const { username, password } = loginData;
      const result = await this.userService.Login(username, password);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      throw new Error(errorMessage);
    }
  }

  /**
   * 查找用户
   * @param id
   * @returns
   */
  @ApiOperation({ summary: '查找用户', description: '根据ID查找用户信息' })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
  @Get('findUser/:id')
  @UseGuards(JwtAuthGuard)
  // 使用序列化拦截器
  @UseInterceptors(new SerializeInterceptor(UserResponseDto))
  findUser(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    // 用户信息已经通过JwtAuthGuard验证并附加到req.user
    console.log('user info', req.user);
    return this.userService.findUser(id);
  }
  /**
   * 获取角色权限
   * @param id
   * @returns
   */
  @ApiOperation({ summary: '获取角色权限', description: '根据ID获取角色权限' })
  @ApiParam({ name: 'id', description: '用户ID', example: 1 })
  @Get('getRole/:id')
  getRole(@Param('id') id: number) {
    return this.userService.getRole(id);
  }
}
