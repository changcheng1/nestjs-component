/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-27 18:16:57
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-10 19:43:18
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/roles/roles.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
}
