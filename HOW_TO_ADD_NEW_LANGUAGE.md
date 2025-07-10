# 如何添加新语言 - 超简单指南

## 🎯 只需要 3 步！

### 第 1 步：添加语言代码
打开 `i18n/locale.ts` 文件，添加新语言：

```typescript
export const locales = ["en", "zh", "fr", "de", "es", "ja", "ko", "ms", "vi", "id", "km", "hi", "新语言代码"];

export const localeNames: any = {
  en: "English",
  zh: "中文",
  fr: "Français",
  // ... 其他语言
  "新语言代码": "语言名称",
};
```

### 第 2 步：复制翻译文件
1. 复制 `i18n/messages/en.json` 
2. 重命名为 `i18n/messages/新语言代码.json`
3. 翻译里面的内容

### 第 3 步：更新中间件
打开 `middleware.ts`，在第9行添加新语言代码：
```typescript
"/(en|en-US|zh|zh-CN|zh-TW|zh-HK|zh-MO|fr|de|es|ja|ko|ms|vi|id|km|hi|新语言代码)/:path*",
```

## 🎉 完成！

就这么简单！用户现在可以切换到新语言了。

## 📝 翻译文件结构说明

翻译文件是分层级的，比如：
```json
{
  "hero": {
    "title": "标题",
    "subtitle": "副标题"
  },
  "upload": {
    "title": "上传标题",
    "button": "按钮文字"
  }
}
```

在组件中使用：`t("hero.title")` 就会显示对应语言的"标题"

## 🔍 需要翻译的主要内容

目前已经整理好的翻译分类：
- `hero` - 首页主标题区域
- `upload` - 上传功能区域  
- `garden_styles` - 花园风格选择
- `how_it_works` - 工作流程说明
- `ai_features` - AI功能介绍
- `transformations` - 改造案例
- `pricing` - 定价信息
- `testimonials` - 用户评价
- `faq` - 常见问题
- `footer` - 页脚信息
- `common` - 通用按钮和文字

## 💡 翻译小贴士

1. **保持一致性** - 同样的概念在整个网站用同样的词
2. **考虑文化** - 不要直译，要符合当地表达习惯
3. **SEO友好** - 使用当地用户搜索的关键词
4. **测试长度** - 有些语言比英文长，注意UI布局

## 🚀 现在支持的语言

- 🇺🇸 英语 (en)
- 🇨🇳 中文 (zh) 
- 🇫🇷 法语 (fr)
- 🇩🇪 德语 (de)
- 🇪🇸 西班牙语 (es)
- 🇯🇵 日语 (ja)
- 🇰🇷 韩语 (ko)
- 🇲🇾 马来语 (ms)
- 🇻🇳 越南语 (vi)
- 🇮🇩 印尼语 (id)
- 🇰🇭 高棉语 (km)
- 🇮🇳 印地语 (hi)

想添加更多？按上面3步操作就行！