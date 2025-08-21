/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-05-10 13:58:29
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 11:32:10
 * @FilePath: /myself-space/nestjs/src/user/dto/get-user-dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D7%BD%AE
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Exclude } from 'class-transformer';

// 角色类型
export interface RoleType {
  id: number;
  name: string;
}
// 角色类型数组
export type Role = RoleType[] | number[];

// 用户类型
export class GetUserDto {
  @ApiProperty({ description: '用户ID', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ description: '用户名', example: 'testuser', required: false })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({ description: '密码', example: 'password123', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ description: '角色列表', required: false })
  @IsOptional()
  @IsArray()
  roles?: Role;

  @ApiProperty({ description: '性别', example: 'male', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ description: '用户资料', required: false })
  @IsOptional()
  profile?: {
    id?: number;
    gender?: string;
    photo?: string;
    address?: string;
  };

  @ApiProperty({ description: '租户ID', example: '1', required: false })
  @IsOptional()
  @IsString()
  tenantId?: string;
}
