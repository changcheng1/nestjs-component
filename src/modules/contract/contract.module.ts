/*
 * @Author: changcheng 364000100@qq.com
 * @Date: 2025-08-21 19:16:47
 * @LastEditors: changcheng 364000100@qq.com
 * @LastEditTime: 2025-08-21 19:17:07
 * @FilePath: /myself-space/nestjs/src/modules/contract/contract.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule, // 导入 AuthModule 以提供 AuthService
    // 配置 Multer 用于文件上传
    MulterModule.register({
      // 使用内存存储，不保存到磁盘
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        // 只允许 .docx 文件
        if (
          file.mimetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          cb(null, true);
        } else {
          cb(new Error('只允许上传 .docx 文件'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB 文件大小限制
        files: 1, // 只允许上传一个文件
      },
    }),
  ],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
