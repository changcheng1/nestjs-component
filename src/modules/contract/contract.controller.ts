/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  Query,
  Res,
  HttpStatus,
  HttpException,
  UseGuards,
  SetMetadata,
  Logger,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ContractService } from './contract.service';
import {
  CreateContractDto,
  GenerateContractDto,
} from './dto/create-contract.dto';
import { SimpleAuthGuard } from '../auth/guards/simple-auth.guard';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as archiver from 'archiver';

@Controller('contracts')
@UseGuards(SimpleAuthGuard)
@UseInterceptors(TenantInterceptor)
export class ContractController {
  private readonly logger = new Logger(ContractController.name);

  constructor(private readonly contractService: ContractService) {}

  /**
   * 上传多个模板文件
   */
  @Post('upload-templates')
  @UseInterceptors(FilesInterceptor('files', 10)) // 最多10个文件
  async uploadTemplates(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('tenantId') tenantId: string,
  ) {
    try {
      if (!files || files.length === 0) {
        throw new HttpException('请选择要上传的文件', HttpStatus.BAD_REQUEST);
      }

      const results: Array<{
        originalName: string;
        filename: string;
        path: string;
        size: number;
        tenantId: string;
        uploadTime: Date;
      }> = [];
      for (const file of files) {
        const result = await this.contractService.uploadTemplate(
          file,
          tenantId,
        );
        results.push(result);
      }

      return {
        success: true,
        message: `成功上传 ${files.length} 个模板文件`,
        files: results,
      };
    } catch (error) {
      throw new HttpException(
        `文件上传失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 生成合同文档
   */
  @Post('generate')
  @SetMetadata('skipAuth', true)
  async generateContract(@Body() generateDto: GenerateContractDto) {
    try {
      const result = await this.contractService.generateContract(generateDto);
      return result;
    } catch (error) {
      throw new HttpException(
        `合同生成失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 使用上传的模板文件生成合同 (POST)
   */
  @Post('generate-with-template')
  @UseInterceptors(FilesInterceptor('templateFile', 1))
  async generateContractWithTemplate(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('tenantId') tenantId: string,
    @Body('contractData') contractDataStr: string,
  ) {
    try {
      if (!files || files.length === 0) {
        throw new HttpException('请上传模板文件', HttpStatus.BAD_REQUEST);
      }

      const templateFile = files[0];
      let contractData: CreateContractDto;

      try {
        contractData = JSON.parse(contractDataStr);
      } catch (error) {
        throw new HttpException('合同数据格式错误', HttpStatus.BAD_REQUEST);
      }

      const result = await this.contractService.generateContractWithTemplate(
        templateFile,
        tenantId,
        contractData,
      );

      return result;
    } catch (error) {
      throw new HttpException(
        `合同生成失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 下载生成的合同文件
   * 注意：此接口不需要身份验证，因为文件名包含了足够的安全性
   */
  @Get('download/:filename')
  @SetMetadata('skipAuth', true)
  async downloadContract(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`下载请求: ${filename}`);

      // 解码文件名（处理URL编码）
      const decodedFilename = decodeURIComponent(filename);
      this.logger.log(`解码后文件名: ${decodedFilename}`);

      // 安全检查：防止路径遍历攻击
      if (
        decodedFilename.includes('..') ||
        decodedFilename.includes('/') ||
        decodedFilename.includes('\\')
      ) {
        throw new HttpException('无效的文件名', HttpStatus.BAD_REQUEST);
      }

      const filePath = path.join('./uploads/generated', decodedFilename);
      this.logger.log(`文件路径: ${filePath}`);

      if (!(await fs.pathExists(filePath))) {
        this.logger.warn(`文件不存在: ${filePath}`);
        throw new HttpException('文件不存在', HttpStatus.NOT_FOUND);
      }

      const stats = await fs.stat(filePath);
      this.logger.log(`文件大小: ${stats.size} bytes`);

      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(decodedFilename)}"`,
        'Content-Length': stats.size,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      });

      this.logger.log(`开始发送文件: ${decodedFilename}`);
      const fileStream = fs.createReadStream(filePath);

      fileStream.on('error', (error) => {
        this.logger.error('文件流错误:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: '文件读取失败' });
        }
      });

      fileStream.on('end', () => {
        this.logger.log(`文件发送完成: ${decodedFilename}`);
      });

      fileStream.pipe(res);
    } catch (error) {
      this.logger.error('文件下载失败:', error);
      throw new HttpException(
        `文件下载失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 批量生成合同（从JSON数据）
   */
  @Post('generate-batch')
  @SetMetadata('skipAuth', true)
  async generateBatchContracts(
    @Body()
    data: {
      templateId: string;
      tenantId: string;
      contracts: CreateContractDto[];
    },
  ) {
    try {
      const { templateId, tenantId, contracts } = data;

      if (!contracts || contracts.length === 0) {
        throw new HttpException('请提供合同数据', HttpStatus.BAD_REQUEST);
      }

      const results: Array<{
        success: boolean;
        employeeName: string;
        filePath?: string;
        fileName?: string;
        downloadUrl?: string;
        error?: string;
      }> = [];

      for (const contractData of contracts) {
        try {
          const result = await this.contractService.generateContract({
            templateId,
            tenantId,
            contractData,
          });
          results.push({ ...result, employeeName: contractData.name });
        } catch (error: any) {
          results.push({
            success: false,
            employeeName: contractData.name,
            error: error.message,
          });
        }
      }

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;
      const successResults = results.filter((r) => r.success);

      return {
        success: true,
        message: `批量生成完成: 成功 ${successCount} 个, 失败 ${failCount} 个`,
        results,
        summary: {
          total: contracts.length,
          success: successCount,
          failed: failCount,
        },
        // 添加批量下载信息
        batchDownload: {
          available: successCount > 0,
          fileNames: successResults.map((r) => path.basename(r.filePath || '')),
          batchDownloadUrl:
            successCount > 0 ? '/api/v1/contracts/download-batch' : null,
        },
      };
    } catch (error: any) {
      throw new HttpException(
        `批量生成失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 批量下载合同文件（打包为ZIP）
   */
  @Post('download-batch')
  @SetMetadata('skipAuth', true)
  async downloadBatchContracts(
    @Body() data: { fileNames: string[] },
    @Res() res: Response,
  ) {
    try {
      const { fileNames } = data;
      this.logger.log(
        `收到批量下载请求，文件列表: ${JSON.stringify(fileNames)}`,
      );

      if (!fileNames || fileNames.length === 0) {
        throw new HttpException('请提供文件名列表', HttpStatus.BAD_REQUEST);
      }

      // 创建 ZIP 压缩包
      const archive = archiver('zip', {
        zlib: { level: 9 }, // 压缩级别
      });

      // 设置响应头
      const zipFileName = `contracts_batch_${new Date().getTime()}.zip`;
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFileName}"`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      });

      // 错误处理
      archive.on('error', (err) => {
        this.logger.error('Archive error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'ZIP创建失败' });
        }
      });

      archive.on('warning', (err) => {
        this.logger.warn('Archive warning:', err);
      });

      // 将压缩流管道到响应
      archive.pipe(res);

      let addedFilesCount = 0;
      const generatedDir = this.contractService.getGeneratedDir();
      this.logger.log(`查找文件目录: ${generatedDir}`);

      // 添加文件到压缩包
      for (const fileName of fileNames) {
        // 清理文件名，确保只有文件名部分
        const cleanFileName = path.basename(fileName);
        const filePath = path.join(generatedDir, cleanFileName);

        this.logger.log(`检查文件: ${filePath}`);

        if (await fs.pathExists(filePath)) {
          const stats = await fs.stat(filePath);
          this.logger.log(
            `添加文件到ZIP: ${cleanFileName}, 大小: ${stats.size} bytes`,
          );

          archive.file(filePath, { name: cleanFileName });
          addedFilesCount++;
        } else {
          this.logger.warn(`文件不存在，跳过: ${filePath}`);
        }
      }

      if (addedFilesCount === 0) {
        throw new HttpException(
          '没有找到任何可下载的文件',
          HttpStatus.NOT_FOUND,
        );
      }

      // 完成压缩
      await archive.finalize();

      this.logger.log(
        `批量下载完成，成功添加 ${addedFilesCount}/${fileNames.length} 个文件到ZIP`,
      );
    } catch (error) {
      this.logger.error('批量下载失败:', error);
      if (!res.headersSent) {
        throw new HttpException(
          `批量下载失败: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * 获取系统状态信息
   */
  @Get('status')
  async getStatus() {
    try {
      const uploadsDir = './uploads';
      const templatesDir = './uploads/templates';
      const generatedDir = './uploads/generated';

      const [templatesCount, generatedCount] = await Promise.all([
        fs
          .readdir(templatesDir)
          .then((files) => files.length)
          .catch(() => 0),
        fs
          .readdir(generatedDir)
          .then((files) => files.length)
          .catch(() => 0),
      ]);

      return {
        success: true,
        status: {
          uploadsDir: await fs.pathExists(uploadsDir),
          templatesDir: await fs.pathExists(templatesDir),
          generatedDir: await fs.pathExists(generatedDir),
          templatesCount,
          generatedCount,
        },
      };
    } catch (error) {
      throw new HttpException(
        `获取状态失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
