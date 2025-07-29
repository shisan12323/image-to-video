'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function CTAVideo() {
  const t = useTranslations('landing.cta');

  const title = t('title');
  if (!title) {
    return null;
  }

  const description = t('description');
  const buttonsObj = t.raw('buttons') as Record<string, any>;
  const buttons = Object.values(buttonsObj || {});
  
  // 获取统计数据 (可选)
  let stats: any[] = [];
  try {
    const statsObj = t.raw('stats') as Record<string, any>;
    stats = Object.values(statsObj || {});
  } catch (error) {
    // stats是可选的，如果不存在就忽略
    stats = [];
  }

  return (
    <section id="cta" className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-emerald-100">
            {description}
          </p>
          
          {/* 统计数据 */}
          {stats.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {stats.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-emerald-100">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {buttons.map((button: any, index: number) => (
              <Button key={index} size="lg" variant="secondary" asChild className="bg-white text-emerald-600 hover:bg-emerald-50">
                <Link href={button.url} target={button.target || '_self'}>
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