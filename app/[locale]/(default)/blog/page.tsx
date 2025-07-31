import { getTranslations } from "next-intl/server";
import { buildCanonical, buildHreflang } from "@/lib/seo";
import Link from "next/link";
import { getTranslation } from "@/lib/blog-translations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const titles = {
    en: "AI Image to Video Blog | Tips, Tools & Expert Advice",
    zh: "AI图片转视频博客 | 技巧、工具和专家建议",
    ja: "AI画像動画変換ブログ | ヒント、ツール＆エキスパートアドバイス",
    de: "KI-Bild-zu-Video Blog | Tipps, Tools & Expertenrat",
    es: "Blog de IA Imagen a Video | Consejos, Herramientas y Asesoramiento Experto",
    fr: "Blog IA Image vers Vidéo | Conseils, Outils et Expertise",
    ko: "AI 이미지 영상 변환 블로그 | 팁, 도구 및 전문가 조언",
    hi: "AI इमेज टू वीडियो ब्लॉग | टिप्स, टूल्स और विशेषज्ञ सलाह",
    id: "Blog AI Gambar ke Video | Tips, Alat & Saran Ahli",
    ms: "Blog AI Gambar ke Video | Tips, Alat & Nasihat Pakar",
    vi: "Blog AI Chuyển Ảnh Thành Video | Mẹo, Công Cụ & Lời Khuyên Chuyên Gia",
    km: "ប្លុកបម្លែងរូបភាពទៅជាវីដេអូ AI | គន្លឹះ ឧបករណ៍ និងដំបូន្មានពីអ្នកជំនាញ",
  };

  const descriptions = {
    en: "Discover the latest in AI image to video technology, tips for creating amazing video content, and expert advice on automated video generation.",
    zh: "发现AI图片转视频技术的最新动态、创造精彩视频内容的技巧以及自动视频生成的专家建议。",
    ja: "最新のAI画像動画変換技術、素晴らしい動画コンテンツ作成のヒント、自動動画生成のエキスパートアドバイスを発見。",
    de: "Entdecken Sie die neuesten KI-Bild-zu-Video-Technologien, Tipps für erstaunliche Videoinhalte und Expertenrat zur automatisierten Videogenerierung.",
    es: "Descubre lo último en tecnología de IA imagen a video, consejos para crear contenido de video increíble y asesoramiento experto en generación automática de videos.",
    fr: "Découvrez les dernières technologies IA image vers vidéo, des conseils pour créer du contenu vidéo incroyable et des conseils d'experts en génération vidéo automatique.",
    ko: "최신 AI 이미지 영상 변환 기술, 놀라운 영상 콘텐츠 제작 팁, 자동 영상 생성에 대한 전문가 조언을 발견하세요.",
    hi: "AI इमेज टू वीडियो तकनीक में नवीनतम खोजें, अद्भुत वीडियो सामग्री बनाने के लिए टिप्स, और स्वचालित वीडियो जेनरेशन पर विशेषज्ञ सलाह।",
    id: "Temukan teknologi AI gambar ke video terbaru, tips untuk membuat konten video yang menakjubkan, dan saran ahli tentang generasi video otomatis.",
    ms: "Temui teknologi AI gambar ke video terkini, tips untuk mencipta kandungan video yang menakjubkan, dan nasihat pakar mengenai penjanaan video automatik.",
    vi: "Khám phá công nghệ AI chuyển ảnh thành video mới nhất, mẹo tạo nội dung video tuyệt vời và lời khuyên chuyên gia về tạo video tự động.",
    km: "រកឃើញបច្ចេកវិទ្យាបម្លែងរូបភាពទៅជាវីដេអូ AI ចុងក្រោយបំផុត គន្លឹះសម្រាប់បង្កើតខ្លឹមសារវីដេអូដ៏អស្ចារ្យ និងដំបូន្មានពីអ្នកជំនាញអំពីការបង្កើតវីដេអូដោយស្វ័យប្រវត្តិ។",
  };

  const canonicalUrl = buildCanonical(locale, 'blog');
  const ogImage = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.image-to-video.art'}/imgs/showcases/1.webp`;

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    keywords: 'ai image to video blog, video generation tips, ai video creation guide, image to video tutorial',
    alternates: {
      canonical: canonicalUrl,
      languages: buildHreflang('blog'),
    },
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      url: canonicalUrl,
      images: [ogImage],
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      images: [ogImage],
    },
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const blogPosts = [
    {
      slug: "best-ai-garden-design-tools-2025",
      title: locale === "zh" 
        ? "2025年最佳AI图像转视频工具" 
        : locale === "ja"
        ? "2025年最高のAI画像から動画ツール"
        : locale === "de"
        ? "Die besten KI-Bild-zu-Video-Tools 2025"
        : locale === "es"
        ? "Las Mejores Herramientas de Imagen a Video IA 2025"
        : locale === "fr"
        ? "Les Meilleurs Outils d'Image à Vidéo IA 2025"
        : locale === "ko"
        ? "2025년 최고의 AI 이미지-투-비디오 도구"
        : locale === "hi"
        ? "2025 के सर्वश्रेष्ठ AI इमेज-टू-वीडियो टूल्स"
        : locale === "id"
        ? "Alat Gambar ke Video AI Terbaik 2025"
        : locale === "ms"
        ? "Alat Imej ke Video AI Terbaik 2025"
        : locale === "vi"
        ? "Công Cụ Hình Ảnh Sang Video AI Tốt Nhất 2025"
        : locale === "km"
        ? "ឧបករណ៍រូបថតទៅវីដេអូ AI ល្អបំផុត 2025"
        : "The Best AI Image to Video Tools in 2025",
      description: locale === "zh"
        ? "用人工智能改造您的户外空间。发现最佳免费AI花园设计工具，专业设计只需2分钟。"
        : locale === "ja"
        ? "人工知能でアウトドアスペースを変革。最高の無料AIガーデンデザインツールを発見し、2分でプロフェッショナルデザインを。"
        : locale === "de"
        ? "Verwandeln Sie Ihren Außenbereich mit künstlicher Intelligenz. Entdecken Sie die besten kostenlosen KI-Gartendesign-Tools mit professionellen Designs in 2 Minuten."
        : locale === "es"
        ? "Transforma tu espacio exterior con inteligencia artificial. Descubre las mejores herramientas gratuitas de diseño de jardines con IA con diseños profesionales en 2 minutos."
        : locale === "fr"
        ? "Transformez votre espace extérieur avec l'intelligence artificielle. Découvrez les meilleurs outils gratuits de conception de jardin IA avec des conceptions professionnelles en 2 minutes."
        : locale === "ko"
        ? "인공지능으로 야외 공간을 변화시키세요. 2분 만에 전문적인 디자인을 제공하는 최고의 무료 AI 정원 디자인 도구를 발견하세요."
        : locale === "hi"
        ? "कृत्रिम बुद्धिमत्ता के साथ अपने बाहरी स्थान को बदलें। 2 मिनट में पेशेवर डिज़ाइन के साथ सर्वश्रेष्ठ मुफ्त AI गार्डन डिज़ाइन टूल्स खोजें।"
        : locale === "id"
        ? "Transformasikan ruang luar Anda dengan kecerdasan buatan. Temukan alat desain taman AI gratis terbaik dengan desain profesional dalam 2 menit."
        : locale === "ms"
        ? "Ubah ruang luar anda dengan kecerdasan buatan. Temui alat reka bentuk taman AI percuma terbaik dengan reka bentuk profesional dalam 2 minit."
        : locale === "vi"
        ? "Biến đổi không gian ngoài trời của bạn với trí tuệ nhân tạo. Khám phá các công cụ thiết kế vườn AI miễn phí tốt nhất với thiết kế chuyên nghiệp trong 2 phút."
        : locale === "km"
        ? "ផ្លាស់ប្តូរទីតាំងខាងក្រៅរបស់អ្នកជាមួយនឹងបញ្ញាសិប្បនិម្មិត។ រកឃើញឧបករណ៍រចនាសួនច្បារ AI ឥតគិតថ្លៃល្អបំផុតជាមួយនឹងការរចនាដ៏ជំនាញក្នុងរយៈពេល 2 នាទី។"
        : "Transform your outdoor space with artificial intelligence. Discover the best free AI garden design tools with professional designs in 2 minutes.",
      date: "2025-07-11",
      readTime: locale === "zh" 
        ? "8分钟" 
        : locale === "ja" 
        ? "8分" 
        : locale === "de" 
        ? "8 Minuten" 
        : locale === "es" 
        ? "8 minutos" 
        : locale === "fr" 
        ? "8 minutes" 
        : locale === "ko" 
        ? "8분" 
        : locale === "hi" 
        ? "8 मिनट" 
        : locale === "id" 
        ? "8 menit" 
        : locale === "ms" 
        ? "8 minit" 
        : locale === "vi" 
        ? "8 phút" 
        : locale === "km" 
        ? "8 នាទី" 
        : "8 minutes",
      category: getTranslation('categories.howToGuides', locale),
      coverIcon: "🌿",
      coverGradient: "from-emerald-400 via-teal-500 to-cyan-600"
    },
  ];

  return (
    <>
      {/* BreadcrumbList JSON-LD for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": buildCanonical(locale)
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": buildCanonical(locale, 'blog')
              }
            ]
          })
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/20 to-slate-50 py-8 sm:py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {getTranslation('blogTitle', locale)}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            {getTranslation('blogSubtitle', locale)}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug}
              href={locale === 'en' ? `/blog/${post.slug}` : `/${locale}/blog/${post.slug}`}
              className="block"
            >
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer h-full flex flex-col">
                {/* Cover Image */}
                <div className={`relative h-40 sm:h-48 bg-gradient-to-br ${post.coverGradient} overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl sm:text-5xl md:text-6xl mb-1 sm:mb-2">{post.coverIcon}</div>
                      <div className="text-xs sm:text-sm font-medium opacity-90 px-2">
                        {getTranslation('blogTitle', locale)}
                      </div>
                    </div>
                  </div>
                  {/* Decorative elements - 移动端缩小 */}
                  <div className="absolute top-3 right-3 w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full"></div>
                  <div className="absolute bottom-3 left-3 w-8 h-8 sm:w-12 sm:h-12 bg-white/10 rounded-full"></div>
                  <div className="absolute top-1/2 left-4 w-4 h-4 sm:w-6 sm:h-6 bg-white/15 rounded-full"></div>
                </div>
                
                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  {/* Category Badge */}
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-3 sm:mb-4 self-start">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full"></span>
                    <span className="truncate">{post.category}</span>
                  </div>
                  
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                    {post.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        📅 
                        <span className="hidden sm:inline">{post.date}</span>
                        <span className="sm:hidden">{post.date.slice(5)}</span>
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        ⏱️ 
                        <span className="truncate">{post.readTime}</span>
                      </span>
                    </div>
                    
                    <div className="inline-flex items-center gap-1 text-emerald-600 group-hover:text-emerald-700 font-medium text-sm transition-colors flex-shrink-0 ml-2">
                      <span className="hidden sm:inline">{getTranslation('readMore', locale)}</span>
                      <span className="sm:hidden truncate">
                        {locale === "zh" ? "阅读" : 
                         locale === "ja" ? "読む" :
                         locale === "ko" ? "읽기" :
                         locale === "hi" ? "पढ़ें" :
                         locale === "id" ? "Baca" :
                         locale === "ms" ? "Baca" :
                         locale === "vi" ? "Đọc" :
                         locale === "km" ? "អាន" :
                         locale === "fr" ? "Lire" :
                         locale === "de" ? "Lesen" :
                         locale === "es" ? "Leer" :
                         "Read"}
                      </span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 sm:p-8 text-center mt-12 sm:mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            {getTranslation('ctaTitle', locale)}
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-2xl mx-auto px-2">
            {getTranslation('ctaDescription', locale)}
          </p>
          <a 
            href="https://www.image-to-video.art/#upload-section" 
            className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 rounded-xl transition-colors transform hover:scale-105 w-full sm:w-auto max-w-sm sm:max-w-none mx-auto"
          >
            🌟 
            <span className="text-center">{getTranslation('ctaButton', locale)}</span>
          </a>
        </div>
      </div>
    </div>
    </>
  );
}