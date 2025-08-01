/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:30:57
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-12 13:51:56
 * @FilePath: /myself-space/nestjs/src/utils/constants/messages.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const MESSAGES = {
  // 用户相关
  USER_CREATED: '用户创建成功',
  USER_UPDATED: '用户更新成功',
  USER_DELETED: '用户删除成功',
  USER_NOT_FOUND: '用户不存在',
  USER_ALREADY_EXISTS: '用户已存在',

  // 认证相关
  LOGIN_SUCCESS: '登录成功',
  LOGIN_FAILED: '登录失败',
  REGISTER_SUCCESS: '注册成功',
  REGISTER_FAILED: '注册失败',
  INVALID_CREDENTIALS: '用户名或密码错误',
  TOKEN_EXPIRED: '令牌已过期',
  UNAUTHORIZED: '未授权访问',

  // 角色相关
  ROLE_CREATED: '角色创建成功',
  ROLE_UPDATED: '角色更新成功',
  ROLE_DELETED: '角色删除成功',
  ROLE_NOT_FOUND: '角色不存在',

  // 资料相关
  PROFILE_CREATED: '资料创建成功',
  PROFILE_UPDATED: '资料更新成功',
  PROFILE_DELETED: '资料删除成功',
  PROFILE_NOT_FOUND: '资料不存在',

  // 日志相关
  LOG_CREATED: '日志创建成功',
  LOG_NOT_FOUND: '日志不存在',

  // 通用
  SUCCESS: '操作成功',
  FAILED: '操作失败',
  VALIDATION_ERROR: '数据验证失败',
  INTERNAL_ERROR: '服务器内部错误',
} as const;
