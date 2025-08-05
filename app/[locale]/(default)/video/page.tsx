export const runtime = "edge";

import { Metadata } from 'next';
import PricingI18n from '@/components/blocks/pricing-i18n';
import { HeroVideo } from '@/components/blocks/hero-video';
import { FeatureVideo } from '@/components/blocks/feature-video';
import HowItWorks from '@/components/blocks/how-it-works';
import TestimonialsVideo from '@/components/blocks/testimonials-video';
import FAQVideo from '@/components/blocks/faq-video';
import CTAVideo from '@/components/blocks/cta-video';
import { buildCanonical, buildHreflang } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = buildCanonical(locale, 'video');
  
  return {
    title: `AI Image to Video Generator – Free Online | ImgToVideo`,
    description: 'Transform images into stunning videos in minutes with our advanced image to video AI technology. No editing skills required. Free trial available.',
    alternates: {
      canonical: canonicalUrl,
      languages: buildHreflang('video'),
    },
    openGraph: {
      title: `AI Image to Video Generator – Free Online | ImgToVideo`,
      description: 'Transform images into stunning videos in minutes with our advanced image to video AI technology. No editing skills required. Free trial available.',
      url: canonicalUrl,
      images: [`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.image-to-video.art'}/imgs/showcases/1.webp`],
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: `AI Image to Video Generator – Free Online | ImgToVideo`,
      description: 'Transform images into stunning videos in minutes with our advanced image to video AI technology. No editing skills required. Free trial available.',
      images: [`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.image-to-video.art'}/imgs/showcases/1.webp`]
    }
  };
}

export default function VideoLandingPage() {
  return (
    <>
      <HeroVideo />
      <FeatureVideo />
      <HowItWorks />
      <PricingI18n />
      <TestimonialsVideo />
      <FAQVideo />
      <CTAVideo />
      
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "AI Video Generation",
            "provider": {
              "@type": "Organization",
              "name": "ImgToVideo"
            },
            "name": "AI Image to Video Generator",
            "description": "Our AI-powered service transforms static images into dynamic, high-quality videos in minutes.",
            "audience": {
              "@type": "Audience",
              "audienceType": "Content creators, marketers, and businesses."
            }
          })
        }}
      />
      
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Image to Video",
                "item": "/video"
              }
            ]
          })
        }}
      />
    </>
  );
}