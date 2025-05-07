/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-27 18:16:57
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-04-29 16:58:51
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/roles/roles.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  // 一个角色对应多个用户
  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable({
    // 指定中间表的名称
    name: 'user_roles',
    // 指定中间表的列
    joinColumn: {
      // 指定中间表的列名
      name: 'rolesId',
      // 指定中间表的列的引用列名
      referencedColumnName: 'id',
    },
    // 指定反向中间表的列
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users: User[];
}
