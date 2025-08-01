/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-05-13 13:57:50
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-13 13:45:23
 * @FilePath: /myself-space/nestjs/src/common/filters/typeOrm.filter.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { TypeORMError, QueryFailedError } from 'typeorm';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  constructor() {}
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';
    if (exception instanceof QueryFailedError) {
      // Handle specific database errors
      const driverError = exception.driverError as {
        errno?: number;
        code?: string;
      };

      // Map common database error codes to HTTP status codes
      switch (driverError.code) {
        case 'ER_DUP_ENTRY':
          status = HttpStatus.CONFLICT;
          errorMessage = 'Duplicate entry';
          break;
        case 'ER_NO_REFERENCED_ROW':
          status = HttpStatus.BAD_REQUEST;
          errorMessage = 'Referenced row does not exist';
          break;
        case 'ER_ROW_IS_REFERENCED':
          status = HttpStatus.CONFLICT;
          errorMessage = 'Cannot delete or update a parent row';
          break;
        default:
          status = driverError.errno
            ? HttpStatus.BAD_REQUEST
            : HttpStatus.INTERNAL_SERVER_ERROR;
          errorMessage = exception.message;
      }
    }
    console.log('异常过滤器信息', exception);
    // Send response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: errorMessage,
    });
  }
}
