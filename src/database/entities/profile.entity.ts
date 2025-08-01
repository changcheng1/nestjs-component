/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-27 17:45:25
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-10 19:42:53
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/user/entities/profile.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '主键自增',
  })
  id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    comment: '用户ID',
  })
  userId: number;

  @Column()
  @IsNotEmpty({
    message: '性别不能为空',
  })
  gender: string;

  @Column()
  @IsNotEmpty({
    message: '照片不能为空',
  })
  photo: string;

  @Column()
  @IsNotEmpty({
    message: '地址不能为空',
  })
  address: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    comment: '删除时间',
    nullable: true,
  })
  deletedAt: Date;
}
