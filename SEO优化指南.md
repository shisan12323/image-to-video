# Next.js 多语言项目 SEO & AI 大模型友好 实施清单

> 适用范围：任何使用 Next.js（App Router）+ Tailwind CSS + shadcn/ui 的 SaaS / 落地页 / 博客项目。
> 
> 目标：同时满足 Google/Bing 等传统搜索引擎与 OpenAI、Claude、Perplexity 等大模型爬虫的抓取与推荐。

---

## 1. 逐页唯一 Metadata

| 要素 | 规则 | 备注 |
|------|------|------|
| `<title>` | 每页唯一；核心长尾关键词 + 品牌；≤60 字符 | 例：`Free AI Garden Design Tool | BrandName` |
| `<meta description>` | 每页唯一；120–160 字；含 1–2 个次级关键词 | 例：`Upload your yard photo and get professional AI garden designs in 2 minutes.` |
| `canonical` | 自指干净 URL，无 utm/锚点 | 使用 `buildCanonical(locale, path)` helper |
| `hreflang` | 全语言互链 + x-default | `buildHreflang(path)` helper 生成 |
| `openGraph` / `twitter` | `title/description/url/images` 全字段 | 图 1200×630，放 `public/og-***.jpg` |

> **Tips**：`keywords` 元标签几乎被忽略，可删或保持极简。

---

## 2. 结构化数据（JSON-LD）

| Schema 类型 | 触发富结果 | 实施位置 |
|-------------|-----------|----------|
| WebSite + Organization | 品牌实体 | 根布局一次性注入 |
| Service / Product / Offer | 功能页 / Pricing | 对应页面注入 |
| Article | Blog 文章 | 自动填 `headline / image / datePublished / author` |
| FAQPage | 含 FAQ 的页面 | FAQ 组件 `useEffect` 动态插入 |
| BreadcrumbList | 层级 ≥2 的页面 | 例：Home → Pricing |
| ImageObject | 图集 / Gallery | 声明示例图片，利于大模型理解 |
| HowTo / VideoObject | 教程 / 演示视频 | 视需求添加 |

---

## 3. robots.txt & llms.txt

```
User-agent: *
Allow: /
# 技术目录
Disallow: /api/
Disallow: /_next/
Disallow: /_vercel/
# 法律页
Disallow: /privacy-policy
Disallow: /terms-of-service

Sitemap: https://example.com/sitemap.xml
Crawl-delay: 1
```

* 重复写 `Allow` 无额外好处，`User-agent:*` 已包含所有爬虫。  
* 若需“心理安慰”，可额外列 AI Bot；或单独维护 `llms.txt`。

---

## 4. 动态 Sitemap

1. 循环 `locales[]` + 所有 slug（数据库 / 文件系统）生成。  
2. URL 总量 >50k 或 >50MB 时拆分 `sitemap-0.xml` ... 并生成索引。  
3. 部署完成后在 Search Console 请求抓取。

---

## 5. 图片与媒体

- 统一使用 `next/image`，填写 `alt`（含主关键词），`loading="lazy"`，合适 `sizes`。  
- 首屏大图加 `priority`。  
- 若有 Before/After 对比，`<BeforeAfterSlider>` 内部仍可 `next/image + fill`。  
- 多图页可输出 `ImageObject` JSON-LD。

---

## 6. 第三方脚本与性能

- 使用 `next/script`：`strategy="afterInteractive"/"lazyOnload"`。  
- Google 字体采用 `next/font`；额外 `preconnect` 到 `fonts.gstatic.com`。  
- 保证 LCP、CLS、FID 在绿区。

---

## 7. 404 / 500 等边缘页

- 静态导出：
```ts
export const metadata = {
  title: '404 | BrandName',
  robots: { index: false, follow: false },
  alternates: { canonical: buildCanonical(locale, '404') }
}
```
- 页面可保留返回首页 CTA；文本需使用当前品牌关键词。

---

## 8. 按钮 & 锚文本

- 主要 CTA 含自然长尾词，如 “Try **AI Garden Design** Now”。  
- 外链：如果是自家项目保留 `dofollow`；对第三方商业站点可加 `rel="nofollow noopener"`。
锚文本按钮要分散
---

## 9. 开发流程快速清单

1. **新页面** - 复制模板 → 更新标题/描述/slug。  
2. 调用 `buildCanonical` / `buildHreflang` 生成链接。  
3. 若含 FAQ/教程/价格/文章 → 填写对应 Schema。  
4. 页面图片用 `next/image` + alt。  
5. 运行 `npm run lint && npm run build` 保证无报错。  
6. 更新 sitemap → 部署 → Search Console 提交。  
7. Post-deploy 用 `AITDK` 或 `Ahrefs` 检查 Title/Description、OG、结构化数据。

---

## 10. 常见坑位

| 坑 | 说明 |
|----|------|
| Canonical 指错 | 多语言页面互相 canonical 会丢权重。 |
| 重复 Title/Description | 爬虫会合并排名 → 一页一词。 |
| JSON-LD 与可见内容不一致 | 可能被视为欺诈，富结果消失。 |
| 忽略 hreflang | 西班牙用户搜到英文版，跳出率高。 |
| 未使用 `next/script` | GA 阻塞首屏，LCP 变差。 |

---

完成以上 10 步，即达成：
• Google/Bing 可顺利索引 + 富结果展示。  
• GPT/Claude 等大模型可解析站点品牌、FAQ、图片并在回答中引用。  

> 推荐书签：`chrome://flags/#enable-experimental-web-platform-features`（开启后可在 DevTools 直接验证 JSON-LD 富结果）。 