/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-25 11:20:42
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-19 16:08:13
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
    mysql: {
      type: 'mysql';
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      synchronize: boolean;
    };
    mongodb: {
      type: 'mongodb';
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      synchronize: boolean;
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

const { db, http, redis } = yamlConfig;

// 数据库同步控制：支持环境变量强制覆盖
export const databaseConfig = {
  ...db,
  mysql: {
    ...db.mysql,
    synchronize: redis.synchronize,
  },
  mongodb: {
    ...db.mongodb,
    synchronize: redis.synchronize,
  },
};

export { databaseConfig as db, http };

// MySQL DataSource 配置
export const createMySqlDataSource = (): DataSourceOptions => ({
  type: 'mysql',
  host: databaseConfig.mysql.host,
  port: databaseConfig.mysql.port,
  username: databaseConfig.mysql.username,
  password: databaseConfig.mysql.password,
  database: databaseConfig.mysql.database,
  synchronize: databaseConfig.mysql.synchronize,
  logging: process.env.NODE_ENV === 'development',
  entities: [
    __dirname + '/../entities/user.entity{.ts,.js}',
    __dirname + '/../entities/profile.entity{.ts,.js}',
    __dirname + '/../entities/role.entity{.ts,.js}',
    __dirname + '/../entities/user-role.entity{.ts,.js}',
    __dirname + '/../entities/user-profile.entity{.ts,.js}',
    __dirname + '/../entities/institution.entity{.ts,.js}',
    __dirname + '/../entities/menu.entity{.ts,.js}',
  ],
});

// MongoDB DataSource 配置
export const createMongoDataSource = (): DataSourceOptions => ({
  type: 'mongodb',
  host: databaseConfig.mongodb.host,
  port: databaseConfig.mongodb.port,
  username: databaseConfig.mongodb.username,
  password: databaseConfig.mongodb.password,
  database: databaseConfig.mongodb.database,
  synchronize: databaseConfig.mongodb.synchronize,
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/../entities/logs.entity{.ts,.js}'],
});

// 创建 MySQL DataSource 实例
export const mysqlDataSource = new DataSource({
  ...createMySqlDataSource(),
  name: 'mysql',
});

// 创建 MongoDB DataSource 实例
export const mongoDataSource = new DataSource({
  ...createMongoDataSource(),
  name: 'mongodb',
});

// 导出所有 DataSource 实例
export const dataSources = {
  mysql: mysqlDataSource,
  mongodb: mongoDataSource,
};

// 导出配置函数，用于 TypeOrmModule.forRootAsync
export const createDataSourceConfig = (name: string) => {
  switch (name) {
    case 'mysql':
      return createMySqlDataSource();
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
