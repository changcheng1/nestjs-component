/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-13 15:53:59
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-13 15:54:14
 * @FilePath: /myself-space/nestjs/src/config/redis.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';

// 定义配置接口
interface YamlConfig {
  redis?: {
    host?: string;
    port?: number;
    db?: number;
    password?: string;
    maxRetriesPerRequest?: number;
    retryDelayOnFailover?: number;
    enableReadyCheck?: boolean;
  };
}

// 获取环境变量
const env = process.env.NODE_ENV || 'production';

// 读取配置文件
const yamlConfig = yaml.load(
  readFileSync(join(process.cwd(), `env.${env}.yml`), 'utf8'),
) as YamlConfig;

// Redis 配置：支持环境变量覆盖
export const redisConfig = {
  host: process.env.REDIS_HOST || yamlConfig.redis?.host || 'localhost',
  port: parseInt(
    process.env.REDIS_PORT || String(yamlConfig.redis?.port || 6379),
  ),
  db: parseInt(process.env.REDIS_DB || String(yamlConfig.redis?.db || 0)),
  password: process.env.REDIS_PASSWORD || yamlConfig.redis?.password || '',

  // 连接池和重试配置
  maxRetriesPerRequest: parseInt(
    process.env.REDIS_MAX_RETRIES ||
      String(yamlConfig.redis?.maxRetriesPerRequest || 3),
  ),
  retryDelayOnFailover: parseInt(
    process.env.REDIS_RETRY_DELAY ||
      String(yamlConfig.redis?.retryDelayOnFailover || 100),
  ),
  enableReadyCheck:
    process.env.REDIS_ENABLE_READY_CHECK === 'true' ||
    yamlConfig.redis?.enableReadyCheck ||
    false,

  // 连接超时配置
  connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '10000'),
  commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT || '5000'),

  // 重连配置
  retryDelayOnClusterDown: parseInt(
    process.env.REDIS_CLUSTER_RETRY_DELAY || '300',
  ),
};
