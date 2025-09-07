/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-20 18:58:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-09-06 11:25:31
 * @FilePath: /myself-space/nestjs/src/common/providers/tenant-repository.provider.ts
 * @Description: 多租户Repository提供者
 */
import { Provider, Scope } from '@nestjs/common';
import { getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { TenantContextService } from '../services/tenant-context.service';
import { Repository, DataSource, ObjectLiteral } from 'typeorm';

/**
 * 创建多租户Repository提供者，工厂函数创建Repository实例
 * 每个http请求都会创建一个新的实例，tenantContext 包含当前请求的租户信息，
 * @param entity 实体类
 * @returns Provider配置
 */
export function createTenantRepositoryProvider<T extends ObjectLiteral>(
  entity: new () => T,
): Provider {
  return {
    provide: getRepositoryToken(entity), // 例如getRepositoryToken(User) 返回 'UserRepository'
    useFactory: (
      tenantContext: TenantContextService, // 租户上下文服务
      tenant1DataSource: DataSource, // 租户1数据源
      tenant2DataSource: DataSource, // 租户2数据源
    ): Repository<T> => {
      const tenantId = tenantContext.getCurrentTenantId(); // 获取租户ID
      const dataSourceMap = {
        '1': tenant1DataSource,
        '2': tenant2DataSource,
      };
      return (dataSourceMap[tenantId] as DataSource).getRepository(entity);
    },
    inject: [
      // NestJS依赖注入容器，提前注入可能用到的数据源，提高性能
      TenantContextService, // 租户上下文服务
      getDataSourceToken('tenant1'), // 生成租户1数据源
      getDataSourceToken('tenant2'), // 生成租户2数据源
    ],
    scope: Scope.REQUEST, // 请求作用域
  };
}
