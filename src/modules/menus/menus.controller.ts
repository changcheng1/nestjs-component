/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-31 18:17:46
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-19 16:50:25
 * @FilePath: /myself-space/nestjs/src/modules/menus/menus.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-31 18:17:46
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-19 16:50:03
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CaslGuard,
  CheckPolicies,
  CanRead,
  CanCreate,
  CanUpdate,
  CanDelete,
} from '../auth/casl';

@ApiTags('菜单管理')
@ApiBearerAuth()
@Controller('menus')
@UseGuards(JwtAuthGuard, CaslGuard)
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post('/create')
  @CheckPolicies(CanCreate('Menu'))
  @ApiOperation({ summary: '创建菜单', description: '创建新的菜单' })
  @ApiResponse({ status: 200, description: '菜单创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 403, description: '权限不足' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Get('/findAll')
  @CheckPolicies(CanRead('Menu'))
  @ApiOperation({ summary: '获取所有菜单', description: '获取所有菜单' })
  @ApiResponse({ status: 200, description: '获取菜单列表成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 403, description: '权限不足' })
  findAll() {
    return this.menusService.findAll();
  }

  @Get('/findOne/:id')
  @CheckPolicies(CanRead('Menu'))
  @ApiOperation({ summary: '获取指定菜单', description: '获取指定菜单' })
  @ApiResponse({ status: 200, description: '获取菜单信息成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 403, description: '权限不足' })
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(+id);
  }

  @Patch('/update/:id')
  @CheckPolicies(CanUpdate('Menu'))
  @ApiOperation({ summary: '更新菜单', description: '更新指定菜单' })
  @ApiResponse({ status: 200, description: '菜单更新成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 403, description: '权限不足' })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(+id, updateMenuDto);
  }

  @Delete('/delete/:id')
  @CheckPolicies(CanDelete('Menu'))
  @ApiOperation({ summary: '删除菜单', description: '删除指定菜单' })
  @ApiResponse({ status: 200, description: '菜单删除成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 403, description: '权限不足' })
  remove(@Param('id') id: string) {
    return this.menusService.remove(+id);
  }
}
