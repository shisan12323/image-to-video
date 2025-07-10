import PricingI18n from "@/components/blocks/pricing-i18n";
import { useTranslations } from "next-intl";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-slate-50">
      <div className="pt-20">
        <PricingI18n />
      </div>
    </div>
  );
}