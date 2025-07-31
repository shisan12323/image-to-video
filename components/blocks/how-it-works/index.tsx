"use client";

import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const t = useTranslations('how_it_works');
  const { ref, isVisible } = useScrollAnimation();

  const steps = [
    {
      key: "upload",
      image: "/video-examples/1.png",
      altText: "Upload your image"
    },
    {
      key: "process", 
      image: "/video-examples/2.png",
      altText: "Choose video style"
    },
    {
      key: "download",
      image: "/video-examples/3.png",
      altText: "Download your video"
    }
  ];

  const button = t.raw('button');

  return (
    <section 
      ref={ref}
      className={`py-16 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl md:text-2xl font-semibold text-blue-600 mb-4">
            {t('subtitle')}
          </p>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* Steps Cards */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => {
              return (
                <div 
                  key={step.key} 
                  className={`relative group transition-all duration-500 flex ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Connection Line (hidden on mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-32 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  )}
                  
                  {/* Card */}
                  <div className="relative z-10 bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100 flex flex-col w-full">
                    {/* Step Number */}
                    <div className="absolute top-4 left-4 z-20 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md">
                      {index + 1}
                    </div>
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={step.image}
                        alt={step.altText}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                    {/* Content */}
                    <div className="p-6 text-center flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                          {t(`steps.${step.key}.title`)}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {t(`steps.${step.key}.description`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* 新增按钮区域 */}
      <div className="flex justify-center mt-10">
        <a
          href={button.url}
          className="px-10 py-5 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-400 text-white text-2xl font-semibold shadow-md transition-all duration-200 text-center flex items-center gap-4 hover:scale-105 hover:shadow-lg"
        >
          {button.text}
          <ArrowRight className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
}