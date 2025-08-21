/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-20 18:58:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-20 18:58:00
 * @FilePath: /myself-space/nestjs/src/common/providers/tenant-repository.provider.ts
 * @Description: 多租户Repository提供者
 */
import { Provider, Scope } from '@nestjs/common';
import { getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { TenantContextService } from '../services/tenant-context.service';
import { Repository, DataSource, ObjectLiteral } from 'typeorm';

/**
 * 创建多租户Repository提供者
 * @param entity 实体类
 * @returns Provider配置
 */
export function createTenantRepositoryProvider<T extends ObjectLiteral>(
  entity: new () => T,
): Provider {
  return {
    provide: getRepositoryToken(entity),
    useFactory: (
      tenantContext: TenantContextService,
      tenant1DataSource: DataSource,
      tenant2DataSource: DataSource,
    ): Repository<T> => {
      const tenantId = tenantContext.getCurrentTenantId();
      const dataSource =
        tenantId === '1' ? tenant1DataSource : tenant2DataSource;

      console.log(`🔄 为实体 ${entity.name} 选择租户${tenantId}的数据源`);

      return dataSource.getRepository(entity);
    },
    inject: [
      TenantContextService,
      getDataSourceToken('tenant1'),
      getDataSourceToken('tenant2'),
    ],
    scope: Scope.REQUEST,
  };
}

/**
 * 创建租户特定的Repository提供者
 * @param entity 实体类
 * @param tenantId 租户ID
 * @returns Provider配置
 */
export function createSpecificTenantRepositoryProvider<T extends ObjectLiteral>(
  entity: new () => T,
  tenantId: string,
): Provider {
  const connectionName = `tenant${tenantId}`;

  return {
    provide: `${entity.name}Repository_${tenantId}`,
    useFactory: (dataSource: DataSource): Repository<T> => {
      return dataSource.getRepository(entity);
    },
    inject: [`${connectionName}DataSource`],
  };
}
