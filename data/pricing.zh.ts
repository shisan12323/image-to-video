import { Pricing as PricingType } from "@/types/blocks/pricing";

export const pricingData: PricingType = {
  name: "pricing",
  title: "简单透明的定价",
  description: "选择合适的方案，使用 AI 改造您的户外空间",
  groups: [
    {
      name: "monthly",
      title: "月付",
      description: "按月支付"
    },
    {
      name: "yearly",
      title: "年付",
      description: "省 20%",
      label: "省 20%"
    }
  ],
  items: [
    {
      title: "入门", 
      description: "适合小型花园的业主",
      price: "￥69",
      unit: "/月",
      group: "monthly",
      interval: "month",
      product_id: "starter_monthly",
      product_name: "Starter Monthly CN",
      amount: 6900,
      currency: "cny",
      credits: 80,
      valid_months: 1,
      features_title: "包含以下功能：",
      features: [
        "每月 80 次 AI 花园设计",
        "基础植物推荐",
        "前后对比预览",
        "标准品质下载",
        "邮件支持"
      ],
      button: {
        title: "立即开始",
        href: "#"
      }
    }
    // 可以根据需要继续添加中文计划...
  ]
}; 