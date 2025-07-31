"use client";

import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQ() {
  const t = useTranslations('faq');

  const name = t('title');
  if (!name) {
    return null;
  }

  const title = t('title');
  const description = t('description');
  const questionsObj = t.raw('questions') as Record<string, any>;
  const questions = Object.values(questionsObj || {});

  // Prepare FAQ structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map((q: any) => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };

  return (
    <>
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    <section id={name} className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            {description}
          </p>
        </div>
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {questions.map((q, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{q.question}</AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  {q.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
    </>
  );
}
