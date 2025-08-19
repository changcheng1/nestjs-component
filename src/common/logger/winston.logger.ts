/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-12 19:14:52
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-12 19:18:02
 * @FilePath: /myself-space/nestjs/src/common/logger/winston.logger.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { LoggerService } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import * as fs from 'fs';
import * as DailyRotateNs from 'winston-daily-rotate-file';

// 宽松构造器类型，避免引入额外类型依赖
type DailyRotateFileCtor = new (options: Record<string, unknown>) => any;
const DailyRotateFile: DailyRotateFileCtor =
  (DailyRotateNs as unknown as { default?: DailyRotateFileCtor }).default ??
  (DailyRotateNs as unknown as DailyRotateFileCtor);
export function createWinstonLogger(): LoggerService {
  // 确保日志目录存在
  const logsDir = 'logs';
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  return WinstonModule.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    // 文件等默认使用 JSON 格式，便于采集
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      format.errors({ stack: true }),
      format.splat(),
      format.json(),
    ),
    transports: [
      // 控制台：彩色、时间戳、人类可读
      new transports.Console({
        level: process.env.LOG_LEVEL || 'info',
        format: format.combine(
          format.colorize(),
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
          format.printf((info: Record<string, unknown>) => {
            const tsValue = info['timestamp'];
            const ts: string =
              typeof tsValue === 'string' ? tsValue : new Date().toISOString();
            const levelValue = info['level'];
            const level = typeof levelValue === 'string' ? levelValue : 'info';
            const context = info['context'];
            const ctxLabel =
              context == null
                ? ''
                : ` [${
                    typeof context === 'string'
                      ? context
                      : JSON.stringify(context)
                  }]`;

            const stackValue = info['stack'];
            const messageValue = info['message'];
            const msgCandidate =
              typeof stackValue === 'string' ? stackValue : messageValue;
            const printableMessage =
              typeof msgCandidate === 'string'
                ? msgCandidate
                : JSON.stringify(msgCandidate);

            const ignore = new Set([
              'timestamp',
              'level',
              'message',
              'stack',
              'context',
            ]);
            const metaKeys = Object.keys(info).filter((k) => !ignore.has(k));
            const metaObj: Record<string, unknown> = {};
            for (const k of metaKeys) metaObj[k] = info[k];
            const rest = metaKeys.length ? ` ${JSON.stringify(metaObj)}` : '';
            return `${ts} ${level}${ctxLabel} ${printableMessage}${rest}`;
          }),
        ),
      }),
      // 每日滚动错误日志
      new DailyRotateFile({
        filename: 'logs/%DATE%-error.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
      }),
      // 每日滚动综合日志
      new DailyRotateFile({
        filename: 'logs/%DATE%-combined.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  });
}
