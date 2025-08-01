/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:18:30
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 11:24:40
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/user/entities/user.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Length, IsNotEmpty } from 'class-validator';

@Entity()
export class User {
  @ApiProperty({ description: '用户ID', example: 1 })
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
    name: 'id',
    comment: '主键自增',
  })
  id: number;

  @ApiProperty({ description: '用户名', example: 'testuser' })
  @Column({ length: 20 })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @Length(2, 20, {
    message: `用户名长度必须在${2}到${20}个字符之间`,
  })
  username: string;

  @ApiProperty({ description: '密码', example: 'hashedPassword' })
  @Column({ length: 255 })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    comment: '删除时间',
    nullable: true,
  })
  deletedAt: Date;
}
