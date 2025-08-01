/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-31 18:17:46
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-31 18:31:32
 * @FilePath: /myself-space/nestjs/src/menus/dto/update-menu.dto.ts
 * @Description: 菜单更新 DTO
 */
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({
    description: '菜单名称',
    example: '用户管理',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '菜单路径', example: '/users', required: false })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty({
    description: '权限策略',
    example: 'user:read,user:write',
    required: false,
  })
  @IsString()
  @IsOptional()
  acl?: string;

  @ApiProperty({ description: '角色ID', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  roleId?: number;
}
