/*
 * @Author: changcheng 364000100@#qq.com
 * @Date: 2025-07-05 12:55:00
 * @LastEditors: changcheng 364000100@#qq.com
 * @LastEditTime: 2025-07-31 17:52:19
 * @FilePath: /myself-space/nestjs/export-swagger.js
 * @Description: 导出 Swagger 文档
 */

const fs = require('fs');
const path = require('path');

// 从 Swagger UI 获取 OpenAPI 规范
async function exportSwagger() {
  try {
    const baseUrl = 'http://127.0.0.1:3000'; // 你的应用端口
    const swaggerUrl = `${baseUrl}/api-json`; // Swagger JSON 端点

    console.log('正在获取 Swagger 文档...');
    console.log(`请求地址: ${swaggerUrl}`);

    // 使用 fetch 获取 Swagger JSON
    const response = await fetch(swaggerUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const swaggerJson = await response.json();

    // 保存为 JSON 文件
    const jsonPath = path.join(__dirname, 'swagger-docs.json');
    fs.writeFileSync(jsonPath, JSON.stringify(swaggerJson, null, 2));
    console.log(`✅ Swagger JSON 已导出到: ${jsonPath}`);
    console.log('\n📖 Swagger UI 地址:');
    console.log(`${baseUrl}/api`);
  } catch (error) {
    console.error('❌ 导出失败:', error.message);
    console.log('\n💡 请确保:');
    console.log('1. 应用正在运行 (npm run start:dev)');
    console.log('2. 端口配置正确 (默认 3000)');
    console.log('3. Swagger 已正确配置');
  }
}

// 运行导出
exportSwagger();
