import PricingI18n from "@/components/blocks/pricing-i18n";
import { getTranslations } from "next-intl/server";
import { buildCanonical, buildHreflang } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('pricing');
  
  // Construct canonical URL for pricing page
  const canonicalUrl = buildCanonical(locale, 'pricing');
  
  const ogImage = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.image-to-video.art'}/imgs/showcases/1.webp`;
  
  return {
    title: `${t('title')} - Grok Imagine`,
    description: t('description'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.grok-imagine.pro'),
    alternates: {
      canonical: canonicalUrl,
      languages: buildHreflang('pricing'),
    },
    openGraph: {
      title: `${t('title')} - Grok Imagine`,
      description: t('description'),
      url: canonicalUrl,
      images: [ogImage],
      siteName: 'Grok Imagine',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} - Grok Imagine`,
      description: t('description'),
      images: [ogImage],
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Structured data for pricing plans
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.grok-imagine.pro';
  
  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Grok Imagine Service",
    "description": "Professional AI-powered video and image generation platform",
    "brand": {
      "@type": "Brand",
      "name": "Grok Imagine"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Starter Plan",
        "description": "Perfect for small business or personal use",
        "price": "9.90",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "url": `${baseUrl}/pricing`,
        "eligibleQuantity": {
          "@type": "QuantitativeValue",
          "value": "80",
          "unitText": "AI video generations per month"
        }
      },
      {
        "@type": "Offer",
        "name": "Professional Plan",
        "description": "Ideal for video creators and marketers",
        "price": "19.90",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "url": `${baseUrl}/pricing`,
        "eligibleQuantity": {
          "@type": "QuantitativeValue",
          "value": "200",
          "unitText": "AI video generations per month"
        }
      },
      {
        "@type": "Offer",
        "name": "Business Plan",
        "description": "For agencies and enterprises",
        "price": "29.90",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "url": `${baseUrl}/pricing`,
        "eligibleQuantity": {
          "@type": "QuantitativeValue",
          "value": "500",
          "unitText": "AI video generations per month"
        }
      }
    ]
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": buildCanonical(locale)
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Pricing",
        "item": buildCanonical(locale, 'pricing')
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="pt-20">
        <PricingI18n />
      </div>
    </div>
  );
}