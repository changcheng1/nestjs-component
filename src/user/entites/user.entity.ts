/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:18:30
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-15 16:12:38
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
  JoinColumn,
  AfterRemove,
  DeleteDateColumn,
} from 'typeorm';
import { Logs } from '../../entites/logs.entity';
import { Roles } from '../../entites/roles.entity';
import { Profile } from '../../entites/profile.entity';

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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    comment: '删除时间',
    nullable: true,
  })
  deletedAt: Date;

  //  一个用户对应多个日志
  // typescript -> 数据库 关联关系mapping
  @OneToMany(() => Logs, (logs) => logs.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  logs: Logs[];
  // 一个用户对应多个角色
  @ManyToMany(() => Roles, (roles) => roles.users)
  roles: Roles[];
  // @OneToOne(() => Profile, (profile) => profile.user)
  // 第一个参数 () => Profile 指定关联的实体类型，这里表示与Profile实体建立一对一关系
  // 第二个参数 (profile) => profile.user 指定反向关联的属性，这里表示在Profile实体中通过user属性关联回User实体
  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true, // 启用所有级联操作
  })
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @AfterRemove()
  afterRemove() {
    console.log('触发删除的订阅');
  }
}
