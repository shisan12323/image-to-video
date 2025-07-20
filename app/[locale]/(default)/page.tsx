import GardenHero from "@/components/blocks/garden-hero";
import UploadSection from "@/components/blocks/upload-section"; 
import GardenStyles from "@/components/blocks/garden-styles";
import HowItWorks from "@/components/blocks/how-it-works";
import Transformations from "@/components/blocks/transformations";
import AIFeatures from "@/components/blocks/ai-features";
import PricingI18n from "@/components/blocks/pricing-i18n";
import Testimonials from "@/components/blocks/testimonials";
import FAQ from "@/components/blocks/faq";
import { buildCanonical, buildHreflang } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const heroT = await getTranslations("hero");
  const metaT = await getTranslations("metadata");

  const canonicalUrl = buildCanonical(locale);

  return {
    title: metaT("title") || heroT("title"),
    description: metaT("description") || heroT("description"),
    alternates: {
      canonical: canonicalUrl,
      languages: buildHreflang(""),
    },
    openGraph: {
      title: metaT("title") || heroT("title"),
      description: metaT("description") || heroT("description"),
      url: canonicalUrl,
      siteName: "AI Garden Design",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.aigardendesign.online"}/og-home.jpg`,
          width: 1200,
          height: 630,
          alt: metaT("title") || heroT("title"),
        },
      ],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaT("title") || heroT("title"),
      description: metaT("description") || heroT("description"),
      images: [
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.aigardendesign.online"}/og-home.jpg`,
      ],
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <GardenHero />
      <UploadSection />
      <GardenStyles />
      <Transformations />
      <HowItWorks />
      <AIFeatures />
      <section className="py-12 md:py-20 bg-gradient-to-b from-white via-emerald-50/20 to-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-emerald-200/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-radial from-teal-200/15 to-transparent rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <PricingI18n />
        </div>
      </section>
      <Testimonials />
      <FAQ />
    </>
  );
}
