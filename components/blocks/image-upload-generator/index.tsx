'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Upload, Play, Sparkles, Loader2, RotateCcw, Edit, History, ChevronRight } from 'lucide-react';

export const ImageUploadGenerator = () => {
  const t = useTranslations('generator');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('image-to-video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string>('');
  const [description, setDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState('fast-1.4');
  const [selectedDuration, setSelectedDuration] = useState('4s');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedVideo('/sample-video.mp4');
      setIsGenerating(false);
    }, 3000);
  };

  const tabs = [
    { id: 'image-to-video', label: t('tabs.image_to_video') },
    { id: 'photo-to-video', label: t('tabs.photo_to_video') }
  ];

  return (
    <section id="upload" className="py-12 bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Top Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white rounded-xl p-1 shadow-lg border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 bg-white shadow-2xl rounded-2xl border-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Side - Upload and Controls */}
              <div className="space-y-4">
                {/* Upload Area */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center bg-gray-50/30"
                  onClick={handleUploadClick}
                >
                  {previewUrl ? (
                    <div className="space-y-3">
                      <div className="relative w-32 h-24 mx-auto rounded-xl overflow-hidden shadow-lg">
                        <Image
                          src={previewUrl}
                          alt="Selected image"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">{t('upload.change_image')}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                          <Upload className="w-4 h-4 mr-2" />
                          {t('upload.title')}
                        </Button>
                        <span className="text-gray-400 font-medium text-sm">{t('upload.or')}</span>
                        <Button variant="outline" className="border-gray-300 hover:border-blue-400 hover:bg-blue-50 px-5 py-2.5 rounded-xl">
                          <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                          {t('upload.ai_generator')}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">支持 JPG、PNG、WEBP 格式，最大 10MB</p>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Video Effects and Styles */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-between h-12 rounded-xl border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                    <span className="font-medium">{t('effects.video_effects')}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Button>
                  <Button variant="outline" className="justify-between h-12 rounded-xl border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200">
                    <span className="font-medium">{t('effects.video_styles')}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Textarea
                    placeholder={t('description.placeholder')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px] resize-none rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                  <p className="text-sm text-gray-500 text-right">{description.length}/1000</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg border-gray-200 hover:border-blue-400 hover:bg-blue-50">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                    {t('actions.ai_generate')}
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg border-gray-200 hover:border-green-400 hover:bg-green-50">
                    <Edit className="w-4 h-4 mr-2 text-green-500" />
                    {t('actions.rewrite')}
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg border-gray-200 hover:border-orange-400 hover:bg-orange-50">
                    <RotateCcw className="w-4 h-4 mr-2 text-orange-500" />
                    {t('actions.reset')}
                  </Button>
                </div>

                {/* Model Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-800">{t('model.label')}</Label>
                  <RadioGroup value={selectedModel} onValueChange={setSelectedModel} className="space-y-2">
                    <div className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${selectedModel === 'fast-1.4' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <RadioGroupItem value="fast-1.4" id="fast" />
                      <Label htmlFor="fast" className="font-medium cursor-pointer flex-1">{t('model.fast')}</Label>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">免费</span>
                    </div>
                    <div className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${selectedModel === 'pro-turbo-2.4' ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <RadioGroupItem value="pro-turbo-2.4" id="pro" />
                      <Label htmlFor="pro" className="font-medium cursor-pointer flex-1">{t('model.pro')}</Label>
                      <Badge className="bg-red-500 text-white text-xs px-2 py-1">{t('model.pro_badge')}</Badge>
                    </div>
                  </RadioGroup>
                </div>

                {/* Duration Selection */} 
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-800">{t('duration.label')}</Label>
                  <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration} className="flex gap-3">
                    <div className={`flex items-center space-x-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer flex-1 ${selectedDuration === '4s' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <RadioGroupItem value="4s" id="4s" />
                      <Label htmlFor="4s" className="font-medium cursor-pointer">{t('duration.four_seconds')}</Label>
                    </div>
                    <div className={`flex items-center space-x-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer flex-1 ${selectedDuration === '8s' ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <RadioGroupItem value="8s" id="8s" />
                      <Label htmlFor="8s" className="font-medium cursor-pointer flex items-center gap-2">
                        {t('duration.eight_seconds')}
                        <Badge className="bg-red-500 text-white text-xs px-2 py-1">{t('duration.pro_badge')}</Badge>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Generate Button */}
                <div className="flex gap-3 pt-1">
                  <Button 
                    onClick={handleGenerate}
                    disabled={!selectedFile || isGenerating}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('generate.generating')}
                      </>
                    ) : (
                      <>
                        {t('generate.button')}
                        <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm font-medium">{t('generate.credits')}</span>
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="h-12 w-12 rounded-xl border-gray-200 hover:border-gray-400 hover:bg-gray-50">
                    <History className="w-5 h-5 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Right Side - Video Preview */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{t('preview.title')}</h3>
                  
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                    {isGenerating ? (
                      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center">
                          <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-6" />
                          <p className="text-lg font-medium text-gray-700">{t('preview.generating')}</p>
                          <div className="mt-4 w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/5"></div>
                          </div>
                        </div>
                      </div>
                    ) : generatedVideo ? (
                      <video 
                        className="w-full h-full object-cover"
                        controls
                        poster={previewUrl}
                      >
                        <source src={generatedVideo} type="video/mp4" />
                      </video>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Play className="w-16 h-16 mx-auto mb-6 opacity-40" />
                          <p className="text-lg font-medium text-gray-600 mb-2">{t('preview.placeholder')}</p>
                          <p className="text-sm text-gray-500">{t('preview.upload_prompt')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};