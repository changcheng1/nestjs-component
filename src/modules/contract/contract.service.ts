import { Injectable, Logger } from '@nestjs/common';
import {
  CreateContractDto,
  GenerateContractDto,
} from './dto/create-contract.dto';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as docx from 'docx-templates';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);
  private readonly uploadsDir = './uploads';
  private readonly templatesDir = './uploads/templates';
  private readonly generatedDir = './uploads/generated';

  constructor() {
    void this.ensureDirectories();
  }

  /**
   * 确保必要的目录存在
   */
  private async ensureDirectories() {
    await fs.ensureDir(this.uploadsDir);
    await fs.ensureDir(this.templatesDir);
    await fs.ensureDir(this.generatedDir);
  }

  /**
   * 上传模板文件
   */
  uploadTemplate(
    file: Express.Multer.File,
    tenantId: string,
  ): {
    originalName: string;
    filename: string;
    path: string;
    size: number;
    tenantId: string;
    uploadTime: Date;
  } {
    try {
      const templateInfo = {
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        tenantId,
        uploadTime: new Date(),
      };

      this.logger.log(
        `模板文件上传成功: ${file.originalname}, 租户: ${tenantId}`,
      );
      return templateInfo;
    } catch (error) {
      this.logger.error('模板文件上传失败:', error);
      throw error;
    }
  }

  /**
   * 生成合同文档
   */
  async generateContract(generateDto: GenerateContractDto): Promise<{
    success: boolean;
    filePath: string;
    fileName: string;
    downloadUrl: string;
  }> {
    try {
      const { templateId, tenantId, contractData } = generateDto;

      this.logger.log(
        `开始生成合同 - 租户: ${tenantId}, 员工: ${contractData.name}`,
      );

      // 1. 验证模板文件是否存在
      const templatePath = path.join(this.templatesDir, templateId);
      if (!(await fs.pathExists(templatePath))) {
        throw new Error('模板文件不存在');
      }

      // 2. 准备替换数据
      const replacementData = this.prepareReplacementData(contractData);

      // 3. 生成合同文档
      const generatedDoc = await this.createContractDocument(
        templatePath,
        replacementData,
      );

      // 4. 保存生成的文档
      const outputFileName = this.generateOutputFileName(contractData);
      const outputPath = path.join(
        this.generatedDir,
        `${tenantId}_${outputFileName}`,
      );

      await fs.writeFile(outputPath, generatedDoc);

      this.logger.log(`合同生成成功: ${outputPath}`);

      return {
        success: true,
        filePath: outputPath,
        fileName: outputFileName,
        downloadUrl: `/contracts/download/${path.basename(outputPath)}`,
      };
    } catch (error) {
      this.logger.error('合同生成失败:', error);
      throw error;
    }
  }

  /**
   * 使用上传的模板文件生成合同
   */
  async generateContractWithTemplate(
    templateFile: Express.Multer.File,
    tenantId: string,
    contractData: CreateContractDto,
  ): Promise<{
    success: boolean;
    filePath: string;
    fileName: string;
    downloadUrl: string;
  }> {
    try {
      this.logger.log(
        `开始使用上传模板生成合同 - 租户: ${tenantId}, 员工: ${contractData.name}, 模板: ${templateFile.originalname}`,
      );

      // 1. 验证文件类型
      if (
        templateFile.mimetype !==
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        throw new Error('只支持 .docx 格式的模板文件');
      }

      // 2. 准备替换数据
      const replacementData = this.prepareReplacementData(contractData);

      // 3. 直接使用上传的文件内容生成合同文档
      const generatedDoc = await this.createContractDocumentFromBuffer(
        templateFile.buffer,
        replacementData,
      );

      // 4. 保存生成的文档
      const outputFileName = this.generateOutputFileName(contractData);
      const outputPath = path.join(
        this.generatedDir,
        `${tenantId}_${outputFileName}`,
      );

      await fs.writeFile(outputPath, generatedDoc);

      this.logger.log(`合同生成成功: ${outputPath}`);

      return {
        success: true,
        filePath: outputPath,
        fileName: outputFileName,
        downloadUrl: `/api/v1/contracts/download/${path.basename(outputPath)}`,
      };
    } catch (error) {
      this.logger.error('合同生成失败:', error);
      throw error;
    }
  }

  /**
   * 准备替换数据
   */
  private prepareReplacementData(
    contractData: CreateContractDto,
  ): Record<string, string> {
    return {
      name: contractData.name,
      department: contractData.department,
      companyName: contractData.companyName,
      startDate: this.formatDate(contractData.startDate),
      actualEndDate: contractData.actualEndDate
        ? this.formatDate(contractData.actualEndDate)
        : '',
      hireDate: this.calculateHireDate(contractData.startDate),
      endDate: this.calculateEndDate(contractData.startDate),
      post: contractData.post,
      location: contractData.location,
      workingHour: contractData.workingHour,
      cityName: contractData.cityName,
      probationPay: contractData.probationPay.toFixed(2),
      probationPayUppercase: this.convertToChinese(contractData.probationPay),
      probationMeritPay: contractData.probationMeritPay.toFixed(2),
      probationMeritPayUppercase: this.convertToChinese(
        contractData.probationMeritPay,
      ),
      salary: contractData.salary.toFixed(2),
      salaryUppercase: this.convertToChinese(contractData.salary),
      meritPay: contractData.meritPay.toFixed(2),
      meritPayUppercase: this.convertToChinese(contractData.meritPay),
    };
  }

  /**
   * 创建合同文档
   */
  private async createContractDocument(
    templatePath: string,
    data: Record<string, string>,
  ): Promise<Buffer> {
    try {
      const template = await fs.readFile(templatePath);

      // 使用 docx-templates 处理模板
      const result = await docx.createReport({
        template,
        data,
        cmdDelimiter: ['${', '}'],
      });

      // 将 Uint8Array 转换为 Buffer
      return Buffer.from(result as Uint8Array);
    } catch (error) {
      this.logger.error('文档生成失败:', error);
      throw new Error('文档生成失败');
    }
  }

  /**
   * 从Buffer创建合同文档
   */
  private async createContractDocumentFromBuffer(
    templateBuffer: Buffer,
    data: Record<string, string>,
  ): Promise<Buffer> {
    try {
      // 使用 docx-templates 处理模板
      const result = await docx.createReport({
        template: templateBuffer,
        data,
        cmdDelimiter: ['${', '}'],
      });

      // 将 Uint8Array 转换为 Buffer
      return Buffer.from(result as Uint8Array);
    } catch (error) {
      this.logger.error('文档生成失败:', error);
      throw new Error('文档生成失败');
    }
  }

  /**
   * 生成输出文件名
   */
  private generateOutputFileName(contractData: CreateContractDto): string {
    const startDate = this.formatDate(contractData.startDate);
    const timestamp = new Date().getTime();
    return `${contractData.name}_${startDate}_${timestamp}.docx`;
  }

  /**
   * 格式化日期为中文格式
   */
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}年${month}月${day}日`;
    } catch (_error) {
      return dateString;
    }
  }

  /**
   * 计算转正日期（入职后6个月）
   */
  private calculateHireDate(startDate: string): string {
    try {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + 6);
      date.setDate(date.getDate() - 1);
      return this.formatDate(date.toISOString().split('T')[0]);
    } catch (_error) {
      return '';
    }
  }

  /**
   * 计算合同结束日期（入职后3年）
   */
  private calculateEndDate(startDate: string): string {
    try {
      const date = new Date(startDate);
      date.setFullYear(date.getFullYear() + 3);
      date.setDate(date.getDate() - 1);
      return this.formatDate(date.toISOString().split('T')[0]);
    } catch (_error) {
      return '';
    }
  }

  /**
   * 数字转中文大写
   */
  private convertToChinese(amount: number): string {
    if (amount === 0) {
      return '零元整';
    }

    const units = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿'];
    const numbers = [
      '零',
      '壹',
      '贰',
      '叁',
      '肆',
      '伍',
      '陆',
      '柒',
      '捌',
      '玖',
    ];

    const integerPart = Math.floor(amount);
    const decimalPart = Math.round((amount - integerPart) * 100);

    let result = '';

    if (integerPart > 0) {
      let temp = integerPart;
      let unitIndex = 0;

      while (temp > 0) {
        const digit = temp % 10;
        if (digit > 0) {
          result = numbers[digit] + units[unitIndex] + result;
        }
        temp = Math.floor(temp / 10);
        unitIndex++;
      }
      result += '元';
    }

    if (decimalPart > 0) {
      const jiao = Math.floor(decimalPart / 10);
      const fen = decimalPart % 10;

      if (jiao > 0) {
        result += numbers[jiao] + '角';
      }
      if (fen > 0) {
        result += numbers[fen] + '分';
      }
    } else {
      result += '整';
    }

    return result;
  }

  /**
   * 获取模板列表
   */
  async getTemplates(tenantId: string): Promise<
    Array<{
      id: string;
      name: string;
      size: number;
      uploadTime: Date;
      tenantId: string;
    }>
  > {
    try {
      const files = await fs.readdir(this.templatesDir);
      const templates: Array<{
        id: string;
        name: string;
        size: number;
        uploadTime: Date;
        tenantId: string;
      }> = [];

      for (const file of files) {
        const filePath = path.join(this.templatesDir, file);
        const stats = await fs.stat(filePath);

        templates.push({
          id: file,
          name: file,
          size: stats.size,
          uploadTime: stats.mtime,
          tenantId,
        });
      }

      return templates;
    } catch (error: any) {
      this.logger.error('获取模板列表失败:', error);
      return [];
    }
  }

  /**
   * 删除模板文件
   */
  async deleteTemplate(templateId: string, tenantId: string): Promise<boolean> {
    try {
      const templatePath = path.join(this.templatesDir, templateId);

      if (await fs.pathExists(templatePath)) {
        await fs.remove(templatePath);
        this.logger.log(`模板删除成功: ${templateId}, 租户: ${tenantId}`);
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error('模板删除失败:', error);
      return false;
    }
  }
}
