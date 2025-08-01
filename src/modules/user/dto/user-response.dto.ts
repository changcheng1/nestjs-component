/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-06 11:25:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-31 14:54:34
 * @FilePath: /myself-space/nestjs/src/user/dto/user-response.dto.ts
 * @Description: 用户响应 DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
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
