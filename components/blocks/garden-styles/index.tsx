"use client";

import { useEffect, useRef } from "react";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";

export default function GardenStyles() {
  const { ref: animationRef, isVisible } = useScrollAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const gardenStyles = [
    { name: "English Cottage", image: "/imgs/showcases/1.png" },
    { name: "Modern Minimalist", image: "/imgs/showcases/2.png" },
    { name: "Mediterranean", image: "/imgs/showcases/3.png" },
    { name: "Japanese Zen", image: "/imgs/showcases/4.png" },
    { name: "Tropical Paradise", image: "/imgs/showcases/5.png" },
    { name: "Desert Oasis", image: "/imgs/showcases/6.png" },
    { name: "Prairie Wildflower", image: "/imgs/showcases/7.png" },
    { name: "French Formal", image: "/imgs/showcases/8.png" },
    { name: "Rustic Country", image: "/imgs/showcases/9.png" },
    { name: "Contemporary Urban", image: "/imgs/showcases/1.png" },
    { name: "Woodland Natural", image: "/imgs/showcases/2.png" },
    { name: "Coastal Garden", image: "/imgs/showcases/3.png" },
    { name: "Victorian Formal", image: "/imgs/showcases/4.png" },
    { name: "Rock Garden", image: "/imgs/showcases/5.png" },
    { name: "Water Garden", image: "/imgs/showcases/6.png" },
    { name: "Herb Garden", image: "/imgs/showcases/7.png" }
  ];

  // 复制数组以创建无限滚动效果
  const duplicatedStyles = [...gardenStyles, ...gardenStyles];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = scrollContainer.clientWidth;
    const scrollDistance = scrollWidth / 2;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // 滚动速度

    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      // 当滚动到一半时重置到开始位置，创建无限滚动
      if (scrollPosition >= scrollDistance) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 16); // 约60fps

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section 
      ref={animationRef}
      id="garden-styles"
      className={`py-24 bg-gradient-to-b from-white via-slate-50/30 to-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      {/* 标题区域 */}
      <div className="container mx-auto px-6 mb-20">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            AI Garden Design Styles
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Our AI garden design platform offers a wide range of popular landscape styles to transform your outdoor space
          </p>
        </div>
      </div>
      
      {/* 全屏滚动区域 */}
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-hidden w-full"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedStyles.map((style, index) => (
          <div 
            key={index} 
            className="group cursor-pointer flex-shrink-0"
            style={{ width: '400px' }}
          >
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
              <img 
                src={style.image} 
                alt={style.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Style name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-bold text-2xl leading-tight drop-shadow-lg">
                  {style.name}
                </h3>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* 增加装饰元素 */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}