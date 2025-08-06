#!/bin/bash

SERVER="root@39.107.246.96"

echo "🔧 修复网络访问问题..."

# 首先测试本地网络连通性
echo "🌐 测试服务器连通性..."
if ping -c 3 39.107.246.96 > /dev/null 2>&1; then
    echo "✅ 服务器可以ping通"
else
    echo "❌ 服务器无法ping通，请检查网络连接"
    exit 1
fi

# 测试端口连通性
echo "🔌 测试端口3000连通性..."
if timeout 5 bash -c "</dev/tcp/39.107.246.96/3000" 2>/dev/null; then
    echo "✅ 端口3000可以连接"
else
    echo "❌ 端口3000无法连接，可能是安全组问题"
fi

# 在服务器上进行详细检查和修复
ssh -o "StrictHostKeyChecking=no" $SERVER << 'EOF'
    echo "🔍 详细网络诊断..."
    
    echo "=== 检查应用是否在正确端口监听 ==="
    netstat -tlnp | grep 3000
    
    echo ""
    echo "=== 检查Docker端口映射 ==="
    docker port nestjs-app
    
    echo ""
    echo "=== 测试应用响应 ==="
    echo "测试根路径:"
    curl -s http://localhost:3000/api/v1/ | head -3
    
    echo ""
    echo "测试健康检查:"
    curl -s http://localhost:3000/api/v1/health | head -3
    
    echo ""
    echo "测试Swagger文档:"
    curl -s -o /dev/null -w "Swagger文档状态码: %{http_code}\n" http://localhost:3000/api
    
    echo ""
    echo "=== 检查系统防火墙 ==="
    # 检查ufw
    if command -v ufw >/dev/null 2>&1; then
        echo "UFW状态:"
        ufw status
    fi
    
    # 检查iptables
    echo "iptables规则:"
    iptables -L INPUT -n | head -10
    
    echo ""
    echo "=== 尝试开放端口（如果需要）==="
    # 确保ufw允许3000端口
    if command -v ufw >/dev/null 2>&1; then
        ufw allow 3000/tcp 2>/dev/null || echo "UFW规则可能已存在"
    fi
    
    echo ""
    echo "=== 检查Docker网络 ==="
    docker network ls
    docker inspect bridge | grep -A 10 -B 5 "nestjs-app" || echo "未找到容器网络信息"
    
    echo ""
    echo "=== 重启容器以确保网络配置正确 ==="
    echo "重启应用容器..."
    docker restart nestjs-app
    
    echo "等待应用重启..."
    sleep 15
    
    echo "检查重启后状态:"
    docker ps | grep nestjs-app
    
    echo ""
    echo "=== 最终测试 ==="
    for i in {1..5}; do
        if curl -s http://localhost:3000/api/v1/health > /dev/null 2>&1; then
            echo "✅ 应用重启后工作正常"
            break
        else
            echo "⏳ 等待应用启动... ($i/5)"
            sleep 5
        fi
    done
    
    echo ""
    echo "=== 网络配置总结 ==="
    echo "监听端口:"
    netstat -tlnp | grep -E "(3000|3001)"
    echo ""
    echo "Docker端口映射:"
    docker port nestjs-app
    echo ""
    echo "容器状态:"
    docker ps | grep nestjs
EOF

echo ""
echo "🔧 网络访问修复完成！"
echo ""
echo "📋 如果仍然无法外网访问，请检查："
echo "1. 阿里云ECS安全组是否开放了3000端口"
echo "2. 在阿里云控制台 -> ECS -> 安全组 -> 配置规则"
echo "3. 添加入方向规则：协议类型TCP，端口范围3000/3000，授权对象0.0.0.0/0"
echo ""
echo "📱 测试访问："
echo "   curl http://39.107.246.96:3000/api/v1/"
echo "   curl http://39.107.246.96:3000/api/v1/health"
echo "   浏览器访问: http://39.107.246.96:3000/api"