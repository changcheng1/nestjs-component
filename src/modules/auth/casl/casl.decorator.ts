/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-01 19:25:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-19 19:32:43
 * @FilePath: /myself-space/nestjs/src/modules/auth/casl/casl.decorator.ts
 * @Description: CASL 权限装饰器
 */
import { SetMetadata } from '@nestjs/common';
import { CHECK_POLICIES_KEY } from './casl.guard';
import type { MongoAbility } from '@casl/ability';
import { Actions, Subjects } from './casl-ability.factory';
// 应用权限能力类型
export type AppAbility = MongoAbility<[Actions, Subjects]>;
// 策略处理器类型
export type PolicyHandler = (
  ability: {
    can: (action: string, subject: string, conditions?: any) => boolean;
  },
  request: any,
) => boolean | Promise<boolean>;

/**
 * 检查权限装饰器
 * @param handlers 策略处理器数组
 * @returns 装饰器
 */
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers); // 设置装饰器元数据

export const CanRead = (subject: string) => (ability: AppAbility) =>
  ability.can('read', subject as Subjects);

export const CanCreate = (subject: string) => (ability: AppAbility) =>
  ability.can('create', subject as Subjects);

export const CanUpdate = (subject: string) => (ability: AppAbility) =>
  ability.can('update', subject as Subjects);

export const CanDelete = (subject: string) => (ability: AppAbility) =>
  ability.can('delete', subject as Subjects);
