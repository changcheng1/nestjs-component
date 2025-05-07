/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-24 10:40:45
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-04-24 11:05:07
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/instution/instution.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Controller, Get } from '@nestjs/common';
import { InstutionService } from './instution.service';

@Controller('instution')
export class InstutionController {
  constructor(private readonly instutionService: InstutionService) {}
  @Get('findAll')
  findAll() {
    return this.instutionService.findAll();
  }
}
