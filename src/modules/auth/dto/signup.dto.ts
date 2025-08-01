/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-05 12:50:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-10 19:40:28
 * @FilePath: /myself-space/nestjs/src/auth/dto/signup.dto.ts
 * @Description: 注册 DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
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
