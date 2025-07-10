import Pricing from "@/components/blocks/pricing";
import { pricingData as enPricingData } from "@/data/pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return {
    title: "Pricing - AI Garden Design",
    description: "Choose the perfect plan for your garden design needs",
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let pricingData;
  try {
    if (locale === "zh" || locale === "zh-CN") {
      pricingData = (await import("@/data/pricing.zh")).pricingData;
    } else {
      pricingData = enPricingData;
    }
  } catch (e) {
    pricingData = enPricingData;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-slate-50">
      <div className="pt-20">
        <Pricing pricing={pricingData} />
      </div>
    </div>
  );
}