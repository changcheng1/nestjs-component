# 使用Node.js官方镜像，指定平台架构
FROM --platform=linux/amd64 node:20-alpine

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制项目文件
COPY . .

# 构建项目
RUN pnpm run build

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["node", "dist/src/main.js"]
