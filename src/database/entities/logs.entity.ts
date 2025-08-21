/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-27 17:34:36
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-19 19:44:00
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/logs/roles.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  ObjectIdColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectId,
} from 'typeorm';

@Entity()
export class Logs {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column()
  data: string;

  @Column()
  result: string;

  @Column()
  userId: number;

  @Column({ default: '1', comment: '租户ID' })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt?: Date;
}
