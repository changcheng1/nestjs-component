/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-20 18:55:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-20 18:55:00
 * @FilePath: /myself-space/nestjs/src/database/typeorm/database-factory.ts
 * @Description: 多租户数据库配置工厂
 */
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { createDataSourceConfig } from './database.config';

// 多租户数据库配置工厂
export class DatabaseConfigBuilder {
  // 多租户配置：Tenant1 + Tenant2 + MongoDB
  static create(): TypeOrmModuleAsyncOptions[] {
    return [
      // 租户1数据库连接
      {
        name: 'tenant1',
        useFactory: () => ({
          ...createDataSourceConfig('tenant1'),
          autoLoadEntities: true,
        }),
      },
      // 租户2数据库连接
      {
        name: 'tenant2',
        useFactory: () => ({
          ...createDataSourceConfig('tenant2'),
          autoLoadEntities: true,
        }),
      },
      // MongoDB 用于日志（所有租户共享）
      {
        name: 'mongodb',
        useFactory: () => ({
          ...createDataSourceConfig('mongodb'),
          autoLoadEntities: true,
        }),
      },
    ];
  }

  // 获取特定租户的配置
  static createTenantConfig(tenantId: string): TypeOrmModuleAsyncOptions {
    const connectionName = `tenant${tenantId}`;
    return {
      name: connectionName,
      useFactory: () => ({
        ...createDataSourceConfig(connectionName),
        autoLoadEntities: true,
      }),
    };
  }

  // 获取MongoDB配置
  static createMongoConfig(): TypeOrmModuleAsyncOptions {
    return {
      name: 'mongodb',
      useFactory: () => ({
        ...createDataSourceConfig('mongodb'),
        autoLoadEntities: true,
      }),
    };
  }
}
