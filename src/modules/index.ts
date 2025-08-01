/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-12 13:31:23
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-31 20:04:53
 * @FilePath: /myself-space/nestjs/src/modules/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 认证模块
export * from './auth/auth.module';
export * from './auth/auth.controller';
export * from './auth/auth.service';

// 用户模块
export * from './user/user.module';
export * from './user/user.controller';
export * from './user/user.service';

// 资料模块
export * from './profile/profile.module';
export * from './profile/profile.controller';
export * from './profile/profile.service';

// 角色模块
export * from './role/role.module';
export * from './role/role.controller';
export * from './role/role.service';

// 日志模块
export * from './logs/logs.module';
export * from './logs/logs.controller';
export * from './logs/logs.service';

// 机构模块
export * from './institution/institution.module';
export * from './institution/institution.controller';
export * from './institution/institution.service';

// 菜单模块
export * from './menus/menus.module';
export * from './menus/menus.controller';
export * from './menus/menus.service';
