import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('应用')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: '根路径', description: '应用根路径' })
  getRoot() {
    return {
      message: 'NestJS 应用运行正常',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  @Get('health')
  @ApiOperation({ summary: '健康检查', description: '应用健康检查端点' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
}