/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-27 17:45:25
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-14 18:29:29
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/user/entities/profile.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../user/entites/user.entity';
// 继承BaseUserEntity
@Entity()
export class Profile {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '主键自增',
  })
  id: number;

  @Column()
  gender: string;

  @Column()
  photo: string;

  @Column()
  address: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    comment: '删除时间',
    nullable: true,
  })
  deletedAt: Date;

  @OneToOne(() => User, (user) => user.profile, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn()
  user: User;
}
