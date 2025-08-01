/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-05 12:35:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-06 11:11:01
 * @FilePath: /myself-space/nestjs/src/user/dto/login.dto.ts
 * @Description: 登录 DTO
 */
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
