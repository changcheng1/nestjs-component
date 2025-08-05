#!/bin/bash
###
 # @Author: changcheng 364000100@#qq.com
 # @Date: 2025-08-04 20:57:05
 # @LastEditors: changcheng 364000100@#qq.com
 # @LastEditTime: 2025-08-04 21:08:53
 # @FilePath: /myself-space/nestjs/package-for-server.sh
 # @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
### 

# 打包用于服务器部署的文件
echo "📦 创建服务器部署包..."

# 创建部署目录
mkdir -p deploy-package

# 复制必要文件
cp Dockerfile deploy-package/
cp docker-compose.yml deploy-package/docker-compose.yml
cp -r nginx deploy-package/
cp -r mysql deploy-package/
cp package*.json deploy-package/
cp env.production.yml deploy-package/
cp deploy.sh deploy-package/
cp -r src deploy-package/
cp -r copy.ts deploy-package/
cp tsconfig*.json deploy-package/
cp nest-cli.json deploy-package/

# 创建 README
cat > deploy-package/README.md << 'EOF'
# NestJS 应用部署包

## 部署步骤

1. 确保服务器已安装 Docker 和 Docker Compose
2. 上传此部署包到服务器
3. 解压并进入目录
4. 运行部署脚本：`./deploy.sh`

## 配置

- 应用端口：80 (Nginx) 和 3001 (NestJS)
- 数据库端口：3306
- 环境变量可在 `env.production.yml` 中修改

## 管理命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 更新应用
docker-compose up --build -d
```
EOF

# 创建压缩包
tar -czf nestjs-deploy-$(date +%Y%m%d-%H%M%S).tar.gz deploy-package/

echo "✅ 部署包创建完成：nestjs-deploy-$(date +%Y%m%d-%H%M%S).tar.gz"
echo "📤 可以将此文件上传到服务器进行部署"

# 清理临时目录
rm -rf deploy-package