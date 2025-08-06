#!/bin/bash

# 修复健康检查的部署脚本
SERVER="root@39.107.246.96"
APP_DIR="/opt/nestjs-app"
IMAGE_NAME="nestjs-app"
IMAGE_TAG="latest"

echo "🚀 开始健康检查修复版本部署..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

# 检查必要文件
required_files=("Dockerfile" "package.json")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 缺少文件: $file"
        exit 1
    fi
done

echo "✅ 本地文件检查通过"

# 本地构建Docker镜像（指定平台架构）
echo "🔨 本地构建Docker镜像（指定linux/amd64架构）..."
docker build --platform linux/amd64 -t $IMAGE_NAME:$IMAGE_TAG . --no-cache

if [ $? -ne 0 ]; then
    echo "❌ Docker镜像构建失败"
    exit 1
fi

echo "✅ Docker镜像构建成功"

# 保存镜像为tar文件
echo "📦 导出Docker镜像..."
docker save -o ${IMAGE_NAME}.tar $IMAGE_NAME:$IMAGE_TAG

if [ $? -ne 0 ]; then
    echo "❌ Docker镜像导出失败"
    exit 1
fi

echo "✅ Docker镜像导出成功"

# 上传镜像到服务器
echo "📤 上传Docker镜像到服务器..."
scp -o "StrictHostKeyChecking=no" ${IMAGE_NAME}.tar $SERVER:/tmp/

if [ $? -ne 0 ]; then
    echo "❌ 镜像上传失败"
    rm ${IMAGE_NAME}.tar
    exit 1
fi

echo "✅ 镜像上传成功"

# 在服务器上部署
echo "🚀 在服务器上执行部署..."
ssh -o "StrictHostKeyChecking=no" $SERVER << EOF
    echo "📁 创建应用目录..."
    mkdir -p $APP_DIR
    cd $APP_DIR
    
    echo "🛑 停止并清理现有容器..."
    docker stop \$(docker ps -q --filter "name=nestjs") 2>/dev/null || true
    docker rm \$(docker ps -aq --filter "name=nestjs") 2>/dev/null || true
    
    echo "🧹 清理旧镜像..."
    docker rmi $IMAGE_NAME:$IMAGE_TAG 2>/dev/null || true
    
    echo "📦 加载新的Docker镜像..."
    docker load -i /tmp/${IMAGE_NAME}.tar
    
    if [ \$? -ne 0 ]; then
        echo "❌ Docker镜像加载失败"
        exit 1
    fi
    
    echo "✅ Docker镜像加载成功"
    
    echo "🗄️ 启动MySQL数据库..."
    docker run -d \\
        --name nestjs-mysql \\
        --platform linux/amd64 \\
        -p 127.0.0.1:3306:3306 \\
        -e MYSQL_ROOT_PASSWORD=000000 \\
        -e MYSQL_DATABASE=nestjsdb \\
        -e MYSQL_USER=nestjs \\
        -e MYSQL_PASSWORD=000000 \\
        -v nestjs_mysql_data:/var/lib/mysql \\
        --restart unless-stopped \\
        mysql:8.0 \\
        --default-authentication-plugin=mysql_native_password
    
    echo "⏳ 等待数据库启动..."
    sleep 30
    
    echo "🚀 启动应用容器..."
    docker run -d \\
        --name nestjs-app \\
        --platform linux/amd64 \\
        --link nestjs-mysql:database \\
        -p 3000:3001 \\
        -e NODE_ENV=production \\
        -e DB_HOST=database \\
        -e DB_PORT=3306 \\
        -e DB_USERNAME=nestjs \\
        -e DB_PASSWORD=000000 \\
        -e DB_DATABASE=nestjsdb \\
        --restart unless-stopped \\
        $IMAGE_NAME:$IMAGE_TAG
    
    if [ \$? -ne 0 ]; then
        echo "❌ 应用容器启动失败"
        docker logs nestjs-app
        exit 1
    fi
    
    echo "⏳ 等待应用启动..."
    sleep 45
    
    echo "📊 检查容器状态..."
    docker ps
    
    echo "📋 查看应用日志..."
    docker logs nestjs-app | tail -30
    
    echo "🏥 检查应用健康状态..."
    for i in {1..10}; do
        # 尝试多个端点
        if curl -f http://localhost:3000/api/v1/health > /dev/null 2>&1; then
            echo "✅ 应用健康检查通过（/api/v1/health）！"
            break
        elif curl -f http://localhost:3000/api/v1/ > /dev/null 2>&1; then
            echo "✅ 应用根路径访问成功（/api/v1/）！"
            break
        elif curl -f http://localhost:3000/ > /dev/null 2>&1; then
            echo "✅ 应用根路径访问成功（/）！"
            break
        else
            echo "⏳ 等待应用启动... (\$i/10)"
            if [ \$i -eq 5 ]; then
                echo "📋 中途检查应用日志："
                docker logs nestjs-app | tail -20
                echo "🔍 测试不同端点："
                echo "测试 /api/v1/health:"
                curl -v http://localhost:3000/api/v1/health 2>&1 | head -10 || true
                echo "测试 /api/v1/:"
                curl -v http://localhost:3000/api/v1/ 2>&1 | head -10 || true
            fi
            if [ \$i -eq 10 ]; then
                echo "❌ 应用启动失败，完整诊断："
                echo "=== 应用日志 ==="
                docker logs nestjs-app
                echo "=== 数据库日志 ==="
                docker logs nestjs-mysql | tail -20
                echo "=== 容器状态 ==="
                docker ps -a
                echo "=== 端口检查 ==="
                netstat -tlnp | grep 3000 || true
                echo "=== 手动测试端点 ==="
                curl -v http://localhost:3000/ 2>&1 || true
                curl -v http://localhost:3000/api/v1/ 2>&1 || true
                curl -v http://localhost:3000/api/v1/health 2>&1 || true
            else
                sleep 15
            fi
        fi
    done
    
    echo "🧹 清理临时文件..."
    rm /tmp/${IMAGE_NAME}.tar
    
    echo "🎉 服务器部署完成！"
EOF

# 清理本地文件
rm ${IMAGE_NAME}.tar

echo ""
echo "📱 应用访问地址:"
echo "   根路径: http://39.107.246.96:3000/api/v1/"
echo "   健康检查: http://39.107.246.96:3000/api/v1/health"
echo "   Swagger文档: http://39.107.246.96:3000/api"
echo ""
echo "🔧 管理命令："
echo "   查看应用日志: ssh root@39.107.246.96 'docker logs -f nestjs-app'"
echo "   查看数据库日志: ssh root@39.107.246.96 'docker logs -f nestjs-mysql'"
echo "   重启应用: ssh root@39.107.246.96 'docker restart nestjs-app'"
echo "   进入应用容器: ssh root@39.107.246.96 'docker exec -it nestjs-app sh'"
echo "   查看容器状态: ssh root@39.107.246.96 'docker ps -a'"
echo ""
echo "🧪 测试命令："
echo "   curl http://39.107.246.96:3000/api/v1/"
echo "   curl http://39.107.246.96:3000/api/v1/health"
echo "✅ 部署脚本执行完成！"