'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Play, Eye, Clock, Cpu, FileText } from 'lucide-react';

// Helper function to create cases from i18n data
const createCasesFromI18n = (cases: any[], categories: string[]) => {
  return cases.map((caseData, index) => {
    const categoryIndex = index % categories.length;
    return {
      id: index + 1,
      category: categories[categoryIndex],
      originalImage: `/imgs/showcases/${index + 1}.png`,
      videoUrl: `/cases/${index + 1}.mp4`,
      videoPoster: `/cases/posters/${index + 1}.png`,
      title: caseData.title,
      description: caseData.description,
      duration: caseData.duration,
      model: index % 2 === 0 ? 'Pro-Turbo 2.4' : 'Fast 1.4',
      prompt: 'AI-powered video generation',
      views: `${Math.floor(Math.random() * 20 + 5)}.${Math.floor(Math.random() * 9)}K`,
      featured: caseData.featured
    };
  });
};

interface ExcellentCasesProps {
  limit?: number;
}

export const ExcellentCases = ({ limit }: ExcellentCasesProps) => {
  const t = useTranslations('excellent_cases');
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCases, setVisibleCases] = useState(6);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  // Get cases from i18n data
  const i18nCases = t.raw('cases') || [];
  const categoryKeys = ['photography', 'architecture', 'people', 'creative'];
  const excellentCases = createCasesFromI18n(i18nCases, categoryKeys);

  const categories = [
    { id: 'all', label: t('categories.all') },
    { id: 'photography', label: t('categories.photography') },
    { id: 'architecture', label: t('categories.architecture') },
    { id: 'people', label: t('categories.people') },
    { id: 'creative', label: t('categories.creative') }
  ];

  // Filter cases based on active category
  const filteredCases = excellentCases.filter((case_: any) => 
    activeCategory === 'all' || case_.category === activeCategory
  ).slice(0, limit || visibleCases);

  const displayedCases = limit ? filteredCases.slice(0, limit) : filteredCases.slice(0, visibleCases);

  const handleLoadMore = () => {
    setVisibleCases(prev => Math.min(prev + 6, filteredCases.length));
  };

  const handleVideoPlay = (caseId: number) => {
    setPlayingVideo(caseId);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            ✨ {t('title')}
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('subtitle')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Category Filter */}
        {/* 已删除顶部筛选tab */}

        {/* Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedCases.map((case_: any, index: number) => (
            <Card 
              key={case_.id} 
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl"
            >
              {/* Video/Image Container */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {playingVideo === case_.id ? (
                  <video
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    poster={case_.videoPoster}
                    onEnded={() => setPlayingVideo(null)}
                  >
                    <source src={case_.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <>
                    <Image
                      src={case_.originalImage}
                      alt={case_.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading={index < 6 ? "eager" : "lazy"}
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="lg"
                        onClick={() => handleVideoPlay(case_.id)}
                        className="bg-white/90 text-gray-900 hover:bg-white rounded-full p-4 shadow-lg"
                      >
                        <Play className="w-6 h-6 ml-1" fill="currentColor" />
                      </Button>
                    </div>

                    {/* Featured Badge */}
                    {case_.featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                          Featured
                        </Badge>
                      </div>
                    )}

                    {/* Duration Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-black/70 text-white text-xs px-2 py-1 backdrop-blur-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {case_.duration}
                      </Badge>
                    </div>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    {case_.title}
                  </h3>
                  {/* 已删除浏览数 */}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {case_.description}
                </p>

                {/* Metadata */}
                {/* 已删除模型和prompt等底部信息 */}
              </div>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {!limit && visibleCases < filteredCases.length && (
          <div className="text-center mt-12">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="px-8 py-3 rounded-full border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
              {t('load_more')}
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600">No cases found for this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};