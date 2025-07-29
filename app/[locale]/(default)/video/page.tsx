import { Metadata } from 'next';
import PricingI18n from '@/components/blocks/pricing-i18n';
import { HeroVideo } from '@/components/blocks/hero-video';
import { FeatureVideo } from '@/components/blocks/feature-video';
import HowItWorksVideo from '@/components/blocks/how-it-works-video';
import TestimonialsVideo from '@/components/blocks/testimonials-video';
import FAQVideo from '@/components/blocks/faq-video';
import CTAVideo from '@/components/blocks/cta-video';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale;
  
  return {
    title: `AI Image to Video Generator – Free Online | ImgToVideo`,
    description: 'Transform images into stunning videos in minutes with our advanced image to video AI technology. No editing skills required. Free trial available.',
    keywords: 'image to video, ai video generator, photo to video, free video generator, ai animation',
    alternates: {
      canonical: `/video`,
      languages: {
        'en': '/en/video',
        'es': '/es/video'
      }
    },
    openGraph: {
      title: `AI Image to Video Generator – Free Online | ImgToVideo`,
      description: 'Transform images into stunning videos in minutes with our advanced image to video AI technology. No editing skills required. Free trial available.',
      type: 'website',
      locale: locale,
      url: `/video`
    },
    twitter: {
      card: 'summary_large_image',
      title: `AI Image to Video Generator – Free Online | ImgToVideo`,
      description: 'Transform images into stunning videos in minutes with our advanced image to video AI technology. No editing skills required. Free trial available.'
    }
  };
}

export default function VideoLandingPage() {
  return (
    <>
      <HeroVideo />
      <FeatureVideo />
      <HowItWorksVideo />
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