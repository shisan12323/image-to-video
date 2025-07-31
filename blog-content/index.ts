// Blog content index for the hybrid architecture
// This file helps organize and manage all blog content components

export interface BlogMetadata {
  slug: string;
  title: {
    en: string;
    zh: string;
    ja: string;
    de: string;
    es: string;
    fr: string;
    ko: string;
    hi: string;
    id: string;
    ms: string;
    vi: string;
    km: string;
  };
  description: {
    en: string;
    zh: string;
    ja: string;
    de: string;
    es: string;
    fr: string;
    ko: string;
    hi: string;
    id: string;
    ms: string;
    vi: string;
    km: string;
  };
  date: string;
  readTime: {
    en: string;
    zh: string;
    ja: string;
    de: string;
    es: string;
    fr: string;
    ko: string;
    hi: string;
    id: string;
    ms: string;
    vi: string;
    km: string;
  };
  keywords: {
    en: string[];
    zh: string[];
    ja: string[];
    de: string[];
    es: string[];
    fr: string[];
    ko: string[];
    hi: string[];
    id: string[];
    ms: string[];
    vi: string[];
    km: string[];
  };
}

export const blogPosts: BlogMetadata[] = [
  {
    slug: "best-ai-garden-design-tools-2025",
    title: {
      en: "The Best AI Image to Video Tools in 2025",
      zh: "2025年最佳AI图像转视频工具",
      ja: "2025年最高のAI画像から動画ツール",
      de: "Die besten KI-Bild-zu-Video-Tools 2025",
      es: "Las Mejores Herramientas de Imagen a Video IA 2025",
      fr: "Les Meilleurs Outils d'Image à Vidéo IA 2025",
      ko: "2025년 최고의 AI 이미지-투-비디오 도구",
      hi: "2025 के सर्वश्रेष्ठ AI इमेज-टू-वीडियो टूल्स",
      id: "Alat Gambar ke Video AI Terbaik 2025",
      ms: "Alat Imej ke Video AI Terbaik 2025",
      vi: "Công Cụ Hình Ảnh Sang Video AI Tốt Nhất 2025",
      km: "ឧបករណ៍រូបថតទៅវីដេអូ AI ល្អបំផុត 2025",
    },
    description: {
      en: "Transform your images into stunning videos with artificial intelligence. Discover the best free AI image to video tools with professional results in 2 minutes.",
      zh: "用人工智能将您的图像转换为令人惊叹的视频。发现最佳免费AI图像转视频工具，2分钟内获得专业效果。",
      ja: "人工知能で画像を素晴らしい動画に変換。最高の無料AI画像から動画ツールを発見し、2分でプロフェッショナルな結果を。",
      de: "Verwandeln Sie Ihre Bilder mit künstlicher Intelligenz in beeindruckende Videos. Entdecken Sie die besten kostenlosen KI-Bild-zu-Video-Tools mit professionellen Ergebnissen in 2 Minuten.",
      es: "Transforma tus imágenes en videos impresionantes con inteligencia artificial. Descubre las mejores herramientas gratuitas de imagen a video IA con resultados profesionales en 2 minutos.",
      fr: "Transformez vos images en vidéos époustouflantes avec l'intelligence artificielle. Découvrez les meilleurs outils gratuits d'image à vidéo IA avec des résultats professionnels en 2 minutes.",
      ko: "인공지능으로 이미지를 놀라운 비디오로 변환하세요. 2분 만에 전문적인 결과를 제공하는 최고의 무료 AI 이미지-투-비디오 도구를 발견하세요.",
      hi: "कृत्रिम बुद्धिमत्ता के साथ अपनी छवियों को आश्चर्यजनक वीडियो में बदलें। 2 मिनट में पेशेवर परिणामों के साथ सर्वश्रेष्ठ मुफ्त AI इमेज-टू-वीडियो टूल्स खोजें।",
      id: "Transformasi gambar Anda menjadi video menakjubkan dengan kecerdasan buatan. Temukan alat gambar ke video AI gratis terbaik dengan hasil profesional dalam 2 menit.",
      ms: "Ubah imej anda menjadi video yang menakjubkan dengan kecerdasan buatan. Temui alat imej ke video AI percuma terbaik dengan hasil profesional dalam 2 minit.",
      vi: "Chuyển đổi hình ảnh của bạn thành video tuyệt đẹp với trí tuệ nhân tạo. Khám phá các công cụ hình ảnh sang video AI miễn phí tốt nhất với kết quả chuyên nghiệp trong 2 phút.",
      km: "បំប្លែងរូបថតរបស់អ្នកទៅជាវីដេអូដ៏អស្ចារ្យជាមួយនឹងវិញ្ញាបនាកម្ម។ រកឃើញឧបករណ៍រូបថតទៅវីដេអូ AI ឥតគិតថ្លៃល្អបំផុតជាមួយនឹងលទ្ធផលវិជ្ជាជីវៈក្នុងរយៈពេល 2 នាទី។",
    },
    date: "2025-01-15",
    readTime: {
      en: "8 minutes",
      zh: "8分钟",
      ja: "8分",
      de: "8 Minuten",
      es: "8 minutos",
      fr: "8 minutes",
      ko: "8분",
      hi: "8 मिनट",
      id: "8 menit",
      ms: "8 minit",
      vi: "8 phút",
      km: "8 នាទី",
    },
    keywords: {
      en: ["ai image to video", "image to video ai", "photo to video converter", "AI video generator", "free video generator"],
      zh: ["ai图像转视频", "图像转视频ai", "照片转视频转换器", "AI视频生成器", "免费视频生成器"],
      ja: ["ai画像から動画", "画像から動画ai", "写真から動画コンバーター", "AI動画ジェネレーター", "無料動画ジェネレーター"],
      de: ["ki bild zu video", "bild zu video ki", "foto zu video konverter", "KI video generator", "kostenloser video generator"],
      es: ["ai imagen a video", "imagen a video ai", "convertidor de foto a video", "generador de video IA", "generador de video gratis"],
      fr: ["ai image à vidéo", "image à vidéo ai", "convertisseur photo vers vidéo", "générateur de vidéo IA", "générateur de vidéo gratuit"],
      ko: ["ai 이미지 투 비디오", "이미지 투 비디오 ai", "사진 투 비디오 변환기", "AI 비디오 생성기", "무료 비디오 생성기"],
      hi: ["ai इमेज टू वीडियो", "इमेज टू वीडियो ai", "फोटो टू वीडियो कन्वर्टर", "AI वीडियो जनरेटर", "मुफ्त वीडियो जनरेटर"],
      id: ["ai gambar ke video", "gambar ke video ai", "konverter foto ke video", "generator video AI", "generator video gratis"],
      ms: ["ai imej ke video", "imej ke video ai", "penukar foto ke video", "penjana video AI", "penjana video percuma"],
      vi: ["ai hình ảnh sang video", "hình ảnh sang video ai", "bộ chuyển đổi ảnh sang video", "trình tạo video AI", "trình tạo video miễn phí"],
      km: ["ai រូបថតទៅវីដេអូ", "រូបថតទៅវីដេអូ ai", "ឧបករណ៍បំប្លែងរូបថតទៅវីដេអូ", "ឧបករណ៍បង្កើតវីដេអូ AI", "ឧបករណ៍បង្កើតវីដេអូឥតគិតថ្លៃ"],
    },
  },
];

// Helper function to get blog post metadata by slug
export function getBlogMetadata(slug: string): BlogMetadata | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// Helper function to get all blog posts
export function getAllBlogPosts(): BlogMetadata[] {
  return blogPosts;
}

// Helper function to get blog post content component dynamically
export async function getBlogContent(slug: string, locale: string = 'en') {
  try {
    switch (slug) {
      case "best-ai-garden-design-tools-2025":
        if (locale === 'zh') {
          const { default: BlogContentZH } = await import('./best-ai-garden-design-tools-2025/zh');
          return BlogContentZH;
        } else {
          const { default: BlogContentEN } = await import('./best-ai-garden-design-tools-2025/en');
          return BlogContentEN;
        }
      default:
        return null;
    }
  } catch (error) {
    console.error(`Error loading blog content for ${slug}:`, error);
    return null;
  }
}