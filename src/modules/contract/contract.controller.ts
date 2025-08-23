/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  Get,
  Delete,
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

@Controller('contracts')
@UseGuards(SimpleAuthGuard)
@UseInterceptors(TenantInterceptor)
export class ContractController {
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
   * 测试接口是否可访问
   */
  @Get('test')
  async testEndpoint() {
    return {
      success: true,
      message: 'Contract API is working',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 获取合同生成接口信息 (GET)
   */
  @Get('generate-with-template')
  async getGenerateWithTemplateInfo() {
    return {
      success: true,
      message: '合同生成接口信息',
      method: 'POST',
      endpoint: '/api/v1/contracts/generate-with-template',
      contentType: 'multipart/form-data',
      parameters: {
        templateFile: 'File - .docx格式的模板文件',
        tenantId: 'String - 租户ID (可选，默认为2)',
        contractData: 'String - JSON格式的合同数据',
      },
      example: {
        contractData: JSON.stringify(
          {
            name: '张三',
            companyName: '医视界科技有限公司',
            department: '技术部',
            post: '软件工程师',
            workingHour: '8小时',
            cityName: '北京',
            location: '北京市朝阳区',
            startDate: '2025-01-01',
            actualEndDate: '2028-01-01',
            probationPay: 8000,
            probationMeritPay: 2000,
            salary: 12000,
            meritPay: 3000,
          },
          null,
          2,
        ),
      },
      timestamp: new Date().toISOString(),
    };
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
   * 获取模板列表
   */
  @Get('templates')
  async getTemplates(@Query('tenantId') tenantId: string) {
    try {
      const templates = await this.contractService.getTemplates(tenantId);
      return {
        success: true,
        templates,
        count: templates.length,
      };
    } catch (error) {
      throw new HttpException(
        `获取模板列表失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 删除模板文件
   */
  @Delete('templates/:templateId')
  async deleteTemplate(
    @Param('templateId') templateId: string,
    @Query('tenantId') tenantId: string,
  ) {
    try {
      const result = await this.contractService.deleteTemplate(
        templateId,
        tenantId,
      );

      if (result) {
        return {
          success: true,
          message: '模板删除成功',
        };
      } else {
        throw new HttpException('模板文件不存在', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(
        `模板删除失败: ${error.message}`,
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
      const filePath = path.join('./uploads/generated', filename);

      if (!(await fs.pathExists(filePath))) {
        throw new HttpException('文件不存在', HttpStatus.NOT_FOUND);
      }

      const stats = await fs.stat(filePath);

      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Content-Length': stats.size,
      });

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
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

      return {
        success: true,
        message: `批量生成完成: 成功 ${successCount} 个, 失败 ${failCount} 个`,
        results,
        summary: {
          total: contracts.length,
          success: successCount,
          failed: failCount,
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
