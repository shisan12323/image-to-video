import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  if (["zh-CN", "zh-TW", "zh-HK", "zh-MO"].includes(locale)) {
    locale = "zh";
  }

  if (!routing.locales.includes(locale as any)) {
    locale = "en";
  }

  try {
    // 加载主要翻译文件
    const messages = (await import(`./messages/${locale.toLowerCase()}.json`))
      .default;
    
    // 加载页面特定的翻译文件
    let pageMessages = {};
    try {
      const landingVideoMessages = (await import(`./pages/landing-video/${locale.toLowerCase()}.json`))
        .default;
      pageMessages = {
        ...pageMessages,
        "landing-video": landingVideoMessages
      };
    } catch (e) {
      // 如果页面特定翻译文件不存在，使用英语版本作为后备
      try {
        const landingVideoMessages = (await import(`./pages/landing-video/en.json`))
          .default;
        pageMessages = {
          ...pageMessages,
          "landing-video": landingVideoMessages
        };
      } catch (fallbackError) {
        console.warn(`Failed to load landing-video translations for ${locale}:`, fallbackError);
      }
    }

    // 合并翻译文件
    const mergedMessages = {
      ...messages,
      ...pageMessages
    };

    return {
      locale: locale,
      messages: mergedMessages,
    };
  } catch (e) {
    // 如果主要翻译文件加载失败，使用英语作为后备
    try {
      const messages = (await import(`./messages/en.json`)).default;
      const landingVideoMessages = (await import(`./pages/landing-video/en.json`))
        .default;
      
      const mergedMessages = {
        ...messages,
        "landing-video": landingVideoMessages
      };

      return {
        locale: "en",
        messages: mergedMessages,
      };
    } catch (fallbackError) {
      console.error("Failed to load fallback translations:", fallbackError);
      return {
        locale: "en",
        messages: {},
      };
    }
  }
});
