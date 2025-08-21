/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-20 18:52:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-20 18:52:00
 * @FilePath: /myself-space/nestjs/src/common/services/tenant-context.service.ts
 * @Description: 租户上下文服务 - 管理当前请求的租户信息
 */
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  /**
   * 获取当前请求的租户ID
   * @returns 租户ID (1 或 2)
   */
  getCurrentTenantId(): string {
    return this.request.tenantId || '1';
  }

  /**
   * 获取当前租户的数据库连接名称
   * @returns 数据库连接名称
   */
  getCurrentConnectionName(): string {
    const tenantId = this.getCurrentTenantId();
    return `tenant${tenantId}`;
  }

  /**
   * 检查是否为有效租户
   * @param tenantId 租户ID
   * @returns 是否有效
   */
  isValidTenant(tenantId: string): boolean {
    return ['1', '2'].includes(tenantId);
  }

  /**
   * 获取租户显示名称
   * @returns 租户显示名称
   */
  getTenantDisplayName(): string {
    const tenantId = this.getCurrentTenantId();
    return `租户${tenantId}`;
  }
}
