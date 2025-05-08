/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:17:59
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-07 23:11:18
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/user/user.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Controller,
  Get,
  Put,
  Body,
  Query,
  BadRequestException,
  Scope,
  Logger,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from '../entites/user.entity';
import { ParseIntPipe } from '../common/pipes/validation.pipe';
import { Roles } from '../common/decorator/roles.decorator';
import { UpdateResult } from 'typeorm';
import { LazyModuleLoader } from '@nestjs/core';
import { InstutionService } from '../instution/instution.service';
import { Logs } from '../entites/logs.entity';
@Controller({
  path: 'user',
  scope: Scope.REQUEST,
})
export class UserController {
  constructor(
    private readonly logger: Logger,
    private readonly userService: UsersService,
    private readonly lazyModuleLoader: LazyModuleLoader,
  ) {}

  @Get('addUser')
  addUser() {}

  @Get('findUser')
  async findUser(@Query('id', new ParseIntPipe()) id: number) {
    return await this.userService.find(id);
  }

  @Put('updateUser')
  async updateUser(@Body() user: User): Promise<UpdateResult> {
    return await this.userService.update(user.id, {
      ...user,
    });
  }

  @Get('findAll')
  @Roles(['admin'])
  async findAll() {
    return await this.userService.findAll();
  }
  // 懒加载模块请求
  @Get('lazyFindAll')
  async lazyFindAll() {
    const { InstutionModule } = await import('../instution/instution.module');
    const moduleRef = await this.lazyModuleLoader.load(() => InstutionModule);
    const lazyService = moduleRef.get(InstutionService);
    return lazyService.findAll();
  }

  @Get('testError')
  testError() {
    throw new BadRequestException('Something bad happened', {
      cause: new Error(),
      description: '抛出异常',
    });
  }
  @Get('findProfile')
  async findProfile(@Query('id', new ParseIntPipe()) id: number) {
    return await this.userService.findProfile(id);
  }
  @Get('findUserLogs')
  async findUserLogs(@Query('id', new ParseIntPipe()) id: number) {
    return await this.userService.findUserLogs(id);
  }
  @Get('findLogsGroupBy')
  async findLogsGroupBy(
    @Query('id', new ParseIntPipe()) id: number,
  ): Promise<Logs[]> {
    this.logger.log('request findLogsGroupBy', UserController.name);
    return await this.userService.findLogsGroupBy(id);
  }
}
