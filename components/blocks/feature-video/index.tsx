'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const FeatureVideo = () => {
  const t = useTranslations('landing-video.feature_video');

  const title = t('title');
  const itemsObj = t.raw('items') as Record<string, any>;
  const items = Object.values(itemsObj || {});

  return (
    <section id="features" className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {items.map((item, i) => (
            <Card key={i} className="flex flex-col text-center">
              <CardHeader>
                <div className="mx-auto mb-4 text-5xl">{item.icon}</div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <CardDescription className="flex-1">{item.description}</CardDescription>
                <Button className="mt-6" variant="secondary">
                  {item.button_text}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}; 