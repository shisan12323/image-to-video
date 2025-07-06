import GardenHero from "@/components/blocks/garden-hero";
import UploadSection from "@/components/blocks/upload-section"; 
import GardenStyles from "@/components/blocks/garden-styles";
import HowItWorks from "@/components/blocks/how-it-works";
import Transformations from "@/components/blocks/transformations";
import AIFeatures from "@/components/blocks/ai-features";
import Pricing from "@/components/blocks/pricing";
import Testimonials from "@/components/blocks/testimonials";
import FAQ from "@/components/blocks/faq";
import { pricingData } from "@/data/pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}`;
  }

  return {
    alternates: {
      canonical: canonicalUrl,
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
      <section className="py-20 bg-gradient-to-b from-white via-emerald-50/20 to-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-emerald-200/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-radial from-teal-200/15 to-transparent rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <Pricing pricing={pricingData} />
        </div>
      </section>
      <Testimonials />
      <FAQ />
    </>
  );
}
