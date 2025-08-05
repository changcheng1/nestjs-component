/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-01 19:35:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-01 19:25:02
 * @FilePath: /myself-space/nestjs/src/modules/auth/casl/casl-usage.example.ts
 * @Description: CASL 使用示例
 */

// 示例：如何在控制器中使用 CASL 权限控制

/*
import { Controller, Get, Post, Put, Delete, UseGuards, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CaslGuard } from './casl.guard';
import { CheckPolicies, CanRead, CanCreate, CanUpdate, CanDelete } from './casl.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, CaslGuard)
export class UserController {
  
  constructor(private userService: UserService) {}

  // 检查用户是否可以读取用户信息
  @Get()
  @CheckPolicies(CanRead('User'))
  findAll() {
    return this.userService.findAll();
  }

  // 检查用户是否可以创建用户
  @Post()
  @CheckPolicies(CanCreate('User'))
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // 检查用户是否可以更新用户信息
  @Put(':id')
  @CheckPolicies(CanUpdate('User'))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  // 检查用户是否可以删除用户
  @Delete(':id')
  @CheckPolicies(CanDelete('User'))
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  // 自定义策略：检查用户是否可以管理所有资源
  @Get('admin')
  @CheckPolicies((ability) => ability.can('manage', 'all'))
  adminOnly() {
    return this.userService.getAdminData();
  }

  // 自定义策略：检查用户是否可以读取自己的信息
  @Get('profile')
  @CheckPolicies((ability, request) => {
    const userId = request.params.id || request.user.id;
    return ability.can('read', 'User', { id: userId });
  })
  getProfile(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // 多个权限要求
  @Get('dashboard')
  @CheckPolicies(
    CanRead('User'),
    CanRead('Profile'),
    (ability) => ability.can('read', 'Menu')
  )
  getDashboard() {
    return this.userService.getDashboardData();
  }
}
*/

// 权限配置说明
export const CASL_PERMISSIONS_CONFIG = {
  // 管理员权限
  ADMIN: {
    description: '管理员可以做任何事',
    permissions: ['manage:all'],
  },

  // 普通用户权限
  USER: {
    description: '普通用户可以管理自己的信息，查看公开内容',
    permissions: [
      'read:User',
      'update:User',
      'read:Role',
      'read:Profile',
      'create:Profile',
      'update:Profile',
      'read:Institution',
      'read:Menu',
    ],
    restrictions: ['delete:User', 'create:User', 'delete:Profile'],
  },

  // 访客权限
  GUEST: {
    description: '访客只能查看公开信息',
    permissions: ['read:Institution', 'read:Menu'],
    restrictions: ['create:all', 'update:all', 'delete:all'],
  },
};

// 使用指南
export const CASL_USAGE_GUIDE = `
## CASL 权限系统使用指南

### 1. 基本设置
在控制器上添加守卫：
@UseGuards(JwtAuthGuard, CaslGuard)

### 2. 权限装饰器
- @CheckPolicies(CanRead('User')) - 检查读取权限
- @CheckPolicies(CanCreate('User')) - 检查创建权限
- @CheckPolicies(CanUpdate('User')) - 检查更新权限
- @CheckPolicies(CanDelete('User')) - 检查删除权限

### 3. 自定义策略
@CheckPolicies((ability, request) => {
  return ability.can('read', 'User', { id: request.user.id });
})

### 4. 多个权限要求
@CheckPolicies(
  CanRead('User'),
  CanRead('Profile'),
  (ability) => ability.can('read', 'Menu')
)

### 5. 权限检查流程
1. 用户请求到达控制器
2. JwtAuthGuard 验证用户身份
3. CaslGuard 检查权限装饰器
4. CaslAbilityFactory 创建用户权限能力
5. 执行权限检查
6. 通过则执行控制器方法，否则返回 403

### 6. 错误处理
- 401 Unauthorized: 用户未认证
- 403 Forbidden: 权限不足
- 500 Internal Server Error: 权限检查失败
`;
