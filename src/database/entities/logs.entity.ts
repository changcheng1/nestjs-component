/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-27 17:34:36
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-10 19:43:08
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/logs/roles.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  DeleteDateColumn,
} from 'typeorm';

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

  @Column({ name: 'user_id', type: 'int', comment: '用户ID' })
  userId: number;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    comment: '删除时间',
    nullable: true,
  })
  deletedAt: Date;
}
