import BlogContentEN from "@/blog-content/best-ai-garden-design-tools-2025/en";
import BlogContentZH from "@/blog-content/best-ai-garden-design-tools-2025/zh";
import BlogContentJA from "@/blog-content/best-ai-garden-design-tools-2025/ja";
import BlogContentDE from "@/blog-content/best-ai-garden-design-tools-2025/de";
import BlogContentES from "@/blog-content/best-ai-garden-design-tools-2025/es";
import BlogContentFR from "@/blog-content/best-ai-garden-design-tools-2025/fr";
import BlogContentKO from "@/blog-content/best-ai-garden-design-tools-2025/ko";
import BlogContentHI from "@/blog-content/best-ai-garden-design-tools-2025/hi";
import BlogContentID from "@/blog-content/best-ai-garden-design-tools-2025/id";
import BlogContentMS from "@/blog-content/best-ai-garden-design-tools-2025/ms";
import BlogContentVI from "@/blog-content/best-ai-garden-design-tools-2025/vi";
import BlogContentKM from "@/blog-content/best-ai-garden-design-tools-2025/km";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  const titles = {
    en: "The Best AI Garden Design Tools in 2025 | Free AI Garden Design",
    zh: "2025年最佳AI花园设计工具 | 免费AI花园设计",
    ja: "2025年最高のAIガーデンデザインツール | 無料AIガーデンデザイン",
    de: "Die besten KI-Gartendesign-Tools 2025 | Kostenloses KI-Gartendesign",
    es: "Las Mejores Herramientas de Diseño de Jardines con IA 2025 | Diseño de Jardines IA Gratis",
    fr: "Les Meilleurs Outils de Conception de Jardin IA 2025 | Conception de Jardin IA Gratuite",
    ko: "2025년 최고의 AI 정원 디자인 도구 | 무료 AI 정원 디자인",
    hi: "2025 के सर्वश्रेष्ठ AI गार्डन डिज़ाइन टूल्स | मुफ्त AI गार्डन डिज़ाइन",
    id: "Alat Desain Taman AI Terbaik 2025 | Desain Taman AI Gratis",
    ms: "Alat Reka Bentuk Taman AI Terbaik 2025 | Reka Bentuk Taman AI Percuma",
    vi: "Công Cụ Thiết Kế Vườn AI Tốt Nhất 2025 | Thiết Kế Vườn AI Miễn Phí",
    km: "ឧបករណ៍រចនាសួនច្បារ AI ល្អបំផុត 2025 | រចនាសួនច្បារ AI ឥតគិតថ្លៃ",
  };

  const descriptions = {
    en: "Discover the best AI garden design tools of 2025. Transform your outdoor space with artificial intelligence. Free trial available - professional designs in 2 minutes.",
    zh: "发现2025年最佳AI花园设计工具。用人工智能改造您的户外空间。免费试用 - 2分钟内专业设计。",
    ja: "2025年最高のAIガーデンデザインツールを発見。人工知能でアウトドアスペースを変革。無料トライアル利用可能 - 2分でプロフェッショナルデザイン。",
    de: "Entdecken Sie die besten KI-Gartendesign-Tools von 2025. Verwandeln Sie Ihren Außenbereich mit künstlicher Intelligenz. Kostenlose Testversion verfügbar - professionelle Designs in 2 Minuten.",
    es: "Descubre las mejores herramientas de diseño de jardines con IA de 2025. Transforma tu espacio exterior con inteligencia artificial. Prueba gratuita disponible - diseños profesionales en 2 minutos.",
    fr: "Découvrez les meilleurs outils de conception de jardin IA de 2025. Transformez votre espace extérieur avec l'intelligence artificielle. Essai gratuit disponible - conceptions professionnelles en 2 minutes.",
    ko: "2025년 최고의 AI 정원 디자인 도구를 발견하세요. 인공지능으로 야외 공간을 변화시키세요. 무료 체험 이용 가능 - 2분 만에 전문적인 디자인.",
    hi: "2025 के सर्वश्रेष्ठ AI गार्डन डिज़ाइन टूल्स खोजें। कृत्रिम बुद्धिमत्ता से अपने बाहरी स्थान को बदलें। मुफ्त ट्रायल उपलब्ध - 2 मिनट में पेशेवर डिज़ाइन।",
    id: "Temukan alat desain taman AI terbaik tahun 2025. Transformasikan ruang luar Anda dengan kecerdasan buatan. Uji coba gratis tersedia - desain profesional dalam 2 menit.",
    ms: "Temui alat reka bentuk taman AI terbaik tahun 2025. Ubah ruang luar anda dengan kecerdasan buatan. Percubaan percuma tersedia - reka bentuk profesional dalam 2 minit.",
    vi: "Khám phá các công cụ thiết kế vườn AI tốt nhất năm 2025. Biến đổi không gian ngoài trời của bạn với trí tuệ nhân tạo. Có dùng thử miễn phí - thiết kế chuyên nghiệp trong 2 phút.",
    km: "រកឃើញឧបករណ៍រចនាសួនច្បារ AI ល្អបំផុតឆ្នាំ 2025។ ផ្លាស់ប្តូរទីតាំងខាងក្រៅរបស់អ្នកជាមួយនឹងបញ្ញាសិប្បនិម្មិត។ មានការសាកល្បងឥតគិតថ្លៃ - ការរចនាដ៏ជំនាញក្នុងរយៈពេល 2 នាទី។",
  };

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/blog/best-ai-garden-design-tools-2025`;
  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/blog/best-ai-garden-design-tools-2025`;
  }

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    keywords: locale === "zh" 
      ? "AI花园设计, 免费花园设计工具, 人工智能景观设计, 花园规划, AI花园设计师"
      : locale === "ja"
      ? "AIガーデンデザイン, 無料ガーデンデザインツール, 人工知能ランドスケープデザイン, ガーデンプランニング, AIガーデンデザイナー"
      : "ai garden design free, ai landscape generator, garden planner, AI garden designer, free garden design tools",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      url: canonicalUrl,
      siteName: "AI Garden Design",
      locale: locale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Language component mapping
  const languageComponents = {
    en: BlogContentEN,
    zh: BlogContentZH,
    ja: BlogContentJA,
    de: BlogContentDE,
    es: BlogContentES,
    fr: BlogContentFR,
    ko: BlogContentKO,
    hi: BlogContentHI,
    id: BlogContentID,
    ms: BlogContentMS,
    vi: BlogContentVI,
    km: BlogContentKM,
  };

  // Get the appropriate component or default to English
  const ContentComponent = languageComponents[locale as keyof typeof languageComponents] || BlogContentEN;
  
  return <ContentComponent />;
}