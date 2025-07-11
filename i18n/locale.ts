import { Pathnames } from "next-intl/routing";

export const locales = ["en", "zh", "fr", "de", "es", "ja", "ko", "ms", "vi", "id", "km", "hi"];

export const localeNames: any = {
  en: "English",
  zh: "中文",
  fr: "Français",
  de: "Deutsch", 
  es: "Español",
  ja: "日本語",
  ko: "한국어",
  ms: "Bahasa Melayu",
  vi: "Tiếng Việt",
  id: "Bahasa Indonesia",
  km: "ភាសាខ្មែរ",
  hi: "हिन्दी",
};

export const defaultLocale = "en";

export const localePrefix = "as-needed";

export const localeDetection =
  process.env.NEXT_PUBLIC_LOCALE_DETECTION === "true";

export const pathnames = {
  "/blog": "/blog",
  "/blog/[slug]": "/blog/[slug]",
  en: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
  },
} satisfies Pathnames<typeof locales>;
