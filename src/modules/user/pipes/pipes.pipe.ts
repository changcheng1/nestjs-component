/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-05-17 19:49:45
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-04 17:05:44
 * @FilePath: /myself-space/nestjs/src/user/pipes/pipes.pipe.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { GetUserDto, RoleType } from '../dto/user';

@Injectable()
export class UserPipes implements PipeTransform {
  transform(value: GetUserDto, metadata: ArgumentMetadata) {
    console.log('metadata', metadata);
    console.log('value', value);
    // 判断roles是数组对象，并返回一个对象的id字段
    if (value.roles && Array.isArray(value.roles) && value.roles.length > 0) {
      // 如果是roles是数组对象，则返回一个对象的id字段
      if (
        value.roles[0] &&
        typeof value.roles[0] === 'object' &&
        'id' in value.roles[0]
      ) {
        value.roles = (value.roles as RoleType[]).map(
          (role: RoleType) => role.id,
        );
      } else {
        value.roles = value.roles as number[];
      }
    }
    return value;
  }
}
