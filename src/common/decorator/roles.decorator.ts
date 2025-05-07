/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-22 15:51:28
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-06 15:43:46
 * @FilePath: /mvw_project/Users/changcheng/Desktop/testjs-demo/src/common/decorator/roles.decorator.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Reflector } from '@nestjs/core';
// 创建一个装饰器，用于在控制器或方法上指定角色
export const Roles = Reflector.createDecorator<string[]>();
