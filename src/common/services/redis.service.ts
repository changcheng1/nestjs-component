/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-18 18:30:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-18 18:30:00
 * @FilePath: /myself-space/nestjs/src/common/services/redis.service.ts
 * @Description: Redis 服务，提供统一的 Redis 实例管理
 */
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from '../../config/redis.config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      db: redisConfig.db,
      password: redisConfig.password,
      maxRetriesPerRequest: redisConfig.maxRetriesPerRequest,
      enableReadyCheck: redisConfig.enableReadyCheck,
      connectTimeout: redisConfig.connectTimeout,
      commandTimeout: redisConfig.commandTimeout,
    });

    // 连接事件监听
    this.redis.on('connect', () => {
      console.log(
        '✅ Redis 服务连接成功:',
        `${redisConfig.host}:${redisConfig.port}`,
      );
    });

    this.redis.on('error', (error) => {
      console.error('❌ Redis 服务连接错误:', error.message);
    });

    this.redis.on('ready', () => {
      console.log('✅ Redis 服务就绪');
    });
  }

  // 获取 Redis 实例
  getClient(): Redis {
    return this.redis;
  }

  // 设置键值
  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) {
      return this.redis.setex(key, ttl, value);
    }
    return this.redis.set(key, value);
  }

  // 获取值
  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  // 删除键
  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  // 检查键是否存在
  async exists(key: string): Promise<number> {
    return this.redis.exists(key);
  }

  // 设置过期时间
  async expire(key: string, seconds: number): Promise<number> {
    return this.redis.expire(key, seconds);
  }

  // 模块销毁时关闭连接
  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
      console.log('Redis 连接已关闭');
    }
  }
}
