/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:29:06
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-31 17:48:31
 * @FilePath: /myself-space/nestjs/src/modules/role/role.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('角色管理')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/create')
  @ApiOperation({ summary: '创建角色', description: '创建新的角色' })
  @ApiResponse({ status: 200, description: '角色创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get('/findAll')
  @ApiOperation({
    summary: '获取所有角色',
    description: '获取系统中所有角色列表',
  })
  @ApiResponse({ status: 200, description: '获取角色列表成功' })
  findAll() {
    return this.roleService.findAll();
  }

  @Get('/findOne/:id')
  @ApiOperation({
    summary: '获取指定角色',
    description: '根据ID获取特定角色信息',
  })
  @ApiResponse({ status: 200, description: '获取角色信息成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Put('/update/:id')
  @ApiOperation({ summary: '更新角色', description: '更新指定角色的信息' })
  @ApiResponse({ status: 200, description: '角色更新成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: '删除角色', description: '删除指定的角色' })
  @ApiResponse({ status: 200, description: '角色删除成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
