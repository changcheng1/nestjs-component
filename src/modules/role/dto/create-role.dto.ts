/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:29:28
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-12 13:50:31
 * @FilePath: /myself-space/nestjs/src/modules/role/dto/create-role.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称', example: 'admin' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '角色描述',
    example: '系统管理员',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
