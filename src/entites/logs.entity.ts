/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-27 17:34:36
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-06 20:10:29
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/logs/roles.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
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
  // 多个日志对应一个用户
  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn()
  user: User;
}
