"use client";

import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";

export default function GardenHero() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section 
      ref={ref}
      className={`relative py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      {/* Radial gradient backgrounds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-emerald-200/30 via-emerald-100/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-radial from-cyan-200/25 via-cyan-100/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left">
            {/* Main Title with gradient */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                AI Garden Design
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 mb-6 font-bold">
              Smart landscape solutions
            </p>
            
            {/* Description */}
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Upload your yard photo and let our AI create professional landscape designs tailored to your space
            </p>
            
            {/* CTA Button */}
            <Button 
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
              Try AI Garden Design for free
            </Button>
          </div>
          
          {/* Right Side - Hero Image */}
          <div className="relative">
            <div className="relative">
              <img 
                src="/imgs/showcases/1.png" 
                alt="AI Garden Design Example" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              {/* AI Generated Badge */}
              <div 
                className="absolute bottom-4 left-4 bg-white text-slate-900 px-3 py-1 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2"
                style={{
                  animation: 'breathe 4s ease-in-out infinite'
                }}
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                AI Generated
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}