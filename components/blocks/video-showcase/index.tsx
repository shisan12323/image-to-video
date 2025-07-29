'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Play, Loader2 } from 'lucide-react';

export const VideoShowcase = () => {
  const t = useTranslations('video_showcase');
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [loadingVideos, setLoadingVideos] = useState<Set<number>>(new Set());
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  // 增加更多视频示例数据 - 每列约3个，共12个视频
  const videoExamples = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    title: t(`examples.${index % 6}.title`),
    category: t(`examples.${index % 6}.category`),
    thumbnail: `/imgs/showcases/${(index % 8) + 1}.png`,
    duration: t(`examples.${index % 6}.duration`),
    videoUrl: `/videos/example-${index + 1}.mp4`
  }));

  const handleMouseEnter = async (videoId: number) => {
    setHoveredVideo(videoId);
    const videoElement = videoRefs.current.get(videoId);
    
    if (videoElement) {
      setLoadingVideos(prev => new Set(prev).add(videoId));
      try {
        if (videoElement.paused) {
          await videoElement.play();
        }
      } catch (error) {
        console.log('Video playback failed:', error);
      } finally {
        setLoadingVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
      }
    }
  };

  const handleMouseLeave = (videoId: number) => {
    setHoveredVideo(null);
    const videoElement = videoRefs.current.get(videoId);
    
    if (videoElement && !videoElement.paused) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  const setVideoRef = (videoId: number) => (ref: HTMLVideoElement | null) => {
    if (ref) {
      videoRefs.current.set(videoId, ref);
    } else {
      videoRefs.current.delete(videoId);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-pink-50 via-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight text-gray-900">
            {t('title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* 瀑布流/不规则布局 */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {videoExamples.map((video) => (
            <div
              key={video.id}
              className="break-inside-avoid mb-4"
              onMouseEnter={() => handleMouseEnter(video.id)}
              onMouseLeave={() => handleMouseLeave(video.id)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group cursor-pointer bg-white">
                {/* 动态高度的容器 */}
                <div 
                  className="relative w-full"
                  style={{ 
                    aspectRatio: video.id % 3 === 0 ? '3/4' : video.id % 2 === 0 ? '4/5' : '1/1'
                  }}
                >
                  {/* 静态缩略图 */}
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className={`object-cover transition-all duration-300 ${
                      hoveredVideo === video.id ? 'opacity-0' : 'opacity-100'
                    }`}
                    priority={video.id <= 6}
                  />
                  
                  {/* 视频元素 - 只在悬停时显示 */}
                  {hoveredVideo === video.id && (
                    <video
                      ref={setVideoRef(video.id)}
                      className="absolute inset-0 w-full h-full object-cover"
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    >
                      <source src={video.videoUrl} type="video/mp4" />
                    </video>
                  )}

                  {/* 加载状态 */}
                  {loadingVideos.has(video.id) && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                      <div className="bg-white/90 rounded-full p-3 shadow-lg">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      </div>
                    </div>
                  )}
                  
                  {/* 播放按钮覆盖层 - 只在没有悬停且不在播放时显示 */}
                  {hoveredVideo !== video.id && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 rounded-full p-4 shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-6 h-6 text-blue-600 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  )}

                  {/* 时长标签 */}
                  <div className="absolute top-3 right-3 z-20">
                    <Badge variant="secondary" className="bg-black/80 text-white border-0 px-3 py-1 text-xs font-medium">
                      {video.duration}
                    </Badge>
                  </div>

                  {/* 分类标签 */}
                  <div className="absolute top-3 left-3 z-20">
                    <Badge variant="outline" className="bg-white/95 text-xs font-medium border-white/50 backdrop-blur-sm text-gray-700">
                      {video.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};