/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:18:30
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-06 19:48:58
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/user/entities/user.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Logs } from './logs.entity';
import { Roles } from './roles.entity';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
    name: 'id',
    comment: '主键自增',
  })
  id: number;

  @Column({ length: 20 })
  username: string;

  @Column({ length: 20 })
  password: string;
  //  一个用户对应多个日志
  // typescript -> 数据库 关联关系mapping
  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];
  // 一个用户对应多个角色
  @ManyToMany(() => Roles, (roles) => roles.users)
  roles: Roles[];
  // 对应profile表的user字段
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
