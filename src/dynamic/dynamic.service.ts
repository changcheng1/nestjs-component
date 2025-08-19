/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 14:12:16
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-18 16:01:04
 * @FilePath: /mvw_project/Users/changcheng/Desktop/testjs-demo/src/dynamic/dynamic.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable, Inject, Scope } from '@nestjs/common';
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
@Injectable({ scope: Scope.TRANSIENT })
export class DynamicService {
  // CONFIG_OPTIONS是一个注入令牌，用于在动态模块中传递配置选项
  // 在DynamicModuleClass.register()方法中，通过provide: 'CONFIG_OPTIONS'提供配置选项
  // 然后在DynamicService中通过@Inject('CONFIG_OPTIONS')注入这些配置选项
  // 这样可以在运行时动态地配置服务的行为
  constructor(@Inject(CONFIG_OPTIONS) options: Record<string, string>) {
    console.log('options', options); // { foler: 'development' }
  }
}
