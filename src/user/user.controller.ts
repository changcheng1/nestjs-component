/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:17:59
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-15 15:43:44
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/user/user.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Controller,
  Get,
  Body,
  Scope,
  LoggerService,
  Post,
  Patch,
  Param,
  UseFilters,
  Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './entites/user.entity';
import { LazyModuleLoader } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { TypeOrmExceptionFilter } from '../common/filters/typeOrm.filter';

@Controller({
  path: 'user',
  scope: Scope.REQUEST,
})
@UseFilters(new TypeOrmExceptionFilter()) // Changed to use class reference instead of instance
export class UserController {
  constructor(
    private readonly userService: UsersService,
    private readonly lazyModuleLoader: LazyModuleLoader,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post('addUser')
  addUser(@Body() user: User): Promise<User> {
    return this.userService.addUser(user);
  }
  @Delete('removeUser/:id')
  async removeUser(@Param('id') id: number) {
    return await this.userService.removeUser(id);
  }
  @Patch('updateUser/:id')
  updateUser(@Param('id') id: number, @Body() user: User) {
    return this.userService.updateUser(id, user);
  }
  @Get('findUser/:id')
  findUser(@Param('id') id: number): Promise<User> {
    return this.userService.findUser(id);
  }
}
