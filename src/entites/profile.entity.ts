/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-27 17:45:25
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-06 19:48:15
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/user/entities/profile.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column()
  photo: string;

  @Column()
  address: string;
  // 一对一关系
  @OneToOne(() => User)
  // 转换为userId字段插入
  @JoinColumn()
  user: User;
}
