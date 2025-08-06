'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Play } from 'lucide-react';

export const HeroVideo = () => {
  const t = useTranslations('hero');

  const topBadge = t('top_badge');
  const titleLine1 = t('title_line1');
  const subtitle = t('subtitle');
  const description = t('description');
  const ctaButton = t('cta_button');
  
  // Safely get objects with fallbacks
  const buttonsObj = t.raw('buttons') as Record<string, any> || {};
  const buttons = Object.values(buttonsObj);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        {/* Video Background - Replace with your video file */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.warn('Video failed to load, falling back to image');
            const videoElement = e.target as HTMLVideoElement;
            videoElement.style.display = 'none';
          }}
        >
          <source src="/hero-background.mp4" type="video/mp4" />
          <source src="/hero-background.webm" type="video/webm" />
          {/* Fallback image if video fails to load */}
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Fallback Background Image - Comment out when using video */}
        {/* <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/imgs/showcases/1.webp')`
          }}
        /> */}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Top Badge */}
        <div className="inline-block mb-6">
          <span className="text-sm font-medium tracking-wide uppercase opacity-90">
            {topBadge}
          </span>
        </div>
        
        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
          {titleLine1}
        </h1>
        
        {/* Subtitle */}
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-6 opacity-90">
          {subtitle}
        </h2>
        
        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl mb-10 leading-relaxed max-w-3xl mx-auto opacity-90 px-4">
          {description}
        </p>
        
        {/* CTA Button */}
        <div className="flex justify-center">
          <Button 
            size="lg"
            asChild
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full h-auto border-0 shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Link href="/#upload">
              <Play className="mr-2 h-5 w-5" />
              {ctaButton}
            </Link>
          </Button>
        </div>
      </div>

      {/* Scroll indicator (optional) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}; 