

---

# 🎨 Front AI Copilot for API

## **Overview**  
A modern frontend-powered, AI-assisted API collaboration tool that bridges the gap between backend API documentation and frontend integration. It offers **live API previews**, **auto-generated code snippets**, **visual debugging**, and **one-click Mock data** — making your development workflow faster, smarter, and smoother!

---

## ✨ Features

- **AI-Powered Suggestions**: Built-in AI Agent for frontend use, automatically completes common API call patterns to reduce typos and speed up coding.
- **Live API Documentation Preview**: See your API docs alongside your code in real-time. No more switching back and forth!
- **One-Click Mock Data**: Instantly generate Mock data without a backend — start frontend development immediately.
- **Visual Debugging Panel**: View parameters, headers, response statuses, and call history at a glance.
- **Light/Dark Mode Themes**: Switch between day and night modes to suit your vibe and protect those eyes.
- **TypeScript & ESLint Built-in**: Best practice configurations out of the box, keeping your code clean, safe, and maintainable.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- 后端 API 服务 (默认运行在 http://localhost:18080)

### Installation

1. **克隆项目**
```bash
git clone <repository-url>
cd Front-AI-Copilot-for-API
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，设置你的 API 地址
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **构建生产版本**
```bash
npm run build
```

### 环境配置

在 `.env` 文件中配置以下变量：

```env
# API 配置
VITE_API_URL=http://localhost:18080

# 应用配置
VITE_APP_TITLE=AI Copilot for API
VITE_APP_VERSION=1.0.0

# 其他配置
VITE_ENABLE_MOCK=false
VITE_LOG_LEVEL=info
```

---

## 🔧 API 集成

### 基本用法

```typescript
import { apiMethods, codegenApi, generateCodeStream } from '@/services/api';

// 基本 API 调用
const response = await apiMethods.get('/api/users');

// 代码生成
const codeResult = await codegenApi.generateCode({
  entity_name: 'User',
  fields: 'id:Long,name:String,email:String'
});

// 流式代码生成
for await (const chunk of generateCodeStream('id:Long,name:String')) {
  console.log(chunk);
}
```

### API 测试工具

项目内置了 API 测试工具，可以快速验证后端连接：

```typescript
import { testBackendConnection } from '@/utils/apiTest';

// 测试所有 API 连接
const results = await testBackendConnection();
console.log(results);
```

### 错误处理

所有 API 调用都包含统一的错误处理：

- 网络错误自动重试
- 401 错误自动清除认证信息
- 详细的错误日志记录
- 用户友好的错误提示

---

## 🏗️ 项目结构

```
src/
├── components/          # React 组件
│   ├── ErrorBoundary.tsx   # 错误边界组件
│   ├── Header.tsx          # 头部组件
│   ├── Sidebar.tsx         # 侧边栏组件
│   └── ...
├── services/           # API 服务
│   └── api.ts             # 主要 API 配置
├── utils/              # 工具函数
│   └── apiTest.ts         # API 测试工具
├── App.tsx             # 主应用组件
└── main.tsx            # 应用入口
```

---

## 🔍 故障排除

### 常见问题

1. **axios 导入错误**
   - 确保已安装依赖：`npm install`
   - 检查 node_modules 是否存在

2. **TypeScript 编译错误**
   - 确保安装了 @types/node：`npm install --save-dev @types/node`
   - 检查 tsconfig.json 配置

3. **API 连接失败**
   - 检查后端服务是否启动
   - 验证 .env 中的 API 地址
   - 使用内置测试工具：`testBackendConnection()`

4. **构建失败**
   - 清除缓存：`rm -rf node_modules package-lock.json && npm install`
   - 检查 vite.config.ts 配置

### 开发模式调试

开发模式下，所有 API 请求和响应都会在控制台输出详细日志，方便调试。

---

## 📝 更新日志

### v1.0.0
- ✅ 修复 axios 导入问题
- ✅ 修复 vite.config.ts TypeScript 错误
- ✅ 添加完整的错误处理机制
- ✅ 添加 API 测试工具
- ✅ 添加错误边界组件
- ✅ 优化构建配置
- ✅ 修复安全漏洞

---

## 🤝 Contributing

We'd love your help! Whether it's adding features, fixing bugs, or improving docs, every contribution makes this project better.

1. Fork this repo
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

> **提示**: 如果遇到任何问题，请查看故障排除部分或提交 Issue。
