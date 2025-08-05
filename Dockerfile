# 使用Node.js官方镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# Install the application dependencies
RUN npm install

# 复制项目文件
COPY . .

# 构建项目（如果需要编译TypeScript）
RUN npm run build

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["node", "dist/src/main.js"]
