/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-25 11:20:42
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-04-27 14:36:58
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/config/database.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
// 获取环境变量
const env = process.env.NODE_ENV || 'production';
interface YamlConfig {
  db: {
    mysql: {
      type: 'mysql';
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      synchronize: boolean; // 自动同步数据库结构，设置为true时，TypeORM会根据实体类自动创建/更新数据库表结构，生产环境建议设置为false
    };
  };
  http: { host: string; port: number };
}
// 根据环境变量获取配置文件
const yamlConfig = yaml.load(
  readFileSync(join(__dirname, `../env.${env}.yml`), 'utf8'),
) as YamlConfig;
const { db, http } = yamlConfig;
export { db, http };
