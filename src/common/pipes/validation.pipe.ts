/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:17:35
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-06 15:43:34
 * @FilePath: /mvw_project/Users/changcheng/Desktop/back/src/common/pipes/validation.pipe.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  // 自定义管道
  transform(value: string): number {
    // 将字符串转换为数字
    const val = parseInt(value, 10);
    // 如果转换失败，抛出错误
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    // 返回转换后的数字
    return val;
  }
}
