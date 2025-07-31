// Centralized blog translations for better maintainability

export const blogTranslations = {
  "best-ai-garden-design-tools-2025": {
    title: {
      en: "Image to Video AI Blog",
      zh: "Image to Video AI 博客",
      ja: "Image to Video AI ブログ",
      de: "Image to Video AI Blog",
      es: "Blog de Image to Video IA",
      fr: "Blog Image to Video IA",
      ko: "Image to Video AI 블로그",
      hi: "Image to Video AI ब्लॉग",
      id: "Blog Image to Video AI",
      ms: "Blog Image to Video AI",
      vi: "Blog Image to Video AI",
      km: "ប្លុក Image to Video AI",
    },
    description: {
      en: "Discover the latest tips, tools, and expert advice for AI image to video generation",
      zh: "发现AI图像转视频技术的最新技巧、工具和专家建议",
      ja: "AI画像から動画生成の最新のヒント、ツール、専門家のアドバイスを発見",
      de: "Entdecken Sie die neuesten Tipps, Tools und Expertenratschläge für KI-Bild-zu-Video-Generierung",
      es: "Descubre los últimos consejos, herramientas y asesoramiento experto para la generación de video IA de imagen a video",
      fr: "Découvrez les derniers conseils, outils et conseils d'experts pour la génération de vidéo IA d'image à vidéo",
      ko: "AI 이미지-투-비디오 생성에 대한 최신 팁, 도구 및 전문가 조언을 발견하세요",
      hi: "AI इमेज-टू-वीडियो जनरेशन के लिए नवीनतम टिप्स, टूल्स और विशेषज्ञ सलाह खोजें",
      id: "Temukan tips, alat, dan saran ahli terbaru untuk generasi video AI dari gambar",
      ms: "Temui petua, alat, dan nasihat pakar terkini untuk penjanaan video AI dari imej",
      vi: "Khám phá các mẹo, công cụ và lời khuyên chuyên gia mới nhất cho việc tạo video AI từ hình ảnh",
      km: "រកឃើញគន្លឹះ ឧបករណ៍ និងដំបូន្មានពីអ្នកជំនាញចុងក្រោយបំផុតសម្រាប់ការបង្កើតវីដេអូ AI ពីរូបថត",
    },
    cta: {
      en: "Ready to Start Your Image to Video Project?",
      zh: "准备开始您的图像转视频项目？",
      ja: "画像から動画プロジェクトを始める準備はできましたか？",
      de: "Bereit, Ihr Bild-zu-Video-Projekt zu starten?",
      es: "¿Listo para comenzar tu proyecto de imagen a video?",
      fr: "Prêt à commencer votre projet d'image à vidéo ?",
      ko: "이미지-투-비디오 프로젝트를 시작할 준비가 되셨나요?",
      hi: "अपनी इमेज-टू-वीडियो परियोजना शुरू करने के लिए तैयार हैं?",
      id: "Siap untuk memulai proyek gambar ke video Anda?",
      ms: "Sedia untuk memulakan projek imej ke video anda?",
      vi: "Sẵn sàng bắt đầu dự án hình ảnh sang video của bạn?",
      km: "ត្រៀមខ្លួនដើម្បីចាប់ផ្ដើមគម្រោងរូបថតទៅវីដេអូរបស់អ្នក?",
    },
    button: {
      en: "Try our AI image to video tool for free and get professional videos in 2 minutes",
      zh: "免费试用我们的AI图像转视频工具，2分钟内获得专业视频",
      ja: "AI画像から動画ツールを無料で試して、2分でプロフェッショナルな動画を取得",
      de: "Testen Sie unser KI-Bild-zu-Video-Tool kostenlos und erhalten Sie professionelle Videos in 2 Minuten",
      es: "Prueba nuestra herramienta de imagen a video IA gratis y obtén videos profesionales en 2 minutos",
      fr: "Essayez notre outil d'image à vidéo IA gratuitement et obtenez des vidéos professionnelles en 2 minutes",
      ko: "AI 이미지-투-비디오 도구를 무료로 시도하고 2분 만에 전문 비디오를 얻으세요",
      hi: "हमारे AI इमेज-टू-वीडियो टूल को मुफ्त में आजमाएं और 2 मिनट में पेशेवर वीडियो प्राप्त करें",
      id: "Coba alat gambar ke video AI kami gratis dan dapatkan video profesional dalam 2 menit",
      ms: "Cuba alat imej ke video AI kami secara percuma dan dapatkan video profesional dalam 2 minit",
      vi: "Thử công cụ hình ảnh sang video AI của chúng tôi miễn phí và nhận video chuyên nghiệp trong 2 phút",
      km: "សាកល្បងឧបករណ៍រូបថតទៅវីដេអូ AI របស់យើងឥតគិតថ្លៃ និងទទួលបានវីដេអូវិជ្ជាជីវៈក្នុងរយៈពេល 2 នាទី",
    },
  },
};

// Helper function to get translation with support for nested keys
export function getTranslation(key: string, locale: string): string {
  // Handle nested keys like 'categories.howToGuides'
  const keyParts = key.split('.');
  let current: any = blogTranslations;
  
  // Navigate through nested structure
  for (const part of keyParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      console.warn(`Translation key '${key}' not found in blogTranslations`);
      return String(key); // Return the key as fallback
    }
  }
  
  // If we found the translation object, get the locale-specific value
  if (current && typeof current === 'object' && current[locale as keyof typeof current]) {
    return current[locale as keyof typeof current];
  } else if (current && typeof current === 'object' && current.en) {
    return current.en; // Fallback to English
  } else if (typeof current === 'string') {
    return current; // Direct string value
  }
  
  console.warn(`Translation for locale '${locale}' not found for key '${key}'`);
  return String(key); // Return the key as fallback
}