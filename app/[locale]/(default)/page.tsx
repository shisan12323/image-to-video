export const runtime = "edge";

import { getTranslations } from 'next-intl/server';
import { buildCanonical, buildHreflang } from '@/lib/seo';
import { HeroVideo } from '@/components/blocks/hero-video';
import { ImageUploadGenerator } from '@/components/blocks/image-upload-generator';
import { VideoShowcase } from '@/components/blocks/video-showcase';
import { WhatCan } from '@/components/blocks/excellent-cases';
import HowItWorks from '@/components/blocks/how-it-works';
import TestimonialsVideo from '@/components/blocks/testimonials-video';
import FAQVideo from '@/components/blocks/faq-video';
import PricingI18n from '@/components/blocks/pricing-i18n';
import Transformations from '@/components/blocks/transformations';
import AIFeatures from '@/components/blocks/ai-features';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations();
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.grok-imagine.pro';
  const ogImage = `${baseUrl}/imgs/showcases/1.webp`;

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: {
      canonical: buildCanonical(locale, ''),
      languages: buildHreflang(''),
    },
    openGraph: {
      title: t('metadata.title'),
      description: t('metadata.description'),
      url: locale === 'en' ? baseUrl : `${baseUrl}/${locale}`,
      images: [ogImage],
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metadata.title'),
      description: t('metadata.description'),
      images: [ogImage],
    },
  };
}

export default function IndexPage() {
  return (
    <>
      {/* BreadcrumbList JSON-LD for Homepage */}
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
                "item": process.env.NEXT_PUBLIC_BASE_URL || 'https://www.grok-imagine.pro'
              }
            ]
          })
        }}
      />
      <HeroVideo />
      <ImageUploadGenerator />
      <VideoShowcase />
      <HowItWorks />
      <WhatCan />
      <AIFeatures />
      <Transformations />
      <PricingI18n />
      <TestimonialsVideo />
      <FAQVideo />
    </>
  );
}
