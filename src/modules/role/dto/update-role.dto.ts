/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:41:41
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-12 13:50:35
 * @FilePath: /myself-space/nestjs/src/modules/role/dto/update-role.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({ description: '角色名称', example: 'admin', required: false })
  name?: string;

  @ApiProperty({
    description: '角色描述',
    example: '系统管理员',
    required: false,
  })
  description?: string;
}
