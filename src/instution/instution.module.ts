/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-24 10:40:45
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-04-24 11:30:03
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/instution/instution.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module, forwardRef } from '@nestjs/common';
import { InstutionService } from './instution.service';
import { InstutionController } from './instution.controller';
import { UsersModule } from '../user/user.module';
@Module({
  // 解决循环依赖
  imports: [forwardRef(() => UsersModule)],
  controllers: [InstutionController],
  providers: [InstutionService],
  exports: [InstutionService],
})
export class InstutionModule {}
