/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-06 11:45:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 19:14:57
 * @FilePath: /myself-space/nestjs/src/entities/user-role.entity.ts
 * @Description: 用户角色关联表
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export interface RoleType {
  id: number;
  name: string;
}

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int', comment: '用户ID' })
  userId: number;

  @Column({ name: 'role_id', type: 'int', comment: '角色ID' })
  roleId: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    comment: '创建时间',
  })
  createdAt: Date;
}
