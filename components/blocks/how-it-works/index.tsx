"use client";

import { Upload, Palette, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();
  const t = useTranslations('how_it_works');
  const steps = [
    {
      icon: Upload,
      title: t('steps.upload.title'),
      description: t('steps.upload.description')
    },
    {
      icon: Palette,
      title: t('steps.style.title'),
      description: t('steps.style.description')
    },
    {
      icon: Sparkles,
      title: t('steps.generate.title'),
      description: t('steps.generate.description')
    }
  ];

  return (
    <section 
      ref={ref}
      className={`py-24 bg-gradient-to-b from-slate-50 to-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`text-center group relative transition-all duration-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-16'
              }`}
              style={{ 
                transitionDelay: isVisible ? `${index * 200}ms` : '0ms' 
              }}
            >
              {/* Step number */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                {step.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
          
        </div>
      </div>
    </section>
  );
}