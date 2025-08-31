import {
  Controller,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs-extra';
import * as path from 'path';
import { DownloadService } from './download.service';

@Controller('download')
export class DownloadController {
  private readonly logger = new Logger(DownloadController.name);

  constructor(private readonly downloadService: DownloadService) {}

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

  /**
   * 获取模板列表 - 无需身份验证
   */
  @Get('templates')
  async getTemplates(@Query('tenantId') tenantId?: string) {
    try {
      const templates = await this.downloadService.getTemplates(tenantId);
      return {
        success: true,
        templates,
        count: templates.length,
        message: `获取到 ${templates.length} 个模板`,
      };
    } catch (error) {
      this.logger.error('获取模板列表失败:', error);
      throw new HttpException(
        `获取模板列表失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 获取单个模板信息 - 无需身份验证
   */
  @Get('templates/:templateId/info')
  async getTemplateInfo(@Param('templateId') templateId: string) {
    try {
      // 安全检查
      if (
        templateId.includes('..') ||
        templateId.includes('/') ||
        templateId.includes('\\\\')
      ) {
        throw new HttpException('无效的模板ID', HttpStatus.BAD_REQUEST);
      }

      const templateInfo =
        await this.downloadService.getTemplateInfo(templateId);

      if (!templateInfo) {
        throw new HttpException('模板不存在', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        template: templateInfo,
      };
    } catch (error) {
      this.logger.error('获取模板信息失败:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `获取模板信息失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 下载模板文件 - 无需身份验证
   */
  @Get('templates/:templateId')
  async downloadTemplate(
    @Param('templateId') templateId: string,
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`模板下载请求: ${templateId}`);

      // 安全检查：防止路径遍历攻击
      if (
        templateId.includes('..') ||
        templateId.includes('/') ||
        templateId.includes('\\\\')
      ) {
        throw new HttpException('无效的模板ID', HttpStatus.BAD_REQUEST);
      }

      const templatePath = this.downloadService.getTemplatePath(templateId);

      // 检查文件是否存在
      if (!(await fs.pathExists(templatePath))) {
        this.logger.warn(`模板不存在: ${templatePath}`);
        throw new HttpException('模板不存在', HttpStatus.NOT_FOUND);
      }

      // 获取文件信息
      const stats = await fs.stat(templatePath);
      this.logger.log(`模板文件大小: ${stats.size} bytes`);

      // 设置响应头
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(templateId)}"`,
      );
      res.setHeader('Content-Length', stats.size.toString());
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Pragma', 'no-cache');

      // 发送文件
      this.logger.log(`开始发送模板文件: ${templateId}`);
      const fileStream = fs.createReadStream(templatePath);

      fileStream.on('error', (error) => {
        this.logger.error('模板文件流错误:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: '模板文件读取失败' });
        }
      });

      fileStream.on('end', () => {
        this.logger.log(`模板文件发送完成: ${templateId}`);
      });

      fileStream.pipe(res);
    } catch (error) {
      this.logger.error('模板下载失败:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `模板下载失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
