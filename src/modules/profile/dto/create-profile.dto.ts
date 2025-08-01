/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:28:16
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-12 13:50:44
 * @FilePath: /myself-space/nestjs/src/modules/profile/dto/create-profile.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateProfileDto {
  @IsNumber()
  userId: number;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
