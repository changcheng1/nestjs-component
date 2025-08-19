/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-01 19:20:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-19 19:33:55
 * @FilePath: /myself-space/nestjs/src/modules/auth/casl/casl.guard.ts
 * @Description: CASL 权限守卫
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PolicyHandler } from './casl.decorator';

// 权限装饰器元数据键
export const CHECK_POLICIES_KEY = 'check_policy';
export const POLICIES_HANDLER = 'policies_handler';

// 请求接口
interface RequestWithUser {
  user: {
    id: number;
    username: string;
  };
}

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取装饰器定义的策略
    const policyHandlers = this.reflector.getAllAndOverride<PolicyHandler[]>(
      CHECK_POLICIES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // 如果没有权限装饰器，直接通过
    if (!policyHandlers) {
      return true;
    }
    // 从请求中获取用户信息
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { user } = request;

    if (!user) {
      throw new ForbiddenException('用户未认证');
    }

    // 为用户创建权限能力
    const ability = await this.caslAbilityFactory.createForUser(user);

    // 检查所有策略
    for (const handler of policyHandlers) {
      try {
        // 执行策略处理器
        const result = await handler(ability, request);
        if (!result) {
          throw new ForbiddenException('权限不足');
        }
      } catch {
        throw new ForbiddenException('权限检查失败');
      }
    }

    return true;
  }
}
