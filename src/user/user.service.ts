/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-04-23 17:18:14
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-05-07 14:17:50
 * @FilePath: /mvw_project/Users/changcheng/Desktop/nestjs/src/user/user.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entites/user.entity';
import { UpdateResult } from 'typeorm';
import { CommonService } from '../common/services/common.service';
import { ModuleRef } from '@nestjs/core';
import { OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { Logs } from '../entites/logs.entity';
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    private CommonService: CommonService,
    private moduleRef: ModuleRef,
    private discoveryService: DiscoveryService,
  ) {}
  // 在模块初始化时，调用
  onModuleInit() {
    // 获取所有提供者
    // const providers = this.discoveryService.getProviders();
    // // 遍历providers
    // providers.forEach((provider) => {
    //   console.log('provider 获取所有提供者', provider.name);
    // });
    // // 获取所有控制器
    // const controllers: any = this.discoveryService.getControllers();
    // console.log('controllers 获取所有控制器', controllers);
    this.CommonService.logParentName('传入的值');
  }
  // 在应用关闭时，调用
  onApplicationShutdown(signal: string) {
    console.log(signal); // e.g. "SIGINT"
  }
  async findAll() {
    return this.usersRepository.find();
  }
  async find(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
  async create(user: User) {
    const userTmp = this.usersRepository.create(user);
    return this.usersRepository.save(userTmp);
  }
  async update(id: number, user: Partial<User>): Promise<UpdateResult> {
    return this.usersRepository.update(id, user);
  }
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
  async findProfile(id: number) {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
      // 关联查询，这里会增加profile的字段
      // relations: ['profile'],
    });
  }
  async findUserLogs(id: number) {
    const user: User = (await this.find(id)) as User;
    return this.logsRepository.find({
      where: {
        user,
      },
      // 关联查询，这里会增加user的字段
      // relations: {
      //   user: true,
      // },
    });
  }
  async findLogsGroupBy(id: number): Promise<Logs[]> {
    return this.logsRepository
      .createQueryBuilder('logs') // 创建查询构建器，使用logs作为别名
      .select('logs.result', 'result') // 选择logs表中的result字段，并命名为result
      .addSelect('COUNT(logs.result)', 'count') // 添加选择，计算result字段的数量，并命名为count
      .leftJoin('logs.user', 'user') // 左连接logs表的user关联，使用user作为别名
      .where('user.id = :id', { id }) // 设置where条件，匹配user.id等于传入的id参数
      .groupBy('logs.result') // 按logs.result字段分组
      .orderBy('logs.result', 'DESC') // 按logs.result字段排序
      .addOrderBy('COUNT(logs.result)', 'DESC') // 按logs.createdAt字段排序
      .limit(10) // 设置限制
      .getRawMany(); // 执行查询并返回原始结果数组
    // [{"result":"200","count":"1"},...]
    // 使用原生sql查询
    // return this.logsRepository.query('SELECT * FROM logs') as Promise<Logs[]>;
  }
}
