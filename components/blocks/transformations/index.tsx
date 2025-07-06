"use client";

import { Sparkles, MousePointer2 } from "lucide-react";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";

export default function Transformations() {
  const { ref, isVisible } = useScrollAnimation();
  const transformations = [
    {
      title: "Urban Backyard",
      style: "Japanese Zen",
      before: "/imgs/features/1.png",
      after: "/imgs/showcases/1.png",
      description: "A cluttered urban backyard transformed into a peaceful Japanese zen garden with bamboo, stones, and carefully placed plants."
    },
    {
      title: "Suburban Garden", 
      style: "English Cottage",
      before: "/imgs/features/2.png",
      after: "/imgs/showcases/2.png", 
      description: "A plain suburban lawn redesigned as a romantic English cottage garden with mixed flower borders and charming pathways."
    },
    {
      title: "Patio Space",
      style: "Modern Minimalist", 
      before: "/imgs/features/3.png",
      after: "/imgs/showcases/3.png",
      description: "A concrete patio transformed into a sleek modern minimalist garden with clean lines and geometric plant arrangements."
    }
  ];

  return (
    <section 
      ref={ref}
      className={`py-24 bg-gradient-to-b from-white to-slate-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Real AI Transformations
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Before & After Magic
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-4">
            See how our AI transforms ordinary spaces into extraordinary gardens in under 2 minutes
          </p>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <MousePointer2 className="w-4 h-4" />
            Drag the slider to compare
          </div>
        </div>
        
        <div className="space-y-24 max-w-7xl mx-auto">
          {transformations.map((transformation, index) => {
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
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium">Professional AI Design</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium">2-minute transformation</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium">Detailed plant recommendations</span>
                    </div>
                  </div>
                </div>

                {/* Image Side */}
                <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <BeforeAfterSlider
                    beforeImage={transformation.before}
                    afterImage={transformation.after}
                    className="w-full max-w-md mx-auto"
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-20">
          <p className="text-2xl font-bold text-slate-900 mb-6">
            Ready to transform your space?
          </p>
          <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-lg">
            <Sparkles className="w-5 h-5" />
            Upload your photo above to get started
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
}