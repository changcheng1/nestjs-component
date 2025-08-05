/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-01 19:25:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 19:22:51
 * @FilePath: /myself-space/nestjs/src/modules/auth/casl/casl.decorator.ts
 * @Description: CASL 权限装饰器
 */
import { SetMetadata } from '@nestjs/common';
import { CHECK_POLICIES_KEY } from './casl.guard';

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
  SetMetadata(CHECK_POLICIES_KEY, handlers);

/**
 * 检查用户是否可以执行特定操作
 * @param action 操作
 * @param subject 资源
 * @returns 策略处理器
 */
export const CanPerform = (action: string, subject: string): PolicyHandler => {
  return (ability) => {
    try {
      return ability.can(action, subject);
    } catch {
      return false;
    }
  };
};

/**
 * 检查用户是否可以管理特定资源
 * @param subject 资源
 * @returns 策略处理器
 */
export const CanManage = (subject: string): PolicyHandler => {
  return (ability) => {
    try {
      return ability.can('manage', subject);
    } catch {
      return false;
    }
  };
};

/**
 * 检查用户是否可以读取特定资源
 * @param subject 资源
 * @returns 策略处理器
 */
export const CanRead = (subject: string): PolicyHandler => {
  return (ability) => {
    try {
      return ability.can('read', subject);
    } catch {
      return false;
    }
  };
};

/**
 * 检查用户是否可以创建特定资源
 * @param subject 资源
 * @returns 策略处理器
 */
export const CanCreate = (subject: string): PolicyHandler => {
  return (ability) => {
    try {
      return ability.can('create', subject);
    } catch {
      return false;
    }
  };
};

/**
 * 检查用户是否可以更新特定资源
 * @param subject 资源
 * @returns 策略处理器
 */
export const CanUpdate = (subject: string): PolicyHandler => {
  return (ability) => {
    try {
      return ability.can('update', subject);
    } catch {
      return false;
    }
  };
};

/**
 * 检查用户是否可以删除特定资源
 * @param subject 资源
 * @returns 策略处理器
 */
export const CanDelete = (subject: string): PolicyHandler => {
  return (ability) => {
    try {
      return ability.can('delete', subject);
    } catch {
      return false;
    }
  };
};
