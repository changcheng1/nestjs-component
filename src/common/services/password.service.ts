/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-05 11:30:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-05 13:37:53
 * @FilePath: /myself-space/nestjs/src/common/services/password.service.ts
 * @Description: 密码加密服务
 */
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  /**
   * 使用 Argon2 加密密码
   * @param password 明文密码
   * @returns 加密后的密码哈希
   */
  async hashPassword(password: string): Promise<string> {
    try {
      // 使用 Argon2id 算法，这是最安全的变体
      const hash = await argon2.hash(password, {
        type: argon2.argon2id, // 使用 Argon2id 算法
        memoryCost: 2 ** 16, // 64MB 内存成本
        timeCost: 3, // 3 次迭代
        parallelism: 1, // 1 个线程
      });
      return hash;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new Error(`密码加密失败: ${errorMessage}`);
    }
  }

  /**
   * 验证密码
   * @param password 明文密码
   * @param hash 加密后的密码哈希
   * @returns 是否匹配
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      // 添加参数验证 - 检查是否为字符串类型且不为空
      if (
        typeof password !== 'string' ||
        typeof hash !== 'string' ||
        password.length === 0 ||
        hash.length === 0
      ) {
        console.error('密码验证失败: 参数无效', {
          passwordType: typeof password,
          passwordLength: password?.length,
          hashType: typeof hash,
          hashLength: hash?.length,
        });
        return false;
      }

      console.log('验证密码:', {
        passwordLength: password.length,
        hashLength: hash.length,
      });
      return await argon2.verify(hash, password);
    } catch (error) {
      console.error('密码验证失败:', error);
      return false;
    }
  }

  /**
   * 检查密码是否需要重新哈希（当算法参数更新时）
   * @param hash 当前的密码哈希
   * @returns 是否需要重新哈希
   */
  needsRehash(hash: string): boolean {
    try {
      return argon2.needsRehash(hash, {
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });
    } catch (error) {
      console.error('检查密码重哈希失败:', error);
      return false;
    }
  }
}
