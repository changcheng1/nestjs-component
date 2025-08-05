#!/bin/bash
###
 # @Author: changcheng 364000100@#qq.com
 # @Date: 2025-08-04 20:56:43
 # @LastEditors: changcheng 364000100@#qq.com
 # @LastEditTime: 2025-08-04 21:08:41
 # @FilePath: /myself-space/nestjs/deploy.sh
 # @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
### 

# 部署脚本
set -e

echo "🚀 开始部署 NestJS 应用..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请启动 Docker"
    exit 1
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose -f docker-compose.yml down

# 清理旧镜像（可选）
echo "🧹 清理旧镜像..."
docker image prune -f

# 构建和启动服务
echo "🔨 构建并启动服务..."
docker-compose -f docker-compose.yml up --build -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose -f docker-compose.yml ps

# 显示日志
echo "📋 显示最近的日志..."
docker-compose -f docker-compose.yml logs --tail=50

echo "✅ 部署完成！"
echo "🌐 应用访问地址:"
echo "   - HTTP: http://localhost"
echo "   - API: http://localhost/api/v1"
echo "   - 健康检查: http://localhost/health"

# 显示有用的命令
echo ""
echo "📚 常用命令:"
echo "   查看日志: docker-compose -f docker-compose.yml logs -f"
echo "   停止服务: docker-compose -f docker-compose.yml down"
echo "   重启服务: docker-compose -f docker-compose.yml restart"
echo "   进入容器: docker-compose -f docker-compose.yml exec web sh"