# 使用Node.js官方镜像
FROM node:20-alpine

RUN npm config set registry https://registry.npmmirror.com

# 安装 pnpm 和 pm2
RUN npm install -g pnpm pm2

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 构建项目
RUN pnpm run build

# 创建日志目录
RUN mkdir -p logs

# 暴露端口
EXPOSE 3000

# 使用PM2启动应用
CMD ["pm2-runtime", "dist/src/main.js"]
