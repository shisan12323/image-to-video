'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { Upload, Play, Sparkles, Loader2, RotateCcw, Edit, History, ChevronRight, Check, Zap } from 'lucide-react';

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
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('9:16');

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
    if (!selectedFile || !description.trim()) return;
    
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

  const aspectRatios = [
    { value: '9:16', label: t('aspect_ratio.portrait') },
    { value: '16:9', label: t('aspect_ratio.landscape') },
    { value: '1:1', label: t('aspect_ratio.square') }
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

        {/* Main Content - Single Large Card */}
        <div className="max-w-7xl mx-auto">
          <Card className="p-8 bg-white shadow-2xl rounded-2xl border-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Panel - Upload and Configuration */}
              <div className="space-y-6">
                
                {/* Upload Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Upload className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-800">{t('upload.title')}</h3>
                  </div>
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center bg-gray-50/30"
                    onClick={handleUploadClick}
                  >
                    {previewUrl ? (
                      <div className="space-y-4">
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
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                          <Upload className="w-4 h-4 mr-2" />
                          {t('upload.title')}
                        </Button>
                        <p className="text-xs text-gray-500">{t('upload.image_types')}</p>
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
                </div>

                {/* Edit Instructions Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-800">{t('edit_instructions.title')}</h3>
                  </div>
                  
                  <Textarea
                    placeholder={t('edit_instructions.placeholder')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] resize-none rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">{t('edit_instructions.helper')}</p>
                </div>

                {/* Aspect Ratio Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('aspect_ratio.title')}</h3>
                  
                  <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
                    <SelectTrigger className="w-full rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aspectRatios.map((ratio) => (
                        <SelectItem key={ratio.value} value={ratio.value}>
                          {ratio.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pro Tips Section */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-800">{t('pro_tips.title')}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{t('pro_tips.tip1')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{t('pro_tips.tip2')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{t('pro_tips.tip3')}</p>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={handleGenerate}
                  disabled={!selectedFile || !description.trim() || isGenerating}
                  className="w-full bg-green-500 hover:bg-green-600 text-white h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('generate.generating')}
                    </>
                  ) : (
                    <>
                      {t('generate.button')}
                    </>
                  )}
                </Button>
              </div>

              {/* Right Panel - Video Preview */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('preview.title')}</h3>
                  
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

                {/* Info Boxes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">100-300s</p>
                        <p className="text-xs text-gray-500">Processing Time</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">360p</p>
                        <p className="text-xs text-gray-500">Video Quality</p>
                      </div>
                    </div>
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