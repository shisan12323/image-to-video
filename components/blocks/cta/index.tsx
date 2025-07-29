'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function CTA() {
  const t = useTranslations('landing.cta');

  const name = t('name');
  if (!name) {
    return null;
  }

  const title = t('title');
  const description = t('description');
  const buttonsObj = t.raw('buttons') as Record<string, any>;
  const buttons = Object.values(buttonsObj || {});

  return (
    <section
      id={name}
      className="bg-gradient-to-t from-slate-50 to-white py-16 sm:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {buttons.map((button, i) => (
              <Button key={i} size="lg" asChild variant={button.variant || 'default'}>
                <Link href={button.url} target={button.target}>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {button.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
