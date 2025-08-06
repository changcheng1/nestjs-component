#!/bin/bash

SERVER="root@39.107.246.96"

echo "🔍 检查服务器状态..."

ssh -o "StrictHostKeyChecking=no" $SERVER << 'EOF'
    echo "=== Docker 容器状态 ==="
    docker ps -a
    
    echo ""
    echo "=== 端口监听状态 ==="
    netstat -tlnp | grep -E "(3000|3001|80|443)"
    
    echo ""
    echo "=== 应用日志（最新30行）==="
    docker logs nestjs-app 2>/dev/null | tail -30 || echo "应用容器不存在或未启动"
    
    echo ""
    echo "=== 数据库日志（最新10行）==="
    docker logs nestjs-mysql 2>/dev/null | tail -10 || echo "数据库容器不存在或未启动"
    
    echo ""
    echo "=== 本地测试访问 ==="
    echo "测试 localhost:3000:"
    curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" http://localhost:3000/ 2>/dev/null || echo "连接失败"
    
    echo "测试 localhost:3000/api:"
    curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" http://localhost:3000/api 2>/dev/null || echo "连接失败"
    
    echo "测试 localhost:3000/api/v1:"
    curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" http://localhost:3000/api/v1/ 2>/dev/null || echo "连接失败"
    
    echo ""
    echo "=== 防火墙状态 ==="
    ufw status 2>/dev/null || iptables -L INPUT -n | head -10 2>/dev/null || echo "无法检查防火墙状态"
    
    echo ""
    echo "=== 系统资源使用情况 ==="
    free -h
    df -h /
    
    echo ""
    echo "=== Docker 镜像 ==="
    docker images | grep nestjs
EOF