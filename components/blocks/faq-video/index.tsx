"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";
import { useTranslations } from "next-intl";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQVideo() {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations('faq');

  const faqs: FAQItem[] = t.raw('questions');

  // 预先构建 FAQ 结构化数据，让其随首屏 HTML 一并输出
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // useEffect 注入脚本已移除，改为直接在 SSR 渲染 <script>

  return (
    <section 
      ref={ref}
      className={`py-12 md:py-24 bg-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container mx-auto px-6">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            {t('title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq: FAQItem, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-900 pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 pt-2 bg-slate-50 rounded-b-lg">
                  <p className="text-slate-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 max-w-4xl mx-auto text-white">
            <h3 className="text-3xl font-bold mb-4">
              {t('cta_title')}
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              {t('cta_description')}
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-blue-100 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm">Videos Processed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm">Platforms Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">2</div>
                <div className="text-sm">Minutes Processing Time</div>
              </div>
            </div>
            <button 
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-breathe"
              onClick={() => {
                console.log('FAQ CTA button clicked!'); // 调试信息
                try {
                  const heroSection = document.getElementById('hero-section');
                  console.log('Hero section found:', heroSection); // 调试信息
                  if (heroSection) {
                    console.log('Scrolling to hero section'); // 调试信息
                    heroSection.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start' 
                    });
                  } else {
                    console.log('Hero section not found, scrolling to top'); // 调试信息
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                } catch (error) {
                  console.error('Scroll error:', error); // 调试信息
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              aria-label="Start using video watermark remover"
              title="Start Video Watermark Remover Now"
            >
              {t('cta_button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}