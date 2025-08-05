'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Play, Loader2 } from 'lucide-react';

export const VideoShowcase = () => {
  const t = useTranslations('video_showcase');
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [loadingVideos, setLoadingVideos] = useState<Set<number>>(new Set());
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  // 创建12个视频的数据
  const videoExamples = [
    {
      id: 1,
      title: "Photography Case 1",
      category: "Photography",
      duration: "5s",
      videoUrl: "/cases/1.mp4",
      posterUrl: "/cases/posters/1.png",
      featured: true
    },
    {
      id: 2,
      title: "Architecture Case 1",
      category: "Architecture", 
      duration: "6s",
      videoUrl: "/cases/2.mp4",
      posterUrl: "/cases/posters/2.png",
      featured: false
    },
    {
      id: 3,
      title: "Photography Case 2",
      category: "Photography",
      duration: "4s",
      videoUrl: "/cases/3.mp4",
      posterUrl: "/cases/posters/3.png",
      featured: true
    },
    {
      id: 4,
      title: "Architecture Case 2",
      category: "Architecture",
      duration: "5s",
      videoUrl: "/cases/4.mp4",
      posterUrl: "/cases/posters/4.png",
      featured: false
    },
    {
      id: 5,
      title: "People Case 1",
      category: "People",
      duration: "6s",
      videoUrl: "/cases/5.mp4",
      posterUrl: "/cases/posters/5.png",
      featured: true
    },
    {
      id: 6,
      title: "Creative Case 1",
      category: "Creative",
      duration: "4s",
      videoUrl: "/cases/6.mp4",
      posterUrl: "/cases/posters/6.png",
      featured: false
    },
    {
      id: 7,
      title: "Photography Case 3",
      category: "Photography",
      duration: "5s",
      videoUrl: "/cases/7.mp4",
      posterUrl: "/cases/posters/7.png",
      featured: false
    },
    {
      id: 8,
      title: "Architecture Case 3",
      category: "Architecture",
      duration: "6s",
      videoUrl: "/cases/8.mp4",
      posterUrl: "/cases/posters/8.png",
      featured: false
    },
    {
      id: 9,
      title: "People Case 2",
      category: "People",
      duration: "3s",
      videoUrl: "/cases/9.mp4",
      posterUrl: "/cases/posters/9.png",
      featured: false
    },
    {
      id: 10,
      title: "Creative Case 2",
      category: "Creative",
      duration: "4s",
      videoUrl: "/cases/10.mp4",
      posterUrl: "/cases/posters/10.png",
      featured: false
    },
    {
      id: 11,
      title: "Photography Case 4",
      category: "Photography",
      duration: "5s",
      videoUrl: "/cases/11.mp4",
      posterUrl: "/cases/posters/11.png",
      featured: false
    },
    {
      id: 12,
      title: "Architecture Case 4",
      category: "Architecture",
      duration: "6s",
      videoUrl: "/cases/12.mp4",
      posterUrl: "/cases/posters/12.png",
      featured: true
    }
  ];

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
          {videoExamples.map((video: any) => (
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
                  {/* 视频封面图片 */}
                  <img
                    src={video.posterUrl}
                    alt={video.title}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      hoveredVideo === video.id ? 'opacity-0' : 'opacity-100'
                    }`}
                    loading={video.id <= 6 ? "eager" : "lazy"}
                  />
                  
                  {/* 悬停时显示的视频 */}
                  {hoveredVideo === video.id && (
                    <video
                      ref={setVideoRef(video.id)}
                      className="absolute inset-0 w-full h-full object-cover"
                      loop
                      muted
                      playsInline
                      autoPlay
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
                  
                  {/* 播放按钮覆盖层 - 只在没有悬停时显示 */}
                  {hoveredVideo !== video.id && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 rounded-full p-4 shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-6 h-6 text-blue-600 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  )}


                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};