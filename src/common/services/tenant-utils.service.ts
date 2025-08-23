/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-21 11:45:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-22 11:23:55
 * @FilePath: /myself-space/nestjs/src/common/services/tenant-utils.service.ts
 * @Description: 租户工具服务 - 提供租户相关的通用方法
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantUtilsService {
  /**
   * 验证租户ID是否有效
   * @param tenantId 租户ID
   * @returns 是否有效
   */
  static isValidTenant(tenantId: string): boolean {
    return ['1', '2'].includes(tenantId);
  }

  /**
   * 获取租户显示名称
   * @param tenantId 租户ID
   * @returns 租户显示名称
   */
  static getTenantDisplayName(tenantId: string): string {
    return `租户${tenantId}`;
  }

  /**
   * 获取租户数据库连接名称
   * @param tenantId 租户ID
   * @returns 数据库连接名称
   */
  static getConnectionName(tenantId: string): string {
    return `tenant${tenantId}`;
  }

  /**
   * 确保参数中包含有效的租户ID
   * @param data 数据对象
   * @param fallbackTenantId 备用租户ID
   * @returns 包含租户ID的数据对象
   */
  static ensureTenantId<T extends Record<string, unknown>>(
    data: T,
    fallbackTenantId: string = '1',
  ): T & { tenantId: string } {
    const tenantId = (data as any).tenantId || fallbackTenantId;

    if (!this.isValidTenant(tenantId)) {
      throw new Error(`无效的租户ID: ${tenantId}，有效值为: 1, 2`);
    }

    return {
      ...data,
      tenantId,
    };
  }

  /**
   * 从多种来源获取租户ID
   * @param body 请求体
   * @param query 查询参数
   * @param params 路径参数
   * @returns 租户ID
   */
  static extractTenantId(
    body?: Record<string, unknown>,
    query?: Record<string, unknown>,
    params?: Record<string, unknown>,
  ): string {
    return (
      (body as any)?.tenantId ||
      (query as any)?.tenantId ||
      (params as any)?.tenantId ||
      '1'
    );
  }
}
