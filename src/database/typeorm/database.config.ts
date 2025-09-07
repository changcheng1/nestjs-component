/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-25 11:20:42
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-09-06 11:29:42
 * @FilePath: /myself-space/nestjs/src/database/typeorm/database.config.ts
 * @Description: 数据库配置文件 - 整合版
 */
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
// 获取环境变量
const env = process.env.NODE_ENV || 'production';

export interface YamlConfig {
  db: {
    tenant1: {
      type: 'mysql';
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      synchronize: boolean;
      logging: boolean;
    };
    tenant2: {
      type: 'mysql';
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      synchronize: boolean;
      logging: boolean;
    };
    mongodb: {
      type: 'mongodb';
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      synchronize: boolean;
      logging: boolean;
    };
  };
  http: { host: string; port: number };
  log: { level: string; dir: string };
  jwt: { secret: string };
  redis: {
    host: string;
    port: number;
    db: number;
    password: string;
    maxRetriesPerRequest: number;
    retryDelayOnFailover: number;
    enableReadyCheck: boolean;
    synchronize: boolean;
  };
}

// 根据环境变量获取配置文件
const yamlConfig = yaml.load(
  readFileSync(join(process.cwd(), `env.${env}.yml`), 'utf8'),
) as YamlConfig;

const { db, http } = yamlConfig;

// 数据库同步控制：支持环境变量强制覆盖
export const databaseConfig = {
  ...db,
  tenant1: {
    ...db.tenant1,
    synchronize: db.tenant1.synchronize,
  },
  tenant2: {
    ...db.tenant2,
    synchronize: db.tenant2.synchronize,
  },
  mongodb: {
    ...db.mongodb,
    synchronize: db.mongodb.synchronize,
  },
};

export { databaseConfig as db, http };

// 创建租户数据库配置
export const createTenantDataSource = (tenantId: string): DataSourceOptions => {
  const dataSourceMap: Record<string, typeof databaseConfig.tenant1> = {
    '1': databaseConfig.tenant1,
    '2': databaseConfig.tenant2,
  };
  const tenantConfig = dataSourceMap[tenantId] || databaseConfig.tenant1;
  return {
    type: 'mysql',
    host: tenantConfig.host,
    port: tenantConfig.port,
    username: tenantConfig.username,
    password: tenantConfig.password,
    database: tenantConfig.database,
    synchronize: tenantConfig.synchronize,
    logging: tenantConfig.logging,
    entities: [
      __dirname + '/../entities/user.entity{.ts,.js}',
      __dirname + '/../entities/profile.entity{.ts,.js}',
      __dirname + '/../entities/role.entity{.ts,.js}',
      __dirname + '/../entities/user-role.entity{.ts,.js}',
      __dirname + '/../entities/user-profile.entity{.ts,.js}',
      __dirname + '/../entities/institution.entity{.ts,.js}',
      __dirname + '/../entities/menu.entity{.ts,.js}',
    ],
  };
};

// MongoDB DataSource 配置
export const createMongoDataSource = (): DataSourceOptions => ({
  type: 'mongodb',
  host: databaseConfig.mongodb.host,
  port: databaseConfig.mongodb.port,
  username: databaseConfig.mongodb.username,
  password: databaseConfig.mongodb.password,
  database: databaseConfig.mongodb.database,
  synchronize: databaseConfig.mongodb.synchronize,
  logging: databaseConfig.mongodb.logging,
  entities: [__dirname + '/../entities/logs.entity{.ts,.js}'],
});

// 创建租户 DataSource 实例
export const tenant1DataSource = new DataSource({
  ...createTenantDataSource('1'),
  name: 'tenant1',
});

export const tenant2DataSource = new DataSource({
  ...createTenantDataSource('2'),
  name: 'tenant2',
});

// 创建 MongoDB DataSource 实例
export const mongoDataSource = new DataSource({
  ...createMongoDataSource(),
  name: 'mongodb',
});

// 导出所有 DataSource 实例
export const dataSources = {
  tenant1: tenant1DataSource,
  tenant2: tenant2DataSource,
  mongodb: mongoDataSource,
};

// 导出配置函数，用于 TypeOrmModule.forRootAsync
export const createDataSourceConfig = (name: string) => {
  switch (name) {
    case 'tenant1':
      return createTenantDataSource('1');
    case 'tenant2':
      return createTenantDataSource('2');
    case 'mongodb':
      return createMongoDataSource();
    default:
      throw new Error(`Unknown data source name: ${name}`);
  }
};

// ========== 简化的数据库配置 ==========

// 数据库类型枚举
export enum DatabaseType {
  MYSQL = 'mysql',
  MONGODB = 'mongodb',
}
