/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-19 15:35:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-19 15:35:00
 * @FilePath: /myself-space/nestjs/src/database/typeorm/database-factory.ts
 * @Description: 简化的数据库配置工厂
 */
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { createDataSourceConfig } from './database.config';

// 数据库配置工厂（简化版）
export class DatabaseConfigBuilder {
  // 标准配置：MySQL(默认) + MongoDB
  static create(): TypeOrmModuleAsyncOptions[] {
    return [
      // MySQL 作为默认连接
      {
        name: 'default',
        useFactory: () => ({
          ...createDataSourceConfig('mysql'),
          autoLoadEntities: true,
        }),
      },
      // MongoDB 用于日志
      {
        name: 'mongodb',
        useFactory: () => ({
          ...createDataSourceConfig('mongodb'),
          autoLoadEntities: true,
        }),
      },
    ];
  }
}
