"use client";

import { Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

interface TransformationItem {
  style: string;
  title: string;
  description: string;
  image: string;
  button?: {
    text: string;
    url: string;
  };
}

export default function Transformations() {
  const { ref, isVisible } = useScrollAnimation();
  const t = useTranslations('transformations');
  const transformations: TransformationItem[] = t.raw('examples').map((example: any, index: number) => ({
    ...example,
    image: `/imgs/showcases/${index + 1}.png`
  }));

  // 预先构建图片 JSON-LD（ImageObject 列表），随首屏 HTML 输出
  const imagesLd = {
    "@context": "https://schema.org",
    "@graph": transformations.map((item) => ({
      "@type": "ImageObject",
      "contentUrl": item.image,
      "description": item.title,
    }))
  };

  // useEffect 注入脚本已移除，改为 SSR 直接渲染 <script>

  return (
    <section 
      ref={ref}
      className={`py-12 md:py-24 bg-gradient-to-b from-white to-slate-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      {/* Gallery Image JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imagesLd) }}
      />
      <div className="container mx-auto px-8">
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            {t('badge')}
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
        
        <div className="space-y-24 max-w-7xl mx-auto">
          {transformations.map((transformation: TransformationItem, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={index} 
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center transition-all duration-700 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-16'
                }`}
                style={{ 
                  transitionDelay: isVisible ? `${index * 200}ms` : '0ms' 
                }}
              >
                {/* Content Side */}
                <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'} space-y-6`}>
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                      <Sparkles className="w-4 h-4" />
                      {transformation.style}
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                      {transformation.title}
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {transformation.description}
                    </p>
                  </div>
                  
                  {/* Features List */}
                  <div className="space-y-3">
                    {t.raw('features').map((feature: string, featureIndex: number) => (
                      <div key={featureIndex} className="flex items-center gap-3 text-slate-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {/* CTA Button */}
                  <div className="mt-6">
                    <a
                      href={transformation.button?.url || "/#upload"}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-400 text-white text-lg font-semibold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                      {transformation.button?.text}
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Image Side */}
                <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={transformation.image}
                      alt={transformation.title}
                      width={400}
                      height={300}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-20">
          <p className="text-2xl font-bold text-slate-900 mb-6">
            {t('cta_title')}
          </p>
          <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-lg">
            <Sparkles className="w-5 h-5" />
            {t('cta_description')}
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
}