/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-24 10:40:45
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-31 17:01:40
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/instution/instution.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('机构管理')
@ApiBearerAuth()
@Controller('institution')
@UseGuards(JwtAuthGuard)
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Post()
  @ApiOperation({ summary: '创建机构', description: '创建新的机构' })
  create(@Body() createInstitutionDto: CreateInstitutionDto) {
    return this.institutionService.create(createInstitutionDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有机构', description: '获取所有机构' })
  findAll() {
    return this.institutionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定机构', description: '获取指定机构' })
  findOne(@Param('id') id: string) {
    return this.institutionService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新机构', description: '更新指定机构' })
  update(
    @Param('id') id: string,
    @Body() updateInstitutionDto: UpdateInstitutionDto,
  ) {
    return this.institutionService.update(+id, updateInstitutionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除机构', description: '删除指定机构' })
  remove(@Param('id') id: string) {
    return this.institutionService.remove(+id);
  }
}
