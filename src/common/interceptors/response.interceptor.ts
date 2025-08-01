/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 14:00:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-31 17:49:10
 * @FilePath: /myself-space/nestjs/src/common/interceptors/response.interceptor.ts
 * @Description: 统一响应拦截器，根据状态码处理返回值
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response, Request } from 'express';
import { STATUS_CODES } from '../../utils/constants/status-codes';
import { MESSAGES } from '../../utils/constants/messages';

// 标准响应接口
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data: T) => {
        const statusCode = response.statusCode;
        const timestamp = new Date().toISOString();
        const path = request.url;
        return this.formatResponse(data, statusCode, timestamp, path);
      }),
    );
  }

  private formatResponse(
    data: T,
    statusCode: number,
    timestamp: string,
    path: string,
  ): ApiResponse<T> {
    const isSuccess = statusCode >= 200 && statusCode < 300;
    const message = this.getMessageByStatusCode(statusCode, data);

    // 基础响应结构
    const baseResponse: ApiResponse<T> = {
      success: isSuccess,
      statusCode,
      message,
      timestamp,
      path,
    };

    // 处理数据
    if (isSuccess) {
      if (data && typeof data === 'object' && 'message' in data) {
        // 如果数据中包含message字段，提取其他字段作为data
        const dataObj = data as Record<string, unknown>;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message, ...restData } = dataObj;
        baseResponse.data =
          Object.keys(restData).length > 0 ? (restData as T) : undefined;
      } else {
        baseResponse.data = data;
      }
    } else {
      // 错误响应
      if (data && typeof data === 'object' && 'data' in data) {
        const dataObj = data as Record<string, unknown>;
        baseResponse.data = dataObj.data as T;
      } else {
        baseResponse.data = data;
      }
    }

    return baseResponse;
  }

  private getMessageByStatusCode(statusCode: number, data?: T): string {
    // 如果数据中有message字段，优先使用
    if (data && typeof data === 'object' && 'message' in data) {
      const dataObj = data as Record<string, unknown>;
      if (typeof dataObj.message === 'string') {
        return dataObj.message;
      }
    }

    // 根据状态码返回默认消息
    switch (statusCode) {
      case STATUS_CODES.OK:
        return MESSAGES.SUCCESS;
      case STATUS_CODES.CREATED:
        return MESSAGES.USER_CREATED;
      case STATUS_CODES.NO_CONTENT:
        return '操作成功，无返回内容';
      case STATUS_CODES.BAD_REQUEST:
        return MESSAGES.VALIDATION_ERROR;
      case STATUS_CODES.UNAUTHORIZED:
        return MESSAGES.UNAUTHORIZED;
      case STATUS_CODES.FORBIDDEN:
        return '权限不足';
      case STATUS_CODES.NOT_FOUND:
        return MESSAGES.USER_NOT_FOUND;
      case STATUS_CODES.CONFLICT:
        return MESSAGES.USER_ALREADY_EXISTS;
      case STATUS_CODES.UNPROCESSABLE_ENTITY:
        return '数据验证失败';
      case STATUS_CODES.INTERNAL_SERVER_ERROR:
        return MESSAGES.INTERNAL_ERROR;
      default:
        return '未知错误';
    }
  }
}
