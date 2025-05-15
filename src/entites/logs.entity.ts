/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-27 17:34:36
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-14 18:31:43
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/logs/roles.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../user/entites/user.entity';

@Entity()
export class Logs {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'id',
    comment: '主键id',
  })
  id: number;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column()
  data: string;

  @Column()
  result: string;

  @Column({ name: 'userId', nullable: true })
  userId: number;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    comment: '删除时间',
    nullable: true,
  })
  deletedAt: Date;

  // 多个日志对应一个用户，但不创建外键约束
  @ManyToOne(() => User, (user) => user.logs, {
    onDelete: 'CASCADE',
  })
  user: User;
}
