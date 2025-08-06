<!--
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-08-06 11:35:20
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-08-06 18:48:16
 * @FilePath: /myself-space/nestjs/README.md
 * @Description: NestJS Docker 部署指南
-->

# NestJS Docker 部署指南

## 📋 目录
- [本地开发](#本地开发)
- [服务器部署](#服务器部署)
- [Docker Compose 管理](#docker-compose-管理)
- [故障排除](#故障排除)
- [常用命令](#常用命令)

## 🚀 本地开发

### 启动Docker Desktop
```bash
open -a Docker
```

### 构建镜像
```bash
docker build -t nestjs .
```

### 使用Docker Compose本地运行
```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 🌐 服务器部署

### 本地打包项目
```bash
# 进入项目根目录
cd /Users/changcheng/Downloads/myself-space

# 打包项目（排除不必要的文件）
tar -czf nestjs-deploy.tar.gz \
  --exclude=nestjs/node_modules \
  --exclude=nestjs/.git \
  --exclude=nestjs/dist \
  --exclude=nestjs/logs \
  --exclude=nestjs/.DS_Store \
  nestjs/
```

### 上传到服务器
```bash
# 上传到服务器
scp nestjs-deploy.tar.gz root@39.107.246.96:/usr/
```

### 服务器端部署
```bash
# 登录服务器
ssh root@39.107.246.96

# 进入目录
cd /usr

# 解压项目
tar -xzf nestjs-deploy.tar.gz

# 进入项目目录
cd nestjs

# 构建镜像
docker build -t nestjs-pm2 .

# 启动服务
docker-compose up -d
```

## 🐳 Docker Compose 管理

### 基本操作
```bash
# 启动所有服务
docker-compose up -d

# 启动服务（前台运行，显示日志）
docker-compose up

# 重新构建并启动
docker-compose up -d --build

# 启动特定服务
docker-compose up -d web

# 停止所有服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v
```

### 服务管理
```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart web

# 暂停服务
docker-compose pause

# 恢复服务
docker-compose unpause
```

### 状态监控
```bash
# 查看服务状态
docker-compose ps

# 查看所有日志
docker-compose logs

# 查看特定服务日志
docker-compose logs web

# 实时查看日志
docker-compose logs -f web

# 查看数据库日志
docker-compose logs database
```

### 容器操作
```bash
# 进入应用容器
docker-compose exec web sh

# 进入数据库容器
docker-compose exec database mysql -u root -p

# 在容器内执行命令
docker-compose exec web npm run test

# 查看容器资源使用
docker stats
```

## 🔧 故障排除

### 端口冲突
```bash
# 检查端口占用
netstat -tlnp | grep :3000
netstat -tlnp | grep :3306

# 停止占用端口的进程
sudo kill -9 $(lsof -ti:3000)
sudo kill -9 $(lsof -ti:3306)
```

### 数据库连接问题
```bash
# 检查数据库容器状态
docker-compose logs database

# 测试数据库连接
docker-compose exec database mysql -u root -p000000 -e "SHOW DATABASES;"

# 重启数据库服务
docker-compose restart database
```

### 应用启动失败
```bash
# 查看应用日志
docker-compose logs web

# 重新构建镜像
docker-compose up -d --build

# 清理并重新启动
docker-compose down
docker system prune -f
docker-compose up -d
```

## 📝 常用命令

### Docker 命令
```bash
# 查看所有容器
docker ps -a

# 查看所有镜像
docker images

# 查看容器日志
docker logs 容器名

# 进入容器
docker exec -it 容器名 sh

# 删除容器
docker rm -f 容器名

# 删除镜像
docker rmi 镜像名

# 清理系统
docker system prune -a -f
```

### Docker Compose 命令
```bash
# 验证配置文件
docker-compose config

# 查看服务配置
docker-compose config --services

# 查看网络
docker network ls

# 查看数据卷
docker volume ls

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 🌍 访问地址

- **本地开发**: http://localhost:3000
- **服务器**: http://39.107.246.96:3000
- **API文档**: http://localhost:3000/api
- **健康检查**: http://localhost:3000/health

## 📊 监控和日志

### 查看实时日志
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看应用日志
docker-compose logs -f web

# 查看数据库日志
docker-compose logs -f database
```

### 性能监控
```bash
# 查看容器资源使用
docker stats

# 查看系统资源
top
htop
```

# 创建 Docker 配置文件
sudo mkdir -p /etc/docker

# 配置镜像源
vi /etc/docker/daemon.json 
{
  "registry-mirrors": [
    "https://dockerpull.org",
    "https://docker.1panel.dev",
    "https://docker.foreverlink.love",
    "https://docker.fxxk.dedyn.io",
    "https://docker.xn--6oq72ry9d5zx.cn",
    "https://docker.zhai.cm",
    "https://docker.5z5f.com",
    "https://a.ussh.net",
    "https://docker.cloudlayer.icu",
    "https://hub.littlediary.cn",
    "https://hub.crdz.gq",
    "https://docker.unsee.tech",
    "https://docker.kejilion.pro",
    "https://registry.dockermirror.com",
    "https://hub.rat.dev",
    "https://dhub.kubesre.xyz",
    "https://docker.nastool.de",
    "https://docker.udayun.com",
    "https://docker.rainbond.cc",
    "https://hub.geekery.cn",
    "https://docker.1panelproxy.com",
    "https://atomhub.openatom.cn",
    "https://docker.m.daocloud.io",
    "https://docker.1ms.run",
    "https://docker.linkedbus.com"
  ]
}

# 重启 Docker 服务
sudo systemctl restart docker

## 🔐 安全建议

1. **修改默认密码**: 生产环境请修改数据库密码
2. **限制端口访问**: 只开放必要的端口
3. **定期更新**: 及时更新Docker镜像和依赖
4. **备份数据**: 定期备份数据库数据

## 📞 技术支持

如遇到问题，请检查：
1. Docker服务是否正常运行
2. 端口是否被占用
3. 网络连接是否正常
4. 日志中的错误信息

---

**最后更新**: 2025-08-06
**版本**: 1.0.0