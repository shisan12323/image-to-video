"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";
import { useTranslations } from "next-intl";

export default function FAQ() {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations('faq');

  const faqs = t.raw('questions');

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      ref={ref}
      className={`py-12 md:py-24 bg-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
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
          {faqs.map((faq, index) => (
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
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 max-w-4xl mx-auto text-white">
            <h3 className="text-3xl font-bold mb-4">
              {t('cta_title')}
            </h3>
            <p className="text-xl text-emerald-100 mb-8">
              {t('cta_description')}
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-emerald-100 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm">{t('stats.gardens_designed')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm">{t('stats.cities_served')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">2</div>
                <div className="text-sm">{t('stats.design_time')}</div>
              </div>
            </div>
            <button 
              className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{
                animation: 'breathe 3s ease-in-out infinite'
              }}
              onClick={() => {
                const uploadSection = document.getElementById('upload-section');
                if (uploadSection) {
                  uploadSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {t('cta_button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
