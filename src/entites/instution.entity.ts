/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-24 10:40:45
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-04-24 13:28:10
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/instution/entities/instution.entity.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString, Length } from 'class-validator';
@Entity()
export class Instution {
  // 主键自增
  @PrimaryGeneratedColumn()
  id: number;

  // 机构名称
  // 限制长度
  @Length(1, 20)
  @IsString()
  @IsNotEmpty()
  @Column()
  institutionName: string;
}
