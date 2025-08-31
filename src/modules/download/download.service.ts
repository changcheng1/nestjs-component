import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface TemplateInfo {
  id: string;
  name: string;
  size: number;
  uploadTime: Date;
  tenantId: string;
}

@Injectable()
export class DownloadService {
  private readonly logger = new Logger(DownloadService.name);
  private readonly templatesDir = './uploads/templates';

  constructor() {
    void this.ensureDirectories();
  }

  /**
   * 确保必要的目录存在
   */
  private async ensureDirectories() {
    await fs.ensureDir(this.templatesDir);
  }

  /**
   * 获取模板列表
   */
  async getTemplates(tenantId?: string): Promise<TemplateInfo[]> {
    try {
      const files = await fs.readdir(this.templatesDir);
      const templates: TemplateInfo[] = [];

      for (const file of files) {
        // 跳过隐藏文件和非docx文件
        if (file.startsWith('.') || !file.endsWith('.docx')) {
          continue;
        }

        const filePath = path.join(this.templatesDir, file);
        const stats = await fs.stat(filePath);

        templates.push({
          id: file,
          name: file,
          size: stats.size,
          uploadTime: stats.mtime,
          tenantId: tenantId || 'default',
        });
      }

      this.logger.log(`获取到 ${templates.length} 个模板文件`);
      return templates;
    } catch (error: any) {
      this.logger.error('获取模板列表失败:', error);
      return [];
    }
  }

  /**
   * 检查模板是否存在
   */
  async templateExists(templateId: string): Promise<boolean> {
    try {
      const templatePath = path.join(this.templatesDir, templateId);
      return await fs.pathExists(templatePath);
    } catch (error) {
      this.logger.error('检查模板存在性失败:', error);
      return false;
    }
  }

  /**
   * 获取模板文件路径
   */
  getTemplatePath(templateId: string): string {
    return path.join(this.templatesDir, templateId);
  }

  /**
   * 获取模板信息
   */
  async getTemplateInfo(templateId: string): Promise<TemplateInfo | null> {
    try {
      const templatePath = path.join(this.templatesDir, templateId);

      if (!(await fs.pathExists(templatePath))) {
        return null;
      }

      const stats = await fs.stat(templatePath);

      return {
        id: templateId,
        name: templateId,
        size: stats.size,
        uploadTime: stats.mtime,
        tenantId: 'default',
      };
    } catch (error) {
      this.logger.error('获取模板信息失败:', error);
      return null;
    }
  }
}
