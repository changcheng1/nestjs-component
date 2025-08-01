/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-31 18:17:46
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 16:15:54
 * @FilePath: /myself-space/nestjs/src/menus/menus.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { Role } from '../../enum/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('菜单管理')
@ApiBearerAuth()
@Controller('menus')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post('/create')
  @Roles(Role.Admin)
  @ApiOperation({ summary: '创建菜单', description: '创建新的菜单' })
  @ApiResponse({ status: 200, description: '菜单创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Get('/findAll')
  @Roles(Role.Admin)
  @ApiOperation({ summary: '获取所有菜单', description: '获取所有菜单' })
  @ApiResponse({ status: 200, description: '获取菜单列表成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 403, description: '无权限' })
  findAll() {
    return this.menusService.findAll();
  }

  @Get('/findOne/:id')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: '获取指定菜单', description: '获取指定菜单' })
  @ApiResponse({ status: 200, description: '获取菜单信息成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(+id);
  }

  @Patch('/update/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: '更新菜单', description: '更新指定菜单' })
  @ApiResponse({ status: 200, description: '菜单更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(+id, updateMenuDto);
  }

  @Delete('/delete/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: '删除菜单', description: '删除指定菜单' })
  @ApiResponse({ status: 200, description: '菜单删除成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  remove(@Param('id') id: string) {
    return this.menusService.remove(+id);
  }
}
