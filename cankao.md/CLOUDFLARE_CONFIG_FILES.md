# Cloudflare Pages 迁移指南 - Image to Video 项目

## 📋 项目信息
- **项目**: Image to Video (Next.js 15 + TypeScript + Supabase + Stripe + Replicate)
- **目标**: 部署到 Cloudflare Pages
- **特殊需求**: SSR、SEO友好、多语言、认证、支付、AI视频生成
- **认证方案**: NextAuth V5 + Google OAuth
- **认证方案**: NextAuth V5 + Google OAuth

## 🚀 迁移步骤

### 1. 安装依赖
```bash
npm install -D @cloudflare/next-on-pages wrangler
```

### 2. 创建 wrangler.toml
```toml
name = "image-to-video"
compatibility_date = "2024-12-19"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"

# 环境变量
[vars]
NEXT_PUBLIC_BASE_URL = "https://www.image-to-video.art"

# R2 存储绑定
[[r2_buckets]]
binding = "IMAGES_BUCKET"
bucket_name = "image-to-video-images"
preview_bucket_name = "image-to-video-images-dev"

# KV 存储绑定
[[kv_namespaces]]
binding = "CACHE_KV"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"
```

**重要说明：**
- `compatibility_flags = ["nodejs_compat"]` 是必需的，用于支持 Node.js 兼容性
- 必须在 Cloudflare Pages 后台设置：Settings → Functions → Compatibility Flags
- `pages_build_output_dir` 指定构建输出目录

### 3. 更新 next.config.mjs
```javascript
import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import mdx from "@next/mdx";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin();

const withMDX = mdx({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [];
  },
};

// 简化配置，移除可能导致问题的实验性功能
const configWithMDX = {
  ...nextConfig,
  experimental: {
    mdxRs: true,
  },
};

export default withBundleAnalyzer(withNextIntl(withMDX(configWithMDX)));
```

**重要说明：**
- 保持配置简单，避免复杂的实验性功能
- 本地开发可选加 `setupDevPlatform`，生产环境建议精简配置
- 移除可能导致构建错误的实验性功能

### 4. 更新 package.json 脚本
```json
{
  "scripts": {
    "dev": "cross-env NODE_NO_WARNINGS=1 next dev",
    "build": "next build",
    "start": "NODE_NO_WARNINGS=1 next start",
    "pages:build": "npx @cloudflare/next-on-pages",
    "preview": "npm run pages:build && wrangler pages dev",
    "deploy": "npm run pages:build && wrangler pages deploy"
  }
}
```

### 5. 添加 Edge Runtime 到 API 路由

#### app/api/generate-video/route.ts
```typescript
export const runtime = "edge";
// ... 现有代码
```

#### app/api/checkout/route.ts
```typescript
export const runtime = "edge";
// ... 现有代码
```

#### app/api/auth/[...nextauth]/route.ts
```typescript
export const runtime = "edge";
// ... 现有代码
```

#### app/api/webhook/replicate/route.ts
```typescript
export const runtime = "edge";
// ... 现有代码
```

#### app/api/stripe-notify/route.ts
```typescript
export const runtime = "edge";
// ... 现有代码
```

### 6. 添加 Edge Runtime 到静态生成文件

#### app/sitemap.ts
```typescript
export const runtime = "edge";
// ... 现有代码
```

#### app/robots.txt
```typescript
export const runtime = "edge";
// ... 现有代码
```

### 7. 创建错误处理组件

#### app/error.tsx
```typescript
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

#### app/global-error.tsx
```typescript
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

### 8. 创建 Cloudflare 存储服务

#### services/cloudflare-storage.ts
```typescript
import { getRequestContext } from "@cloudflare/next-on-pages";

export class CloudflareStorageService {
  private r2Bucket: R2Bucket;

  constructor() {
    const { env } = getRequestContext();
    this.r2Bucket = env.IMAGES_BUCKET;
  }

  async uploadImage(file: File, path: string): Promise<string> {
    const key = `images/${path}`;
    await this.r2Bucket.put(key, file, {
      httpMetadata: {
        contentType: file.type,
      },
    });
    
    return `https://your-domain.com/${key}`;
  }

  async deleteImage(path: string): Promise<void> {
    const key = `images/${path}`;
    await this.r2Bucket.delete(key);
  }
}
```

### 9. 配置环境变量

#### Cloudflare Pages 环境变量 (生产环境)
```bash
NEXT_PUBLIC_BASE_URL=https://www.image-to-video.art
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://www.image-to-video.art
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REPLICATE_API_TOKEN=your_replicate_api_token
```

### 10. 部署配置

#### Cloudflare Pages 构建设置
- **构建命令**: `npm run pages:build`
- **构建输出目录**: `.vercel/output/static`
- **Node.js 版本**: 18.x
- **安装命令**: `npm install`

### 11. 域名和 SSL 配置
1. **DNS 设置**: 添加 CNAME 记录指向 `your-project-name.pages.dev`
2. **SSL/TLS 模式**: 使用"灵活"模式，避免 522 错误
3. **自定义域名**: 在 Cloudflare Pages 控制台配置

## ⚠️ 重要注意事项

### 1. NextAuth 版本要求
- **必须使用 NextAuth V5 beta** (`next-auth@beta`)
- NextAuth V4 不支持 Edge Runtime
- 您的项目已经在使用 V5 beta，符合要求

### 2. Node.js API 兼容性
Cloudflare Edge Runtime 不支持以下 Node.js API，需要替换：

#### fs 模块
```typescript
// ❌ 不支持
import fs from 'fs';
const data = fs.readFileSync('file.txt', 'utf8');

// ✅ 替代方案：使用 fetch 读取远程文件
const response = await fetch('https://your-domain.com/file.txt');
const data = await response.text();
```

#### http 模块
```typescript
// ❌ 不支持
import http from 'http';

// ✅ 替代方案：使用 fetch API
const response = await fetch('https://api.example.com/data');
```

#### crypto 模块
```typescript
// ❌ 不支持
import crypto from 'node:crypto';

// ✅ 替代方案：使用全局 crypto 对象
const hash = await crypto.subtle.digest('SHA-256', data);
```

### 3. 第三方库兼容性
检查所有依赖 Node.js API 的第三方库：

#### axios
```typescript
// ❌ axios 依赖 http 模块，不支持 Edge Runtime
import axios from 'axios';

// ✅ 替代方案：使用 fetch
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

#### google-one-tap
```typescript
// ❌ 可能依赖 axios，需要检查兼容性
// ✅ 如果遇到问题，可能需要拉到本地修改或寻找替代方案
```

### 4. Supabase 数据库
- **Supabase 官方客户端支持 Edge Runtime**
- **不支持 pg 包**，必须使用 `@supabase/supabase-js`
- **部分 SQL 语法不支持**，如 `order by random()`

```typescript
// ✅ 正确的 Supabase 客户端配置
import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
  return client;
}
```

### 5. Next.js 特性兼容性

#### Image 组件优化
- Next.js 的 Image 组件优化在 Cloudflare 上无效
- 建议使用 Cloudflare Images 或自定义 Loader

#### NotFound 页面
- App Router 需要自己实现 404 页面
- 创建 `app/not-found.tsx` 文件

#### ISR (增量静态再生)
- 不支持 ISR，会降级为 SSG
- 静态生成不受影响

### 6. 依赖版本兼容性
Cloudflare Pages 构建环境使用 Node.js 18.20.8，某些依赖可能需要降级：

```json
{
  "dependencies": {
    "@google/genai": "^1.7.0",  // 降级以兼容 Node.js 18
    "next": "^13.4.4"           // 保持稳定版本
  },
  "devDependencies": {
    "@cloudflare/next-on-pages": "^1.12.0"  // 降级以解决兼容性
  }
}
```

## ✅ 部署检查清单

- [ ] 安装 `@cloudflare/next-on-pages` 和 `wrangler`
- [ ] 创建 `wrangler.toml` 配置文件
- [ ] 在 Cloudflare Pages 后台设置 `nodejs_compat` 兼容性标志
- [ ] 更新 `package.json` 脚本
- [ ] 为所有 API 路由添加 `export const runtime = "edge"`
- [ ] 为静态生成文件添加 Edge Runtime
- [ ] 创建错误处理组件
- [ ] 检查所有第三方库的 Edge Runtime 兼容性
- [ ] 配置环境变量
- [ ] 设置构建配置
- [ ] 配置域名和 SSL
- [ ] 测试所有功能

## 🚨 常见问题

### 问题 1: 522 连接超时错误
**解决方案**: 将 SSL/TLS 模式改为"灵活"模式

### 问题 2: Edge Runtime 错误
**解决方案**: 
- API 路由和静态生成文件使用 Edge Runtime
- 页面组件不要使用 Edge Runtime

### 问题 3: 环境变量访问错误
**解决方案**: 确保在 Cloudflare Pages 控制台正确配置所有环境变量



### 问题 4: 构建错误 "ReferenceError: File is not defined"
**原因**: Node.js 版本兼容性问题
**解决方案**:
- 降级 `@cloudflare/next-on-pages` 到 `^1.12.0`
- 简化 `next.config.mjs` 配置
- 移除 `setupDevPlatform` 相关代码

### 问题 5: Node.js API 不兼容
**原因**: 使用了 fs、http、crypto 等 Node.js API
**解决方案**:
- 使用 fetch 替代 http 请求
- 使用全局 crypto 对象替代 node:crypto
- 将本地文件读取改为远程文件读取

## 📚 参考资源

- [Cloudflare Pages Next.js 文档](https://developers.cloudflare.com/pages/framework-guides/nextjs/ssr/get-started/)
- [Cloudflare R2 存储文档](https://developers.cloudflare.com/r2/)
- [NextAuth V5 文档](https://next-auth.js.org/)

---

**创建日期**: 2024年12月19日  
**状态**: 📋 完整迁移指南 