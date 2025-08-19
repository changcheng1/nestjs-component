/*
 * @Author: changcheng 364000100@qq.com
 * @Date: 2025-08-19 16:30:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-19 18:36:44
 * @FilePath: /myself-space/nestjs/src/modules/auth/casl/index.ts
 * @Description: CASL 权限验证模块导出
 */

export { CaslGuard } from './casl.guard';
export { CaslAbilityFactory } from './casl-ability.factory';
export {
  CheckPolicies,
  CanRead,
  CanCreate,
  CanUpdate,
  CanDelete,
} from './casl.decorator';
