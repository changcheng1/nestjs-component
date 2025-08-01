## create nest-cli

```javaScript

$ npm i -g @nestjs/cli
$ nest new project-name

```

## nest create module 

generate crud Module

```javaScript

# 创建模块
nest g module module-name

# 创建控制器
nest g controller controller-name

# 创建服务
nest g service service-name

# 创建资源（包含 CRUD 操作）
nest g resource resource-name

# 创建中间件
nest g middleware middleware-name

# 创建拦截器
nest g interceptor interceptor-name

# 创建过滤器
nest g filter filter-name

# 创建管道
nest g pipe pipe-name

# 创建守卫
nest g guard guard-name

# 创建装饰器
nest g decorator decorator-name

```

# NestJS 生命周期详解

## 生命周期图示

```
┌─────────────────────────────────────────────────────────────────┐
│                        HTTP 请求到达                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        1. 中间件 (Middleware)                     │
│  • 全局中间件                                                    │
│  • 模块中间件                                                    │
│  • 路由中间件                                                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        2. 守卫 (Guards)                          │
│  • 全局守卫                                                      │
│  • 控制器守卫                                                    │
│  • 路由守卫                                                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    3. 拦截器 (Interceptors)                       │
│  • 全局拦截器(前)                                               │
│  • 路由拦截器(前)                                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        4. 管道 (Pipes)                           │
│  • 全局管道                                                    │
│  • 路由管道                                                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    5. 路由处理器 (Route Handler)                  │
│  • Controller方法执行                                           │
│  • Service方法调用                                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    6. 拦截器 (Interceptors)                       │
│  • 路由拦截器(后)                                               │
│  • 全局拦截器(后)                                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    7. 异常过滤器 (Exception Filters)              │
│  • 仅在异常发生时执行                                           │
│  • 方法级 → 控制器级 → 全局级                                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        响应发送给客户端                            │
└─────────────────────────────────────────────────────────────────┘
```

## 详细代码示例

### 1. 中间件 (Middleware)

```typescript
// src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('🔵 中间件执行 - 请求开始');
    console.log(`📝 ${req.method} ${req.url}`);
    
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`🔵 中间件执行 - 请求结束 (${duration}ms)`);
    });
    
    next();
  }
}

// 函数式中间件
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log('🔵 函数式中间件执行');
  res.header('Access-Control-Allow-Origin', '*');
  next();
}
```

### 2. 守卫 (Guards)

```typescript
// src/common/guards/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('🟡 守卫执行 - 身份验证');
    
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    
    if (!token) {
      console.log('🟡 守卫执行 - 认证失败');
      throw new UnauthorizedException('未提供认证令牌');
    }
    
    console.log('🟡 守卫执行 - 认证成功');
    return true;
  }
}

// 角色守卫
@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('🟡 角色守卫执行');
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user || !user.roles.includes('admin')) {
      throw new UnauthorizedException('权限不足');
    }
    
    return true;
  }
}
```

### 3. 拦截器 (Interceptors)

```typescript
// src/common/interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('🟢 拦截器执行(前) - 开始处理');
    
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        console.log(`🟢 拦截器执行(后) - ${method} ${url} (${duration}ms)`);
      }),
      catchError(error => {
        console.log('🟢 拦截器执行(后) - 捕获到异常');
        throw error;
      })
    );
  }
}

// 响应转换拦截器
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('🟢 响应转换拦截器执行(前)');
    
    return next.handle().pipe(
      map(data => {
        console.log('🟢 响应转换拦截器执行(后) - 转换响应数据');
        return {
          success: true,
          data,
          timestamp: new Date().toISOString()
        };
      })
    );
  }
}
```

### 4. 管道 (Pipes)

```typescript
// src/common/pipes/validation.pipe.ts
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: any) {
    console.log('🟣 管道执行 - 数据验证');
    
    if (!value) {
      console.log('🟣 管道执行 - 验证失败');
      throw new BadRequestException('数据不能为空');
    }
    
    console.log('🟣 管道执行 - 验证成功');
    return value;
  }
}

// 转换管道
@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: any) {
    console.log('🟣 管道执行 - 类型转换');
    
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      throw new BadRequestException('无效的数字格式');
    }
    
    return parsed;
  }
}
```

### 5. 路由处理器 (Route Handler)

```typescript
// src/modules/user/user.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import { ValidationPipe } from '../../common/pipes/validation.pipe';

@Controller('user')
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UsePipes(ValidationPipe)
  async findUser(@Param('id') id: string) {
    console.log('🟠 路由处理器执行 - 查找用户');
    return await this.userService.findUser(+id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUser(@Body() userData: any) {
    console.log('🟠 路由处理器执行 - 创建用户');
    return await this.userService.createUser(userData);
  }
}
```

### 6. 异常过滤器 (Exception Filters)

```typescript
// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('🔴 异常过滤器执行');
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    };

    console.log('🔴 异常过滤器执行 - 返回错误响应');
    response.status(status).json(errorResponse);
  }
}

// TypeORM异常过滤器
@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    console.log('🔴 TypeORM异常过滤器执行');
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = 500;
    let message = '数据库操作失败';
    
    if (exception instanceof QueryFailedError) {
      const driverError = exception.driverError as any;
      
      switch (driverError.code) {
        case 'ER_DUP_ENTRY':
          status = 409;
          message = '数据已存在';
          break;
        case 'ER_NO_REFERENCED_ROW':
          status = 400;
          message = '引用的数据不存在';
          break;
      }
    }
    
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

## 完整配置示例

### 1. 全局配置 (main.ts)

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局中间件
  app.use(corsMiddleware);
  
  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // 全局拦截器
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  // 全局管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  await app.listen(3000);
}
bootstrap();
```

### 2. 模块配置

```typescript
// src/modules/user/user.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoggerMiddleware } from '../../common/middleware/logger.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('user/*');
  }
}
```

### 3. 控制器配置

```typescript
// src/modules/user/user.controller.ts
import { Controller, Get, Post, UseGuards, UseInterceptors, UseFilters } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import { TypeOrmExceptionFilter } from '../../common/filters/typeorm-exception.filter';

@Controller('user')
@UseGuards(AuthGuard)                    // 控制器级守卫
@UseInterceptors(LoggingInterceptor)     // 控制器级拦截器
@UseFilters(TypeOrmExceptionFilter)      // 控制器级过滤器
export class UserController {
  
  @Get(':id')
  @UseGuards(RoleGuard)                  // 路由级守卫
  async findUser(@Param('id') id: string) {
    return await this.userService.findUser(+id);
  }
  
  @Post()
  @UseFilters(ValidationExceptionFilter) // 路由级过滤器
  async createUser(@Body() userData: any) {
    return await this.userService.createUser(userData);
  }
}
```

## 执行顺序总结

### 正常请求流程：
1. 🔵 **中间件** - 请求预处理
2. 🟡 **守卫** - 身份验证和授权
3. 🟢 **拦截器(前)** - 请求处理前
4. 🟣 **管道** - 数据验证和转换
5. 🟠 **路由处理器** - 业务逻辑执行
6. 🟢 **拦截器(后)** - 响应处理后
7. 📤 **响应发送** - 返回给客户端

### 异常请求流程：
1. 🔵 **中间件** - 请求预处理
2. 🟡 **守卫** - 身份验证和授权
3. 🟢 **拦截器(前)** - 请求处理前
4. 🟣 **管道** - 数据验证和转换
5. 🟠 **路由处理器** - 发生异常
6. 🔴 **异常过滤器** - 异常处理
7. 📤 **错误响应发送** - 返回错误信息

## 最佳实践

1. **中间件**：用于日志记录、CORS、请求预处理
2. **守卫**：用于身份验证、权限控制
3. **拦截器**：用于日志记录、响应转换、性能监控
4. **管道**：用于数据验证、类型转换
5. **过滤器**：用于异常处理和错误响应标准化

这个生命周期确保了请求的每个阶段都能被正确处理和监控。 