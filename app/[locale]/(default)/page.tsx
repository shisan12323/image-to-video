import GardenHero from "@/components/blocks/garden-hero";
import UploadSection from "@/components/blocks/upload-section"; 
import GardenStyles from "@/components/blocks/garden-styles";
import HowItWorks from "@/components/blocks/how-it-works";
import Transformations from "@/components/blocks/transformations";
import AIFeatures from "@/components/blocks/ai-features";
import Testimonials from "@/components/blocks/testimonials";
import FAQ from "@/components/blocks/faq";

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
      <Testimonials />
      <FAQ />
    </>
  );
}
