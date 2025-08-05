# Vercel 到 Cloudflare Pages 迁移指南

## 📋 迁移概述

本文档详细记录了将 Next.js 项目从 Vercel 迁移到 Cloudflare Pages 的完整过程，包括配置修改、问题解决和最佳实践。
服务端渲染，谷歌seo友好，移动端适配

## 🎯 迁移原因

- **内存限制**：Vercel 免费计划内存不足
- **成本优化**：Cloudflare Pages 提供更慷慨的免费配额
- **性能提升**：全球 CDN 网络
- **功能扩展**：更多高级功能

## 📁 项目信息

- **项目名称**：AI Kitchen Design
- **原平台**：Vercel
- **目标平台**：Cloudflare Pages
- **技术栈**：Next.js 13.4.4 + React 18 + TypeScript
- **域名**：aikitchendesign.online

## 🔧 迁移步骤

### 1. 准备工作

#### 1.1 安装 Cloudflare Pages 工具
```bash
npm install -D @cloudflare/next-on-pages
```

#### 1.2 检查 Node.js 版本兼容性
```bash
node --version
# 注意：某些依赖可能需要 Node.js 20+，但 Cloudflare Pages 构建环境使用 Node.js 18
```

### 2. 配置文件修改

#### 2.1 创建 wrangler.toml
在项目根目录创建 `wrangler.toml` 文件：

```toml
name = "aikitchendesign"
compatibility_date = "2024-07-29"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

**重要说明：**
- `compatibility_flags = ["nodejs_compat"]` 是必需的，用于支持 Node.js 兼容性
- `pages_build_output_dir` 指定构建输出目录

#### 2.2 修改 next.config.mjs
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

**重要说明：**
- 保持配置简单，避免复杂的实验性功能
- 移除可能导致构建错误的 `setupDevPlatform` 配置

#### 2.3 更新 package.json 脚本
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "pages:build": "npx @cloudflare/next-on-pages",
    "preview": "npm run pages:build && wrangler pages dev",
    "deploy": "npm run pages:build && wrangler pages deploy"
  }
}
```

**脚本说明：**
- `pages:build`：构建项目并转换为 Cloudflare Pages 兼容格式
- `preview`：本地预览（使用 workerd 运行时）
- `deploy`：部署到 Cloudflare Pages

### 3. 代码结构调整

#### 3.1 Edge Runtime 配置

**API 路由必须使用 Edge Runtime：**
```typescript
// app/generate/route.ts
export const runtime = "edge";
import { NextResponse } from "next/server";
// ... 其他代码
```

**静态生成的路由文件也需要 Edge Runtime：**
```typescript
// app/robots.ts
export const runtime = "edge";
import { MetadataRoute } from 'next'
// ... 其他代码

// app/sitemap.ts
export const runtime = "edge";
import { MetadataRoute } from 'next'
// ... 其他代码
```

**页面组件不要使用 Edge Runtime：**
```typescript
// app/layout.tsx - 不要添加 export const runtime = "edge";
import { Metadata } from "next";
// ... 其他代码

// app/page.tsx - 不要添加 export const runtime = "edge";
import HomePageClient from "./HomePageClient";
// ... 其他代码
```

#### 3.2 服务端渲染优化

**将客户端组件分离：**
```typescript
// app/page.tsx (服务端组件)
import { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "AI Kitchen Design - Free Generator",
  description: "Create stunning kitchen designs with AI...",
  // ... SEO 元数据
};

export default function HomePage() {
  return <HomePageClient />;
}
```

```typescript
// app/HomePageClient.tsx (客户端组件)
"use client";
import { useState } from "react";
// ... 所有客户端逻辑
```

#### 3.3 错误处理优化

**添加错误边界组件：**
```typescript
// app/error.tsx
'use client';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error occurred:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}
```

```typescript
// app/global-error.tsx
'use client';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error occurred:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
```

### 4. 依赖版本优化

#### 4.1 处理 Node.js 兼容性问题
```json
{
  "dependencies": {
    "@google/genai": "^1.7.0",  // 降级以兼容 Node.js 18
    "next": "^13.4.4"           // 保持稳定版本
  },
  "devDependencies": {
    "@cloudflare/next-on-pages": "^1.12.0"  // 降级以解决 undici 兼容性
  }
}
```

**兼容性说明：**
- Cloudflare Pages 构建环境使用 Node.js 18.20.8
- 某些依赖需要 Node.js 20+，需要降级或寻找替代方案

### 5. 部署配置

#### 5.1 环境变量迁移
在 Cloudflare Pages 控制台中设置以下环境变量：
```
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_API_KEY=your_google_api_key
REPLICATE_API_KEY=your_replicate_api_key
```

#### 5.2 构建配置
- **构建命令**：`npm run pages:build`
- **构建输出目录**：`.vercel/output/static`
- **Node.js 版本**：18.x

### 6. 域名配置

#### 6.1 DNS 设置
在 Cloudflare DNS 中添加 CNAME 记录：
```
Type: CNAME
Name: @
Target: your-project-name.pages.dev
Proxy status: Proxied (橙色云朵)
```

#### 6.2 SSL/TLS 配置
**重要：使用"灵活"模式，不是"完全"模式**

原因：
- Cloudflare Pages 内部使用 HTTP 通信
- "完全"模式会导致 522 连接超时错误
- "灵活"模式不影响 SEO 和安全性

配置步骤：
1. 进入 Cloudflare Dashboard → SSL/TLS → 概述
2. 将加密模式从"完全"改为"灵活"
3. 保存设置

## 🚨 常见问题及解决方案

### 问题 1：构建错误 "ReferenceError: File is not defined"
**原因：** Node.js 版本兼容性问题
**解决方案：**
- 降级 `@cloudflare/next-on-pages` 到 `^1.12.0`
- 简化 `next.config.mjs` 配置
- 移除 `setupDevPlatform` 相关代码

### 问题 2：522 连接超时错误
**原因：** SSL/TLS 模式配置错误
**解决方案：**
- 将 SSL/TLS 模式改为"灵活"
- 确保 DNS 记录正确配置
- 清除 Cloudflare 缓存

### 问题 3：Edge Runtime 错误
**原因：** 页面组件错误使用了 Edge Runtime
**解决方案：**
- API 路由和静态生成文件使用 Edge Runtime
- 页面组件不要使用 Edge Runtime
- 确保服务端组件正确配置

### 问题 4：浏览器 API 在 SSR 中不可用
**原因：** 客户端代码在服务端执行
**解决方案：**
- 将客户端逻辑分离到独立组件
- 使用 `"use client"` 指令
- 避免在服务端组件中使用浏览器 API

## 📊 迁移前后对比

| 项目 | Vercel | Cloudflare Pages |
|------|--------|------------------|
| 内存限制 | 1024MB | 更大配额 |
| 构建时间 | 较快 | 较快 |
| 全球 CDN | 有 | 有 |
| 免费计划 | 有限制 | 更慷慨 |
| 自定义域名 | 支持 | 支持 |
| SSL 证书 | 自动 | 自动 |

## ✅ 迁移完成检查清单

- [ ] 项目在 Cloudflare Pages 成功部署
- [ ] 自定义域名正常工作
- [ ] SSL 证书正确配置
- [ ] 所有功能测试通过
- [ ] 环境变量正确设置
- [ ] 错误处理组件已添加
- [ ] SEO 元数据正确配置
- [ ] 性能测试通过

## 🎯 最佳实践

1. **保持配置简单**：避免复杂的实验性功能
2. **正确使用 Edge Runtime**：只在需要的地方使用
3. **分离客户端和服务端代码**：优化 SSR 性能
4. **使用"灵活"SSL 模式**：避免 522 错误
5. **定期监控性能**：确保迁移后性能良好

## 📚 参考资源

- [Cloudflare Pages Next.js 文档](https://developers.cloudflare.com/pages/framework-guides/nextjs/ssr/get-started/)
- [Cloudflare 522 错误解决方案](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-522/)
- [Next.js App Router 文档](https://nextjs.org/docs/app)

## 🔄 迁移完成

迁移完成后，可以安全删除 Vercel 上的项目以节省资源。

---

**最后更新：** 2024年7月31日
**迁移状态：** ✅ 完成
**项目状态：** 🟢 正常运行 

