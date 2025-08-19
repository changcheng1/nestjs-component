/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-31 18:17:46
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-31 20:06:55
 * @FilePath: /myself-space/nestjs/src/modules/menus/menus.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from '../../database/entities/menu.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]),
    AuthModule, // 导入 AuthModule 以获取 CASL 功能
  ],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}
