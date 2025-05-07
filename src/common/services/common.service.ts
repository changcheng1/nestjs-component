/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 14:43:54
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-04-24 16:32:40
 * @FilePath: /mvw_project/Users/changcheng/Desktop/testjs-demo/src/common/services/common.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
@Injectable({
  // 设置作用域为瞬态作用域,
  // 在瞬态作用域下,每次注入都会创建新的实例
  // 其他模块可以通过在模块的providers中引入CommonService来使用
  // 例如: providers: [CommonService]
  // 然后在需要使用的类中通过constructor(private readonly commonService: CommonService)注入
  // parentClass 是在使用 CommonService 的类中通过依赖注入自动初始化的
  // 例如在 UserService 中:
  // constructor(
  //   @InjectRepository(User)
  //   private usersRepository: Repository<User>,
  //   private CommonService: CommonService,
  // ) {}
  // 当 UserService 被实例化时，NestJS 会自动创建 CommonService 的实例
  // 并通过 INQUIRER 令牌注入当前类的信息作为 parentClass
  scope: Scope.TRANSIENT,
})
export class CommonService {
  // INQUIRER 是 NestJS 提供的一个令牌，用于获取当前请求的上下文信息
  constructor(@Inject(INQUIRER) private name: string) {}
  // 共享的日志方法
  logParentName(message: string): void {
    console.log('parentClass', this.name);

    console.log(` name: ${this.name} ${message}`);
  }
}
