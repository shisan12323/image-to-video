"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";
import { useTranslations } from "next-intl";

export default function TestimonialsVideo() {
  const { ref: animationRef, isVisible } = useScrollAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('testimonials');

  const testimonials = t.raw('reviews').map((review: any) => ({
    ...review,
    rating: 5
  }));

  // 复制数组以创建无限滚动
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const scrollDistance = scrollWidth / 2;

    let scrollPosition = 0;
    const scrollSpeed = 0.3; // 较慢的滚动速度

    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      if (scrollPosition >= scrollDistance) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 16);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section 
      ref={animationRef}
      className={`py-12 md:py-24 bg-gradient-to-br from-slate-50/70 via-blue-50/50 to-white transition-all duration-1000 ${
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
        
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-hidden"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="flex-shrink-0 bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300"
              style={{ width: '350px' }}
            >
              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="text-slate-700 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              
              {/* Author info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}