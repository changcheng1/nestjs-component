import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateContractDto {
  @IsString()
  name: string; // 员工姓名

  @IsString()
  department: string; // 部门

  @IsString()
  companyName: string; // 公司名称

  @IsDateString()
  startDate: string; // 入职日期

  @IsOptional()
  @IsDateString()
  actualEndDate?: string; // 实际结束日期

  @IsString()
  post: string; // 职位

  @IsString()
  workingHour: string; // 工作时间

  @IsString()
  cityName: string; // 城市名称

  @IsString()
  location: string; // 工作地点

  @IsNumber()
  probationPay: number; // 试用期工资

  @IsNumber()
  probationMeritPay: number; // 试用期绩效

  @IsNumber()
  salary: number; // 转正工资

  @IsNumber()
  meritPay: number; // 转正绩效
}

export class GenerateContractDto {
  @IsString()
  templateId: string; // 模板文件ID

  @IsString()
  tenantId: string; // 租户ID

  contractData: CreateContractDto; // 合同数据
}
