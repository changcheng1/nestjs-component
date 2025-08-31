import { Injectable, Logger } from '@nestjs/common';
import {
  CreateContractDto,
  GenerateContractDto,
} from './dto/create-contract.dto';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as docx from 'docx-templates';
import { DownloadService } from '../download/download.service';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);
  private readonly uploadsDir = './uploads';
  private readonly templatesDir = './uploads/templates';
  private readonly generatedDir = './uploads/generated';

  constructor(private readonly downloadService: DownloadService) {
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
      this.logger.log(
        '收到生成合同请求:',
        JSON.stringify(generateDto, null, 2),
      );

      const { templateId, tenantId, contractData } = generateDto;

      // 验证必要的数据
      if (!contractData) {
        throw new Error('contractData 不能为空');
      }

      if (!contractData.name) {
        throw new Error('员工姓名不能为空');
      }

      if (!contractData) {
        throw new Error('contractData 不能为空');
      }

      this.logger.log(
        `开始生成合同 - 租户: ${tenantId}, 员工: ${contractData.name}`,
      );

      // 1. 验证模板文件是否存在
      const templateExists =
        await this.downloadService.templateExists(templateId);
      if (!templateExists) {
        throw new Error('模板文件不存在');
      }

      const templatePath = this.downloadService.getTemplatePath(templateId);

      // 2. 准备替换数据
      const replacementData = this.prepareReplacementData(contractData);

      // 3. 生成合同文档
      const generatedDoc = await this.createContractDocument(
        templatePath,
        replacementData,
      );

      // 4. 保存生成的文档
      const outputFileName = this.generateOutputFileName(
        contractData,
        templateId,
      );
      const outputPath = path.join(this.generatedDir, outputFileName);

      await fs.writeFile(outputPath, generatedDoc);

      this.logger.log(`合同生成成功: ${outputPath}`);

      return {
        success: true,
        filePath: outputPath,
        fileName: outputFileName,
        downloadUrl: `/api/v1/contracts/download/${outputFileName}`,
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
      const outputFileName = this.generateOutputFileName(
        contractData,
        templateFile.originalname,
      );
      const outputPath = path.join(this.generatedDir, outputFileName);

      await fs.writeFile(outputPath, generatedDoc);

      this.logger.log(`合同生成成功: ${outputPath}`);

      return {
        success: true,
        filePath: outputPath,
        fileName: outputFileName,
        downloadUrl: `/api/v1/contracts/download/${outputFileName}`,
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
  private generateOutputFileName(
    contractData: CreateContractDto,
    templateId?: string,
  ): string {
    const startDate = this.formatDate(contractData.startDate);
    const timestamp = new Date().getTime();

    // 如果提供了templateId，尝试从中提取文件名模式
    if (templateId) {
      // 替换模板名称中的变量
      let fileName = templateId;

      // 替换常见的变量
      fileName = fileName.replace(/\$\{name\}/g, contractData.name || '');
      fileName = fileName.replace(/\$\{startDate\}/g, startDate);
      fileName = fileName.replace(
        /\$\{department\}/g,
        contractData.department || '',
      );
      fileName = fileName.replace(
        /\$\{companyName\}/g,
        contractData.companyName || '',
      );
      fileName = fileName.replace(/\$\{post\}/g, contractData.post || '');

      // 如果文件名不以.docx结尾，添加时间戳避免重复
      if (!fileName.endsWith('.docx')) {
        fileName += '.docx';
      }

      // 在扩展名前添加时间戳
      fileName = fileName.replace('.docx', `_${timestamp}.docx`);

      return fileName;
    }

    // 默认文件名格式
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
   * 获取生成文件目录路径
   */
  getGeneratedDir(): string {
    return this.generatedDir;
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
}
