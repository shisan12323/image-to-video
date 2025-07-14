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
  
  return {
    title: `${t('title')} - AI Garden Design`,
    description: t('description'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aigardendesign.online'),
    alternates: {
      canonical: canonicalUrl,
      languages: buildHreflang('pricing'),
    },
    openGraph: {
      url: canonicalUrl,
      siteName: 'AI Garden Design',
      locale: locale,
      type: 'website',
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aigardendesign.online';
  
  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "AI Garden Design Service",
    "description": "Professional AI-powered garden design service",
    "brand": {
      "@type": "Brand",
      "name": "AI Garden Design"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Starter Plan",
        "description": "Perfect for small garden homeowners",
        "price": "9.90",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "url": `${baseUrl}/pricing`,
        "eligibleQuantity": {
          "@type": "QuantitativeValue",
          "value": "80",
          "unitText": "AI garden designs per month"
        }
      },
      {
        "@type": "Offer",
        "name": "Professional Plan",
        "description": "Ideal for garden enthusiasts and landscape architects",
        "price": "19.90",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "url": `${baseUrl}/pricing`,
        "eligibleQuantity": {
          "@type": "QuantitativeValue",
          "value": "200",
          "unitText": "AI garden designs per month"
        }
      },
      {
        "@type": "Offer",
        "name": "Business Plan",
        "description": "For landscape companies and designers",
        "price": "29.90",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "url": `${baseUrl}/pricing`,
        "eligibleQuantity": {
          "@type": "QuantitativeValue",
          "value": "500",
          "unitText": "AI garden designs per month"
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