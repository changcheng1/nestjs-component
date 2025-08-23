import {
  Controller,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs-extra';
import * as path from 'path';

@Controller('download')
export class DownloadController {
  private readonly logger = new Logger(DownloadController.name);

  /**
   * 下载生成的合同文件
   * 公共下载接口，不需要身份验证
   */
  @Get('contracts/:filename')
  async downloadContract(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`下载请求: ${filename}`);

      // 安全检查：防止路径遍历攻击
      if (
        filename.includes('..') ||
        filename.includes('/') ||
        filename.includes('\\\\')
      ) {
        throw new HttpException('无效的文件名', HttpStatus.BAD_REQUEST);
      }

      const filePath = path.join('./uploads/generated', filename);

      // 检查文件是否存在
      if (!(await fs.pathExists(filePath))) {
        this.logger.warn(`文件不存在: ${filePath}`);
        throw new HttpException('文件不存在', HttpStatus.NOT_FOUND);
      }

      // 获取文件信息
      const stats = await fs.stat(filePath);
      this.logger.log(`文件大小: ${stats.size} bytes`);

      // 设置响应头
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(filename)}"`,
      );
      res.setHeader('Content-Length', stats.size.toString());
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Pragma', 'no-cache');

      // 发送文件
      this.logger.log(`开始发送文件: ${filename}`);
      const fileStream = fs.createReadStream(filePath);

      fileStream.on('error', (error) => {
        this.logger.error('文件流错误:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: '文件读取失败' });
        }
      });

      fileStream.on('end', () => {
        this.logger.log(`文件发送完成: ${filename}`);
      });

      fileStream.pipe(res);
    } catch (error) {
      this.logger.error('文件下载失败:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `文件下载失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 获取文件信息（不下载）
   */
  @Get('contracts/:filename/info')
  async getFileInfo(@Param('filename') filename: string) {
    try {
      // 安全检查
      if (
        filename.includes('..') ||
        filename.includes('/') ||
        filename.includes('\\\\')
      ) {
        throw new HttpException('无效的文件名', HttpStatus.BAD_REQUEST);
      }

      const filePath = path.join('./uploads/generated', filename);

      if (!(await fs.pathExists(filePath))) {
        throw new HttpException('文件不存在', HttpStatus.NOT_FOUND);
      }

      const stats = await fs.stat(filePath);

      return {
        success: true,
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        exists: true,
      };
    } catch (error) {
      this.logger.error('获取文件信息失败:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `获取文件信息失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
