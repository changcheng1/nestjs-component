/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:41:41
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-21 11:50:32
 * @FilePath: /myself-space/nestjs/src/modules/auth/dto/signup.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class SignUpDto {
  @ApiProperty({ description: '用户名', example: 'testuser' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @Length(2, 20, { message: '用户名长度必须在2到20个字符之间' })
  username: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @Length(6, 50, { message: '密码长度必须在6到50个字符之间' })
  password: string;

  @ApiProperty({ description: '租户ID', example: '1', required: false })
  @IsOptional()
  @IsString()
  tenantId?: string;
}

// 注册响应 DTO
export class SignUpResponseDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: '用户名', example: 'testuser' })
  @Expose()
  username: string;

  @ApiProperty({ description: '删除时间', required: false })
  @Exclude()
  deletedAt: Date | null;

  // 密码字段被排除
  @Exclude()
  password: string;
}
