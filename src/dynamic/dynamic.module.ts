/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 14:10:14
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-04-23 18:15:36
 * @FilePath: /mvw_project/Users/changcheng/Desktop/testjs-demo/src/dynamic/dynamic.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ConfigModule } from '@nestjs/config';
import { DynamicService } from './dynamic.service';
import { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
@Module({})
export class ConfigModuleClass {
  // 动态模块
  static register(options: Record<string, any>): DynamicModule {
    return {
      // 使用ConfigModule
      module: ConfigModule,
      // 提供配置选项
      providers: [
        {
          // 提供配置选项
          provide: 'CONFIG_OPTIONS',
          // 使用值
          useValue: options,
        },
        DynamicService,
      ],
      // 导出DynamicService
      exports: [DynamicService],
    };
  }
}
