# Any2Text – SEO & 结构化数据实施清单

> 本指南总结了与 Google/Bing 搜索引擎和主流 AI 模型（ChatGPT、Gemini、Claude 等）兼容的最佳实践。后续新增页面或复制到其他项目时，按此清单执行即可。

---

## 1. 逐页唯一 Metadata

| 要素 | 规则 |
|------|------|
| `<title>` | 每页唯一；包含核心长尾关键词 + 品牌名（≤ 60 字符） |
| `<meta description>` | 每页唯一；精简描述卖点（≤ 150 字符），含 1-2 个次级关键词 |
| `canonical` | 自指干净 URL（无 utm、# 锚点、分页参数） |

**示例（`/en/mp3-to-text`）**
```ts
export const metadata: Metadata = {
  title: 'Free MP3 to Text Converter | Any2Text',
  description: 'Convert MP3 files to editable text online for free. No signup required. 100+ languages supported.',
  alternates: {
    canonical: 'https://www.any2text.online/en/mp3-to-text'
  }
}
```

## 2. hreflang 互链

1. 仅在“同一主题的多语言版本”之间互链。
2. 每个兄弟页面都需包含全量 `<link rel="alternate" hreflang="…">` 列表 + `x-default`。
3. 建议在根布局动态生成，避免重复维护。

```tsx
{locales.map(l => (
  <link key={l} rel="alternate" hrefLang={l} href={`${base}/${l}${currentPath}`} />
))}
<link rel="alternate" hrefLang="x-default" href={`${base}/en${currentPath}`} />
```

## 3. 结构化数据模板（JSON-LD）

| 类型 | 作用 | 实施位置 |
|------|------|----------|
| Organization + Logo | 品牌名片 | 根布局一次性注入 |
| WebApplication / Service | 描述工具功能 | 各功能页 |
| FAQPage | 展开富结果，提高 CTR | 含 FAQ 的页面 |
| BreadcrumbList | 在 SERP 显示面包屑 | 功能页（层级 ≥2） |
| HowTo / VideoObject | 教程、演示视频 | 视具体内容而定 |

### FAQPage 快速函数
```ts
function faqSchema(list: {q: string; a: string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map(i => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a }
    }))
  }
}
```
3. `lastModified`：如无法准确获取修改时间，可省略；勿统一写 `new Date()`。

## 5. 图片与媒体

- `<img>` 必填 `alt`；描述内容含关键词但避免堆砌。
- 嵌入视频建议加 VideoObject JSON-LD。

## 6. 常见坑位提醒

- **不要** 在不同语言版本之间互相 canonical。
- UTM / 分享参数访问时仍会渲染自指 canonical，防止“影分身”收录。
- FAQ JSON-LD 文案必须与页面可见文本一致，避免结构化数据欺诈。
- Title/Description 不要复制粘贴，确保与目标长尾关键词对应。

## 7. 迭代流程

1. 创建新功能页 → 编写唯一 Title/Description → 自指 canonical。
2. 在 `locales` 路由下生成 13 语言版本（静文或翻译）。
3. 自动插入 hreflang 链接。
4. 填充 Q&A → 生成 FAQPage JSON-LD。
5. 如有教程步骤，加 HowTo Schema；有视频加 VideoObject。
6. Sitemap 脚本运行 → 部署 → Search Console 提交更新。

---

按此清单执行，可在 1-2 周内获得 SEO 富结果并为 AI 模型建立完整品牌知识图谱。 

## 8. 新增页面极速清单（复制模板时对照）

> 复制 `mp3-to-text` 页面或其它功能页作为模板后，**只需逐条核对下表即可完成全部 SEO 与结构化数据配置。**

| 步骤 | 必做项 | 位置/文件 | 备注 |
|------|--------|-----------|------|
| 1 | 更新 slug、文案差异化 | `layout.tsx / page.tsx` | 标题、描述、正文、FAQ 文案都要突出新格式特点 |
| 2 | Canonical 自指 | `layout.tsx` 中 `canonicalUrl` | 只改 slug，保持无 UTM 版本 |
| 3 | Metadata 唯一 | `generateMetadata()` | Title / Description 替换为新关键词 |
| 4 | FAQPage JSON-LD | `page.tsx` 顶部 | 调整 `faqData` 内容 → JSON-LD 自动更新 |
| 5 | BreadcrumbList | 更新第二层 `name` 与 `item` | 与新 slug 对应 |
| 6 | hreflang 自动链 | **无需手动** | 根布局已动态生成 |
| 7 | 翻译文件 | `messages/<lang>/[slug].json` | 13 语言全部准备，保持 key 结构一致 |
| 8 | i18n.ts 导入 | 添加新格式 JSON 导入 | 否则页面会显示翻译 key |
| 9 | sitemap.ts | 将 slug 加入 `slugs` 数组或循环 | 13 语言自动覆盖 |
| 10 | Robots / 其他 | robots.txt 默认允许；若有特殊需求再修改 | |
| 11 | 本地 `npm run build` | 确认无报错 | |
| 12 | 部署 & Search Console | 推送 PR / Merge → Production<br/>Search Console 请求抓取新 URL | 24h 内可见收录 |

> **Tips**
> - 如果只是复制英文版做多语言，不需要重复步骤 2/3/5，只需保证翻译文件与 i18n.ts 一致。
> - 新格式若同时支持音频 + 视频，无需改 `AudioConverter` 配置，已自动适配。 

---

## 附录 · 页面快速复制与翻译完整流程

> 以下内容原位于 `SIMPLE_COPY_GUIDE.md`，已并入本文件，方便一次性查看。

# 音频/视频格式页面复制指南

基于现有页面快速创建新格式页面的简单步骤。支持音频格式（如M4A、AAC等）和视频格式（如MP4、AVI等）。

## 🎥 新增：音频+视频统一支持

### 智能双API架构
项目现在支持统一组件，自动选择最佳API：
- **音频文件** (mp3, wav, m4a, aac) → 自动选择 AssemblyAI
- **视频文件** (mp4, avi, mov, wmv) → 自动选择 Deepgram

### ✅ 统一配置（已完成实施）
**所有117个页面（9个页面文件×13种语言）都已使用相同配置，支持音频+视频：**

```typescript
<AudioConverter 
  config={{
    apiProvider: 'auto', // 自动检测文件类型选择API
    supportedFormats: ['mp3', 'wav', 'm4a', 'aac', 'mp4', 'avi', 'mov', 'wmv'],
    allowVideoFallback: true,
    allowAudioFallback: true,
    maxFileSize: 2 * 1024 * 1024 * 1024 // 2GB 支持大视频文件
  }}
/>
```

**✅ 已统一的页面文件：**
- app/[locale]/page.tsx (首页)
- app/[locale]/mp3-to-text/page.tsx
- app/[locale]/wav-to-text/page.tsx  
- app/[locale]/ai-mp3-to-text/page.tsx
- app/[locale]/ai-audio-transcription/page.tsx
- app/[locale]/audio-to-word/page.tsx
- app/[locale]/spanish-audio-to-text/page.tsx
- app/[locale]/french-speech-to-text/page.tsx
- app/[locale]/german-transcription/page.tsx

### 🎯 后续新增页面指导：
- ✅ **复制任意现有功能页面作为模板**
- ✅ **保持 AudioConverter 配置不变**  
- 📝 **必须修改的内容**：
  - 页面标题、描述和关键词（针对新格式）
  - FAQ 常见问题（不能直接复制，要针对新格式特点编写）
  - 功能介绍文案（突出新格式优势）
  - BreadcrumbList 和 JSON-LD 中的格式名称
- ✅ **自动支持所有音频和视频格式**
- ✅ **无需担心文件类型兼容性问题**

### 📝 FAQ 编写要求：
**错误示例**：直接复制 "支持哪些MP3文件格式？"
**正确示例**：针对新格式编写专门问答
- "支持哪些[新格式]文件？"  
- "[新格式]转文字有什么优势？"
- "[新格式]和其他格式转文字有什么区别？"
- "[新格式]文件转文字的准确率如何？"

## ⚠️ 重要：必须按顺序执行！
> 不按顺序执行会导致翻译失效、重复内容或 SEO 漏项。

### 1. 复制页面文件
```bash
cp -r app/[locale]/mp3-to-text app/[locale]/[新格式]-to-text
# 修改 layout.tsx / page.tsx 文案中的 "MP3" -> "新格式"
```

### 2. 复制翻译文件
```bash
cp messages/en/mp3-to-text.json messages/en/[新格式]-to-text.json
# 修改 JSON 文案关键字，再用 AI 生成其它 12 语言版本
```

### 2.5. 验证翻译文件结构
确保 key 命名与原文件一致，避免页面显示翻译 key。

### 3. 更新配置文件
- `i18n.ts` 导入新翻译
- `app/sitemap.ts` 添加新 slug
- `public/robots.txt`、`llms.txt`、`llms.full.txt` 如有需要同步

### 3.6. 🔗 SEO & 结构化数据快捷核对
复制页面后立即回到本文件 **第 8 节《新增页面极速清单》** 逐条确认 5 项 SEO 步骤。

### 4. 更新首页入口（如需）
在各语言首页 footer 或导航添加新格式链接。

### 5. 测试 & 部署
```bash
npm run build  # 确认无错误
# Git 提交并推送
```

---

> **30 分钟完成一次完整新增页面**：复制→改文案→填翻译→ SEO 核对→ sitemap → 部署。 


其他补充的内容：
- 服务器端渲染策略 
- 优化 robots.txt 
- 实现站点地图 (sitemap.xml) 
- 优化 URL 结构 ，符合seo友好政策。
- 我的网站是给全球用户使用的，你要使用next.js框架，使用shadcn/ui,以及taiwind css框架，使用app路由，我已经建好了根目录，你直接在这个基础上写代码就行。
- 移动端友好和响应式设计 ,页面要适配移动端
- 站点性能优化 ，网站加速速度要快。要好一些
- 图片要有alt元素，要符合seo友好政策
- 点击按钮的锚文本，要按照关键词密度来划分，要把关键词给放到锚文本上去
- 优化标题标签和元描述 ，要符合Meta Title/Description Check： 这是On-Page SEO的基础。使用AITDK这个Google插件来辅助优化。它会根据最佳实践建议
- 处理404页面
- 支持Canonical ，Canonical标签的作用就是告诉搜索引擎：“这些页面其实是同一个，请把所有的权重都集中到这一个‘官方’版本上。”这能有效避免SEO权重的流失。
- 隐私政策和条款要加上noindex,不被谷歌索引到，no index mata label：你的网站上总会有一些不想被Google收录的页面，比如用户协议、隐私政策或者一些测试页面。
- Robots.txt/Sitemap.xml/llms.txt /llms.full.txt.Check：这三个文件可以看作是你给搜索引擎制定的“访问规则”。Robots.txt 告诉爬虫哪些页面可以爬，哪些不可以；Sitemap.xml 则提供了一份完整的网站地图，引导爬虫高效地抓取所有重要页面；llms.txt 则是针对AI大模型爬虫的规则。要符合结构优化，要能让大模型比如CHATGPT去推荐我的网站
- 底部页脚部分可以只放隐私政策和条款页面，这2个页面你要单独做新页面条款，页面的内容你可以去网上找一下进行填充，结合我这个项目写。
- canonical` 要在每个页面，包括每个页面，都要设置，不能全指向根域名 ，否则搜索引擎会认为几十个页面内容重复。  
- 多语言标识，要加上hreflang，否则西班牙用户搜索的时候可能会推荐英语内容，跳出率高。
 逐页唯一 Meta + Canonical（高优先级）   a. 在每个具体页面文件里新增  
 • 与可见 FAQ 内容保持一致即可，不会被惩罚。
   • 为每条 URL 增加 <xhtml:link rel="alternate" hreflang> 节点，方便 Google 识别多语版本。
  • BreadcrumbList JSON-LD：提升长文导航体验；   • If 页面含视频 → 加 VideoObject，有机会出视频富卡片；   • 图片多时补 ImageObject＋alt；   • Core Web Vitals：确保 CLS/LCP 合格（Next.js + Tailwind 一般 OK）。  
FAQPage（高收益、已聊过）
每页 3-8 条问答，JSON-LD 与可见 FAQ 文案一致。
Organization + Logo（高收益）
放在根 /layout.tsx 或首页顶部：
Apply to 0713.mp4
}
帮 Google 确认品牌实体，大模型也能抓到公司名称与官网对应关系。
BreadcrumbList（中-高收益）
对层级不深的功能页也有用，可在 SERP 显示面包屑：
Apply to 0713.mp4
}
HowTo（中收益，视页面而定）
如果你写了「3 步把 MP3 转文字」的教程，可在博客或功能页底部加 HowTo，以获得步骤富结果。

Ran tool
Ran tool
Ran tool
Read file: app/sitemap.ts
Read file: app/robots.txt
Read file: next.config.mjs

Read file: app/[locale]/(default)/page.tsx

Read file: app/[locale]/layout.tsx

Read file: app/[locale]/layout.tsx

Read file: app/[locale]/(default)/posts/[slug]/page.tsx

Read file: app/(legal)/layout.tsx

下面从「传统 SEO」和「面向 GPT 等大模型可解析内容」两条线，逐项指出当前代码库中存在的主要不足，并给出优化方向。所有结论均基于对 `app/`, `components/`, `i18n/`, `sitemap.ts`, `robots.txt`, `next.config.mjs` 等核心文件的抽样检查及整体结构的分析。

====================================================
一、Google SEO 层面

1. 页面 Metadata 信息缺失/不完整  
   • 仅在 `app/[locale]/layout.tsx` 中配置了站点级 `title/description/keywords`，多数子页面（如首页、pricing、blog 列表等）只返回 `canonical`，没有独立的 `title/description`、`openGraph`、`twitter` 信息。  
   • `openGraph` 只给出了 `url/siteName`，缺少 `images`, `type`, `title`, `description`，导致分享卡片效果与排名都受影响。  
   • 建议：  
     a) 为所有重要页面实现 `generateMetadata`，至少补充 `title/description/openGraph.images/twitter.card`。  
     b) Blog 文章可自动生成 `Article` 类型 OG/Twitter 卡片。

2. Sitemap 覆盖面不足 & 内容硬编码  
   • `app/sitemap.ts` 只包含首页、pricing、blog 列表及一个固定文章 slug；未包含：
     – 真实 Blog 文章集合（数据库/目录生成）。  
     – 功能页（/garden-styles, /garden-planner 等）、多语言子路由、动态 slug 页。  
   • 建议：  
     a) 读取数据库或文件系统自动遍历 slug，动态生成 `lastModified`。  
     b) 将 sitemap 拆分为 `sitemap-0.xml`, `sitemap-1.xml` 等子文件，便于 Google 快速抓取。

3. robots.txt 规则过于冗长 & 与实际路由不一致  
   • 针对十余种 AI Bot 重复 Allow/Disallow，同样内容与 Google/BingBot 重复，文件体积增大。  
   • `Disallow: /privacy-policy` / `terms-of-service` 可能影响合规性（Google 偏好可索引的隐私条款）。  
   • 建议：  
     – 精简相同的一般规则，必要时使用 `Sitemap`-索引即可。  
     – 对法律页改为 `meta name="robots" content="noindex"`（已在 `legal/layout.tsx` 里做），robots.txt 可不再显式屏蔽。

4. 结构化数据（Schema.org）仅有站点级，缺少内容级  
   • 布局中已注入 `WebSite/Organization/Service`，但 Blog 文章、FAQ、Pricing 方案等未提供 `Article`, `FAQPage`, `Product` 等 schema。  
   • 建议：  
     – Blog 详情页输出 `Article` JSON-LD，包含 `headline`, `image`, `datePublished`, `dateModified`.  
     – FAQ 组件输出 `FAQPage` JSON-LD 提升富结果。  
     – Pricing 模块输出 `Offer`(`Product`) 结构化数据。

5. 图片与性能相关  
   • 多数图片使用 `<img>` 而非 `next/image`，缺少 `alt` 与 `loading="lazy"`。  
   • `next.config.mjs` 开放了通配域名，但组件未充分利用 `next/image` 优化。  
   • 建议：全站替换为 `next/image`，补充 `alt`，并根据视口尺寸使用 `sizes`。

6. 脚本注入方式影响 Core Web Vitals  
   • GA、Clarity、Plausible 等通过 `<script dangerouslySetInnerHTML>` 加载，阻断关键渲染路径。  
   • 建议改用 `next/script` 并设置 `strategy="afterInteractive" / "lazyOnload"`。

7. Canonical/Alternates 变量混用  
   • 部分文件使用 `NEXT_PUBLIC_BASE_URL`，部分使用 `NEXT_PUBLIC_WEB_URL`，容易导致输出不一致。  
   • 建议统一 ENV 名称，封装工具函数集中生成 canonical/hreflang。

====================================================
二、面向 GPT 等大模型解析优化

1. 文章/FAQ 缺少可读结构化语义  
   • LLM 更偏好有明确层级、富语义的 HTML。Blog 详情页模板虽然使用 `prose` 样式，但未确保 `h1-h3` 层级、`time` 标签、作者信息等。  
   • 建议：  
     – 使用 `article > header > h1/time` 结构。  
     – 显式标注作者/发布日期，以利模型摘要。  

2. Schema-Based Content 对话可检索性  
   • LLM 对 `FAQPage`、`HowTo`, `Recipe` 等结构化数据支持度高，可直接生成答案。当前仅提供站点级三条 schema。  
   • 建议增加：  
     – `FAQPage`：将 `components/blocks/faq` 问答项同步到 JSON-LD。  
     – 若有教程，可输出 `HowTo`。  

3. 多语种 hreflang 标记完整性  
   • `alternates.languages` 已在 layout 层生成，但仅针对根路径，博客文章等动态路径需要在对应页面重新输出。  
   • 建议在每个多语言页面的 `generateMetadata` 中利用 `params.locale` 与所有语种构造 `hreflang`。  

4. API/工具提示文档不可见  
   • 若希望被 LLM 抓取并用于工具调用，应提供开放的 API schema（如 OpenAPI/JSON-LD `Action`），当前仓库未见。  

5. 长文本可分段提供摘要  
   • Blog 文章可自动生成 `<meta name="summary">` 或 `og:description`，方便模型快速预览。  

====================================================
三、总结优先级 (高→低)

1. 为每个主要页面与文章补全 `generateMetadata`：title/description/OG/Twitter 图。  
2. 动态生成完整 sitemap；统一 canonical/hreflang。  
3. Blog/FAQ/Pricing 输出对应的结构化数据(JSON-LD)。  
4. 全站切换 `next/image` 并补齐 `alt`，减少 CLS/FCP 问题。  
5. 使用 `next/script` 优化第三方脚本加载。  
6. 精简 robots.txt，去除不必要的 Disallow 与重复规则。  
7. 如果面向 LLM 作为“知识库”使用，考虑 OpenAPI 或更多 `schema.org` `Action` 标记。

按上述步骤迭代，可同时提升 Google 排名与被 GPT/Claude 等模型检索、归纳的效果。
# Any2Text – SEO & 结构化数据实施清单

> 本指南总结了与 Google/Bing 搜索引擎和主流 AI 模型（ChatGPT、Gemini、Claude 等）兼容的最佳实践。后续新增页面或复制到其他项目时，按此清单执行即可。

---

## 1. 逐页唯一 Metadata

| 要素 | 规则 |
|------|------|
| `<title>` | 每页唯一；包含核心长尾关键词 + 品牌名（≤ 60 字符） |
| `<meta description>` | 每页唯一；精简描述卖点（≤ 150 字符），含 1-2 个次级关键词 |
| `canonical` | 自指干净 URL（无 utm、# 锚点、分页参数） |

**示例（`/en/mp3-to-text`）**
```ts
export const metadata: Metadata = {
  title: 'Free MP3 to Text Converter | Any2Text',
  description: 'Convert MP3 files to editable text online for free. No signup required. 100+ languages supported.',
  alternates: {
    canonical: 'https://www.any2text.online/en/mp3-to-text'
  }
}
```

## 2. hreflang 互链

1. 仅在“同一主题的多语言版本”之间互链。
2. 每个兄弟页面都需包含全量 `<link rel="alternate" hreflang="…">` 列表 + `x-default`。
3. 建议在根布局动态生成，避免重复维护。

```tsx
{locales.map(l => (
  <link key={l} rel="alternate" hrefLang={l} href={`${base}/${l}${currentPath}`} />
))}
<link rel="alternate" hrefLang="x-default" href={`${base}/en${currentPath}`} />
```

## 3. 结构化数据模板（JSON-LD）

| 类型 | 作用 | 实施位置 |
|------|------|----------|
| Organization + Logo | 品牌名片 | 根布局一次性注入 |
| WebApplication / Service | 描述工具功能 | 各功能页 |
| FAQPage | 展开富结果，提高 CTR | 含 FAQ 的页面 |
| BreadcrumbList | 在 SERP 显示面包屑 | 功能页（层级 ≥2） |
| HowTo / VideoObject | 教程、演示视频 | 视具体内容而定 |

### FAQPage 快速函数
```ts
function faqSchema(list: {q: string; a: string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map(i => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a }
    }))
  }
}
```
3. `lastModified`：如无法准确获取修改时间，可省略；勿统一写 `new Date()`。

## 5. 图片与媒体

- `<img>` 必填 `alt`；描述内容含关键词但避免堆砌。
- 嵌入视频建议加 VideoObject JSON-LD。

## 6. 常见坑位提醒

- **不要** 在不同语言版本之间互相 canonical。
- UTM / 分享参数访问时仍会渲染自指 canonical，防止“影分身”收录。
- FAQ JSON-LD 文案必须与页面可见文本一致，避免结构化数据欺诈。
- Title/Description 不要复制粘贴，确保与目标长尾关键词对应。

## 7. 迭代流程

1. 创建新功能页 → 编写唯一 Title/Description → 自指 canonical。
2. 在 `locales` 路由下生成 13 语言版本（静文或翻译）。
3. 自动插入 hreflang 链接。
4. 填充 Q&A → 生成 FAQPage JSON-LD。
5. 如有教程步骤，加 HowTo Schema；有视频加 VideoObject。
6. Sitemap 脚本运行 → 部署 → Search Console 提交更新。

---

按此清单执行，可在 1-2 周内获得 SEO 富结果并为 AI 模型建立完整品牌知识图谱。 

## 8. 新增页面极速清单（复制模板时对照）

> 复制 `mp3-to-text` 页面或其它功能页作为模板后，**只需逐条核对下表即可完成全部 SEO 与结构化数据配置。**

| 步骤 | 必做项 | 位置/文件 | 备注 |
|------|--------|-----------|------|
| 1 | 更新 slug、文案差异化 | `layout.tsx / page.tsx` | 标题、描述、正文、FAQ 文案都要突出新格式特点 |
| 2 | Canonical 自指 | `layout.tsx` 中 `canonicalUrl` | 只改 slug，保持无 UTM 版本 |
| 3 | Metadata 唯一 | `generateMetadata()` | Title / Description 替换为新关键词 |
| 4 | FAQPage JSON-LD | `page.tsx` 顶部 | 调整 `faqData` 内容 → JSON-LD 自动更新 |
| 5 | BreadcrumbList | 更新第二层 `name` 与 `item` | 与新 slug 对应 |
| 6 | hreflang 自动链 | **无需手动** | 根布局已动态生成 |
| 7 | 翻译文件 | `messages/<lang>/[slug].json` | 13 语言全部准备，保持 key 结构一致 |
| 8 | i18n.ts 导入 | 添加新格式 JSON 导入 | 否则页面会显示翻译 key |
| 9 | sitemap.ts | 将 slug 加入 `slugs` 数组或循环 | 13 语言自动覆盖 |
| 10 | Robots / 其他 | robots.txt 默认允许；若有特殊需求再修改 | |
| 11 | 本地 `npm run build` | 确认无报错 | |
| 12 | 部署 & Search Console | 推送 PR / Merge → Production<br/>Search Console 请求抓取新 URL | 24h 内可见收录 |

> **Tips**
> - 如果只是复制英文版做多语言，不需要重复步骤 2/3/5，只需保证翻译文件与 i18n.ts 一致。
> - 新格式若同时支持音频 + 视频，无需改 `AudioConverter` 配置，已自动适配。 

---

## 附录 · 页面快速复制与翻译完整流程

> 以下内容原位于 `SIMPLE_COPY_GUIDE.md`，已并入本文件，方便一次性查看。

# 音频/视频格式页面复制指南

基于现有页面快速创建新格式页面的简单步骤。支持音频格式（如M4A、AAC等）和视频格式（如MP4、AVI等）。

## 🎥 新增：音频+视频统一支持

### 智能双API架构
项目现在支持统一组件，自动选择最佳API：
- **音频文件** (mp3, wav, m4a, aac) → 自动选择 AssemblyAI
- **视频文件** (mp4, avi, mov, wmv) → 自动选择 Deepgram

### ✅ 统一配置（已完成实施）
**所有117个页面（9个页面文件×13种语言）都已使用相同配置，支持音频+视频：**

```typescript
<AudioConverter 
  config={{
    apiProvider: 'auto', // 自动检测文件类型选择API
    supportedFormats: ['mp3', 'wav', 'm4a', 'aac', 'mp4', 'avi', 'mov', 'wmv'],
    allowVideoFallback: true,
    allowAudioFallback: true,
    maxFileSize: 2 * 1024 * 1024 * 1024 // 2GB 支持大视频文件
  }}
/>
```

**✅ 已统一的页面文件：**
- app/[locale]/page.tsx (首页)
- app/[locale]/mp3-to-text/page.tsx
- app/[locale]/wav-to-text/page.tsx  
- app/[locale]/ai-mp3-to-text/page.tsx
- app/[locale]/ai-audio-transcription/page.tsx
- app/[locale]/audio-to-word/page.tsx
- app/[locale]/spanish-audio-to-text/page.tsx
- app/[locale]/french-speech-to-text/page.tsx
- app/[locale]/german-transcription/page.tsx

### 🎯 后续新增页面指导：
- ✅ **复制任意现有功能页面作为模板**
- ✅ **保持 AudioConverter 配置不变**  
- 📝 **必须修改的内容**：
  - 页面标题、描述和关键词（针对新格式）
  - FAQ 常见问题（不能直接复制，要针对新格式特点编写）
  - 功能介绍文案（突出新格式优势）
  - BreadcrumbList 和 JSON-LD 中的格式名称
- ✅ **自动支持所有音频和视频格式**
- ✅ **无需担心文件类型兼容性问题**

### 📝 FAQ 编写要求：
**错误示例**：直接复制 "支持哪些MP3文件格式？"
**正确示例**：针对新格式编写专门问答
- "支持哪些[新格式]文件？"  
- "[新格式]转文字有什么优势？"
- "[新格式]和其他格式转文字有什么区别？"
- "[新格式]文件转文字的准确率如何？"

## ⚠️ 重要：必须按顺序执行！
> 不按顺序执行会导致翻译失效、重复内容或 SEO 漏项。

### 1. 复制页面文件
```bash
cp -r app/[locale]/mp3-to-text app/[locale]/[新格式]-to-text
# 修改 layout.tsx / page.tsx 文案中的 "MP3" -> "新格式"
```

### 2. 复制翻译文件
```bash
cp messages/en/mp3-to-text.json messages/en/[新格式]-to-text.json
# 修改 JSON 文案关键字，再用 AI 生成其它 12 语言版本
```

### 2.5. 验证翻译文件结构
确保 key 命名与原文件一致，避免页面显示翻译 key。

### 3. 更新配置文件
- `i18n.ts` 导入新翻译
- `app/sitemap.ts` 添加新 slug
- `public/robots.txt`、`llms.txt`、`llms.full.txt` 如有需要同步

### 3.6. 🔗 SEO & 结构化数据快捷核对
复制页面后立即回到本文件 **第 8 节《新增页面极速清单》** 逐条确认 5 项 SEO 步骤。

### 4. 更新首页入口（如需）
在各语言首页 footer 或导航添加新格式链接。

### 5. 测试 & 部署
```bash
npm run build  # 确认无错误
# Git 提交并推送
```

---

> **30 分钟完成一次完整新增页面**：复制→改文案→填翻译→ SEO 核对→ sitemap → 部署。 


其他补充的内容：
- 服务器端渲染策略 
- 优化 robots.txt 
- 实现站点地图 (sitemap.xml) 
- 优化 URL 结构 ，符合seo友好政策。
- 我的网站是给全球用户使用的，你要使用next.js框架，使用shadcn/ui,以及taiwind css框架，使用app路由，我已经建好了根目录，你直接在这个基础上写代码就行。
- 移动端友好和响应式设计 ,页面要适配移动端
- 站点性能优化 ，网站加速速度要快。要好一些
- 图片要有alt元素，要符合seo友好政策
- 点击按钮的锚文本，要按照关键词密度来划分，要把关键词给放到锚文本上去
- 优化标题标签和元描述 ，要符合Meta Title/Description Check： 这是On-Page SEO的基础。使用AITDK这个Google插件来辅助优化。它会根据最佳实践建议
- 处理404页面
- 支持Canonical ，Canonical标签的作用就是告诉搜索引擎：“这些页面其实是同一个，请把所有的权重都集中到这一个‘官方’版本上。”这能有效避免SEO权重的流失。
- 隐私政策和条款要加上noindex,不被谷歌索引到，no index mata label：你的网站上总会有一些不想被Google收录的页面，比如用户协议、隐私政策或者一些测试页面。
- Robots.txt/Sitemap.xml/llms.txt /llms.full.txt.Check：这三个文件可以看作是你给搜索引擎制定的“访问规则”。Robots.txt 告诉爬虫哪些页面可以爬，哪些不可以；Sitemap.xml 则提供了一份完整的网站地图，引导爬虫高效地抓取所有重要页面；llms.txt 则是针对AI大模型爬虫的规则。要符合结构优化，要能让大模型比如CHATGPT去推荐我的网站
- 底部页脚部分可以只放隐私政策和条款页面，这2个页面你要单独做新页面条款，页面的内容你可以去网上找一下进行填充，结合我这个项目写。
- canonical` 要在每个页面，包括每个页面，都要设置，不能全指向根域名 ，否则搜索引擎会认为几十个页面内容重复。  
- 多语言标识，要加上hreflang，否则西班牙用户搜索的时候可能会推荐英语内容，跳出率高。
 逐页唯一 Meta + Canonical（高优先级）   a. 在每个具体页面文件里新增  
 • 与可见 FAQ 内容保持一致即可，不会被惩罚。
   • 为每条 URL 增加 <xhtml:link rel="alternate" hreflang> 节点，方便 Google 识别多语版本。
  • BreadcrumbList JSON-LD：提升长文导航体验；   • If 页面含视频 → 加 VideoObject，有机会出视频富卡片；   • 图片多时补 ImageObject＋alt；   • Core Web Vitals：确保 CLS/LCP 合格（Next.js + Tailwind 一般 OK）。  
FAQPage（高收益、已聊过）
每页 3-8 条问答，JSON-LD 与可见 FAQ 文案一致。
Organization + Logo（高收益）
放在根 /layout.tsx 或首页顶部：
Apply to 0713.mp4
}
帮 Google 确认品牌实体，大模型也能抓到公司名称与官网对应关系。
BreadcrumbList（中-高收益）
对层级不深的功能页也有用，可在 SERP 显示面包屑：
Apply to 0713.mp4
}
HowTo（中收益，视页面而定）
如果你写了「3 步把 MP3 转文字」的教程，可在博客或功能页底部加 HowTo，以获得步骤富结果。
CTA 文案多样化
LLM文案增加一些常用问句
FAQ要做结构化数据分析

以及其他的需要自查的：
Ran tool
Read file: src/app/layout.tsx

Read file: src/app/privacy/page.tsx

Read file: src/app/terms/page.tsx

Ran tool

Ran tool

Ran tool

Read file: src/components/FAQ.tsx

Read file: src/app/sitemap.ts

Read file: public/robots.txt

Read file: src/app/not-found.tsx

Ran tool

Ran tool

以下结论基于对完整代码库的逐文件审查，已对照你给出的「Any2Text-SEO & 结构化数据实施清单」逐项核对，未做任何代码改动，仅输出改进清单。

────────────────────
一、当前项目主要问题（按优先级）

1. Canonical 全站统一指向根域  
   • `src/app/layout.tsx` 在 `<head>` 内死写 `<link rel="canonical" href="https://www.dogbreedidentifier.online" />`，所有子页都会继承 → 造成“数十个页面内容重复”信号。  
   • `metadata.alternates.canonical` 同样只写了主页。  

2. hreflang 完全缺失  
   • 仅有 `lang="en"`，没有多语言文件夹，也无动态 `<link rel="alternate" hreflang>` 生成逻辑。全球访客搜索时可能拿到错误语言结果，影响 CTR/跳出率。  

3. Metadata 非唯一 / 关键词残留  
   • 首页、Layout 的 title/description 逻辑与清单一致，但 Privacy / Terms 无 canonical；404 页、部分组件仍残留 “AI Skin Scanner” 等旧关键词。  
   • `src/app/not-found.tsx` CTA 文案与跳转均指向旧项目。  
   • 多处组件名称或变量仍以 Skin 为前缀（如 `SkinAnalyzer.tsx`），易造成主题混淆。  

4. 结构化数据覆盖不足  
   • Layout 注入了 `WebApplication`，但 FAQ / Breadcrumb / VideoObject 等高收益 Schema 均未实现。`FAQ.tsx` 只有可见问答，没有 JSON-LD。  
   • 无 `Organization + Logo`、无 `BreadcrumbList`（功能页深度≥2 时会缺）。  

5. Sitemap & Robots  
   • `src/app/sitemap.ts` 仅返回主页；Privacy / Terms 已 `noindex`，但功能页、FAQ 等根本未列入 sitemap。  
   • `robots.txt` 规则基本 OK，但 sitemap 列表不全导致抓取效率低。  

6. OpenGraph 资源缺失  
   • Metadata 中引用 `/og-image.jpg`，但 `public/` 目录不存在该文件 → OG/Twitter 卡片显示空白。  

7. 图片 alt / nofollow  
   • 项目几乎没有 `<img>`，SVG 图标无 alt；外链 Coin Identifier、AI Skin Scanner 均为 dofollow，可根据策略补 `rel="nofollow"`。  

8. Core Web Vitals / 性能  
   • 大量 `<script dangerouslySetInnerHTML>`（Clarity、GA、Plausible）同步加载；建议 `defer`/`afterInteractive`；并设置 `priority` 给首屏 Image。  

────────────────────
二、与清单逐项对照的缺漏一览

| 清单条目 | 当前状态 | 建议 |
|-----------|----------|------|
| 逐页唯一 `<title>` / `<meta description>` | 仅首页完整，其余复用或缺少 | 为每个 `page.tsx` 导出独立 `metadata`，并移除 Layout 中默认值的全局 canonical |
| Canonical 自指 | 全部指向根域 | 在各 `page.tsx` 中动态拼接 `canonical` |
| hreflang | 无 | 根布局根据 `locales[]` 动态渲染 |
| Organization/Logo JSON-LD | 无 | 在 Layout 注入一次即可 |
| WebApplication / Service | 仅 Layout | 功能页按需改成 `Service`，带 `operatingSystem`、`offers` |
| FAQPage | 可见 FAQ 有，缺 JSON-LD | 在 `FAQ.tsx` 内通过函数注入 `<script type="application/ld+json">` |
| BreadcrumbList | 无 | 对 URL 层级≥2 的页生成 |
| HowTo / VideoObject | 无 | 视博客或演示视频决定 |
| Sitemap | 仅主页 | 生成所有可索引 URL；自动循环 locale+slug |
| Robots.txt | 已 disallow 隐私/条款/API | 保持；同步更新 sitemap 路径 |
| 404 页面 | 保留旧品牌内容 | 置换为 Dog Breed Identifier 相关文案 |
| OG/Image | 引用丢失 | 将图片放入 `public/og-image.jpg` 或更新 URL |
| 外链 nofollow | 全 dofollow | 外部商业链接建议加 `rel="nofollow noopener"` |
| alt | SVG 图标无需；如新增 `<img>` 需补 alt | 审核新图片即可 |

────────────────────
三、关键词与内容一致性检查

1. 旧关键词残留  
   • “AI Skin Scanner” 出现于 404 页按钮、CTA 页脚链接文本。  
   • 内部 import `SkinAnalyzer` → 应改为 `DogBreedAnalyzer`（未来重构时同步修改）。  

2. 关键词密度 / 锚文本  
   • 首页正文、FAQ 已覆盖“free dog breed identifier”等长尾词，密度尚可。  
   • 页脚外链可调整锚文本，如 “Free Coin Identifier Tool” 体现关键词。  

────────────────────
四、下一步改进路线（建议顺序）

1. **高优先级（发布前必须）**  
   a. 移除 Layout 全局 canonical，改各页面自指。  
   b. 新建 `sitemap.ts` 逻辑：循环所有路由 + future locales。  
   c. 修正 OG 图片资源缺失。  
   d. 404 页面及残留 “Skin” 文案替换。  

2. **中优先级（上线 3 天内）**  
   a. 实现 `hreflang` 动态生成（即使先只有 `en`）。  
   b. FAQPage JSON-LD 注入；Organization / Logo JSON-LD。  
   c. 将外部推广链设 `nofollow`（若策略需要）。  

3. **低优先级（迭代优化）**  
   a. 多语言目录结构和翻译文件（参照清单第 8 节）。  
   b. BreadcrumbList、HowTo、VideoObject 按需补全。  
   c. 性能优化：脚本 lazy-load、图片 LCP 优化、CLS 调优。  

完成以上调整后，项目即可基本符合你提供的 SEO & AI-friendly 清单，并消除旧项目遗留痕迹。若需要我针对其中某一模块编写代码或脚本，请告诉我！

下面把「seo youhua.md 清单」逐条对照到你当前这个多语言项目，列出仍需补强或可优化的点——只给清单，不动代码。方便你后续分批实现。

一、逐页唯一 Meta（Title / Description / Canonical）
1. 首页、Pricing、Blog 列表、Blog 文章现在已各自写了 Title & Description，但还缺：
   • openGraph.title / openGraph.description / openGraph.images  
   • twitter.* 同步字段  
   • `keywords` 建议删除或保持极简，Google 几乎不看  
2. Canonical 生成逻辑分散：有的用 `NEXT_PUBLIC_BASE_URL`，有的用 `NEXT_PUBLIC_WEB_URL`。统一一个 env，并封装 helper。

二、hreflang 互链
1. 根布局已输出全语言 hreflang，但文章页、Blog 列表页、Pricing 页只写 canonical，没写 languages。  
2. 需在这些页面的 `generateMetadata` 中循环 `locales[]` 输出全量 hreflang + `x-default`。

三、结构化数据（JSON-LD）
1. Blog 文章：补 `Article`（headline/image/datePublished/dateModified/author）。  
2. FAQ 组件：把问答数组转成 `FAQPage` JSON-LD。  
3. Pricing 页：已经有 `Product/Offer`，再加 `BreadcrumbList`。  
4. 站点级别已有 `WebSite`、`Organization`、`Service`，OK。  
5. 如果后续写教程或演示视频，再酌情加 `HowTo`、`VideoObject`。

四、Sitemap
1. 目前硬编码 slug，仅 1 篇文章。改成：  
   • 读取数据库 / 文件系统动态遍历所有文章 slug。  
   • 循环 `locales` 生成多语言 URL。  
   • 如果 URL 数 > 50000 或 > 50 MB，拆分子 sitemap0-n.xml。  
2. 更新 robots.txt 里的 `Sitemap:` 行，指向新的索引文件（可留 1 行列出主 sitemap，也可列全部）。

五、robots.txt
1. 逻辑 OK 但内容冗余，可压缩为：  
   ```
   User-agent: *
   Disallow: /api/
   Disallow: /_next/
   Disallow: /_vercel/
   Disallow: /.well-known/
   Disallow: /privacy-policy
   Disallow: /terms-of-service
   Sitemap: https://www.aigardendesign.online/sitemap.xml
   ```
   其余 AI Bot 规则可通过附加一个 `llms.txt`/`llms.full.txt` 专门配置。  
2. 隐私政策、条款页布局里已 `noindex`，robots.txt 再 Disallow 一次即可。

六、加载速度（Core Web Vitals）
1. GA / Clarity / Plausible 改用 `next/script`：`strategy="afterInteractive"` 或 `"lazyOnload"`，避免阻塞渲染。  
2. Google 字体：用 `preconnect` 或 `next/font` 自动优化（你已用 `next/font`，OK）。  
3. 目前仍有 `<img>`：  
   • `before-after-slider.tsx` 的 before/after 图  
   • admin 用户头像  
   这些改 `next/image`，并加 `loading="lazy"` / `sizes`。  
4. 给首屏 hero 图或大背景图加 `priority`。

七、图片 alt / ImageObject
1. 所有 `<img>` 补 alt，最好带 1 个相关关键词。  
2. 多图展示页（Gallery/Transformations）可考虑额外输出 `ImageObject` JSON-LD。

八、llms.txt / llms.full.txt
1. 根目录已存在，但 Sitemap 行未必同步。确认：  
   • 列出主站 & 多语言路径  
   • 允许抓取与 robots.txt 一致  
   • 可单独列 “garden-styles / ai-design-free / blog/*” 等核心 URL。

九、BreadcrumbList
1. 价格页、Blog 详情页层级 ≥2，可在页面顶部输出 `BreadcrumbList` JSON-LD：Home → Blog → 文章标题。

十、性能小结
1. 开启 Next.js 图片优化、高速缓存（你已 `output: standalone`）。  
2. 生产环境设置 `Cache-Control: public, max-age=31536000, immutable` 给静态资源。  
3. 检查 Cloudflare / Vercel Edge 设置，确认开启 Brotli / gzip。

十一、404 与其他“边缘页”
1. 404 和 500 页应含自指 canonical + noindex，避免收录。  
2. 404 页仍可保留 CTA，但 alt/文案要更新。

十二、按钮锚文本
1. 站内主要 CTA（导航、按钮）可适当植入 “AI garden design” 长尾词，但保持可读性，避免关键词堆砌。  
2. 外链如引用第三方资源，加 `rel="nofollow noopener"`（除非刻意传递权重）。

────────────
最关键的 5 件事（建议依次实现）  
① 文章 Article JSON-LD + FAQPage JSON-LD  
② hreflang 在所有页面补全  
③ Sitemap 动态生成所有语言所有 slug  
④ GA/Clarity/Plausible 换 `next/script` + 懒加载  
⑤ 精简 robots.txt 并确认隐私政策/条款 `noindex + Disallow`

把这些做完，你就全面符合 seo youhua.md 的清单了。剩余项（BreadcrumbList、ImageObject、HowTo 等）可视精力陆续补充。