/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-22 00:00:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-22 00:00:00
 * @FilePath: /myself-space/nestjs/src/common/decorators/public.decorator.ts
 * @Description: 公共接口装饰器 - 跳过认证
 */
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
