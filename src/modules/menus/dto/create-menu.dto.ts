/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-31 18:17:46
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-31 18:33:07
 * @FilePath: /myself-space/nestjs/src/menus/dto/create-menu.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: '菜单名称', example: '用户管理' })
  @IsString()
  name: string;

  @ApiProperty({ description: '菜单路径', example: '/users' })
  @IsString()
  path: string;

  @ApiProperty({
    description: '权限策略',
    example: 'user:read,user:write',
    required: false,
  })
  @IsString()
  @IsOptional()
  acl?: string;

  @ApiProperty({ description: '角色ID', example: 1 })
  @IsNumber()
  roleId: number;
}
