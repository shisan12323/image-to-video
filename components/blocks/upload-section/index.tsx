"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";
import { toast } from "sonner";
import downloadPhoto from "@/utils/downloadPhoto";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function UploadSection() {
  const t = useTranslations();
  const { ref, isVisible } = useScrollAnimation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [specialElements, setSpecialElements] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGenerateDesign = async () => {
    if (!selectedFile || !selectedStyle) {
      toast.error(t("upload.error_selection"));
      return;
    }

    setIsGenerating(true);
    
    try {
      // Convert file to base64
      const imageDataUrl = await convertFileToBase64(selectedFile);
      
      // Convert style display name back to the value format
      const styleDisplayNames = {
        "japanese-zen": "Japanese Zen",
        "english-cottage": "English Cottage", 
        "modern-minimalist": "Modern Minimalist",
        "mediterranean": "Mediterranean",
        "tropical-paradise": "Tropical Paradise",
        "desert-oasis": "Desert Oasis",
        "prairie-wildflower": "Prairie Wildflower",
        "french-formal": "French Formal",
        "rustic-country": "Rustic Country",
        "contemporary-urban": "Contemporary Urban"
      };
      
      const theme = styleDisplayNames[selectedStyle as keyof typeof styleDisplayNames] || selectedStyle;

      // Call the generation API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: imageDataUrl,
          theme: theme,
          elements: specialElements
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedImage(result.image);
        toast.success("Video generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate design");
      }
    } catch (error) {
      console.error("Error generating design:", error);
      toast.error("Failed to generate design. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      await downloadPhoto(generatedImage, `garden-design-${Date.now()}.png`);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  const gardenStyles = [
    "Japanese Zen",
    "English Cottage", 
    "Modern Minimalist",
    "Mediterranean",
    "Tropical Paradise",
    "Desert Oasis",
    "Prairie Wildflower",
    "French Formal",
    "Rustic Country",
    "Contemporary Urban"
  ];

  return (
    <section 
      ref={ref}
      id="upload-section"
      className={`py-12 md:py-20 bg-gradient-to-b from-emerald-50/30 via-white to-slate-50 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-radial from-emerald-200/20 via-emerald-100/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-radial from-teal-200/15 via-teal-100/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center max-w-7xl mx-auto">
          
          {/* Left Side - Upload Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t("upload.title")}
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                {t("upload.description")}
              </p>
            </div>
            
            {/* Upload Area */}
            <Card className="border-2 border-dashed border-slate-300 bg-white/70 backdrop-blur-sm hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300 cursor-pointer group">
              <div className="p-8 text-center">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {selectedFile ? (
                    <div className="space-y-3">
                      <ImageIcon className="w-12 h-12 mx-auto text-emerald-500" />
                      <div>
                        <p className="text-lg font-semibold text-emerald-600">{selectedFile.name}</p>
                        <p className="text-sm text-slate-500">{t("upload.change")}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 mx-auto text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      <div>
                        <p className="text-lg font-semibold text-slate-700">{t("upload.prompt")}</p>
                        <p className="text-sm text-slate-500">{t("upload.formats")}</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </Card>
            
            {/* Form Options */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("upload.style_label")}
                </label>
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger className="w-full h-12 bg-white border-slate-300 text-slate-900 rounded-lg">
                    <SelectValue placeholder={t("upload.style_placeholder")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {gardenStyles.map((style) => (
                      <SelectItem 
                        key={style} 
                        value={style.toLowerCase().replace(/\s+/g, '-')} 
                        className="text-slate-900 hover:bg-slate-100"
                      >
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("upload.elements_label")}
                </label>
                <Input 
                  value={specialElements}
                  onChange={(e) => setSpecialElements(e.target.value)}
                  placeholder={t("upload.elements_placeholder")}
                  className="h-12 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-lg"
                />
              </div>
              
              <Button 
                onClick={handleGenerateDesign}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                style={{
                  animation: 'breathe 3s ease-in-out infinite'
                }}
                disabled={!selectedFile || !selectedStyle || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("upload.generating")}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t("upload.generate_button")}
                  </>
                )}
              </Button>
              
            </div>
          </div>
          
          {/* Right Side - Generated Design or Placeholder */}
          <div className="relative">
            {generatedImage ? (
              /* Generated Design Display */
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 mb-4">{t("upload.result_title")}</h3>
                <div className="relative">
                  <Image 
                    src={generatedImage} 
                    alt="AI-generated professional video transformation showing custom image to video results"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-xl shadow-2xl"
                  />
                  <div 
                    className="absolute bottom-4 left-4 bg-white text-slate-900 px-3 py-1 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2"
                    style={{
                      animation: 'breathe 4s ease-in-out infinite'
                    }}
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                    {t("upload.ai_complete")}
                  </div>
                </div>
                <Button
                  onClick={handleDownload}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {t("upload.download")}
                </Button>
              </div>
            ) : (
              /* Placeholder Display */
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-8 text-center min-h-[400px] flex flex-col justify-center items-center border-2 border-dashed border-slate-300">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-slate-300 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">{t("upload.placeholder_title")}</h3>
                    <p className="text-sm text-slate-500 max-w-xs">
                      {t("upload.placeholder_text")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}