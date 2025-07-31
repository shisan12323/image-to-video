import { HeroVideo } from '@/components/blocks/hero-video';
import { ImageUploadGenerator } from '@/components/blocks/image-upload-generator';
import { VideoShowcase } from '@/components/blocks/video-showcase';
import { ExcellentCases } from '@/components/blocks/excellent-cases';
import HowItWorks from '@/components/blocks/how-it-works';
import TestimonialsVideo from '@/components/blocks/testimonials-video';
import FAQVideo from '@/components/blocks/faq-video';
import PricingI18n from '@/components/blocks/pricing-i18n';
import Transformations from '@/components/blocks/transformations';
import AIFeatures from '@/components/blocks/ai-features';

export default function IndexPage() {
  return (
    <>
      <HeroVideo />
      <ImageUploadGenerator />
      <VideoShowcase />
      <ExcellentCases />
      <AIFeatures />
      <HowItWorks />
      <Transformations />
      <PricingI18n />
      <TestimonialsVideo />
      <FAQVideo />
    </>
  );
}
