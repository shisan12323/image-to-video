"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";

export default function UploadSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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
      className={`py-20 bg-gradient-to-b from-emerald-50/30 via-white to-slate-50 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-radial from-emerald-200/20 via-emerald-100/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-radial from-teal-200/15 via-teal-100/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          
          {/* Left Side - Upload Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Garden Design Upload
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Upload your garden photo and let our AI create a professional design
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
                        <p className="text-sm text-slate-500">Click to change photo</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 mx-auto text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      <div>
                        <p className="text-lg font-semibold text-slate-700">Upload your garden photo</p>
                        <p className="text-sm text-slate-500">Supported: JPG, PNG, WEBP, up to 5MB</p>
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
                  Garden Style
                </label>
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger className="w-full h-12 bg-white border-slate-300 text-slate-900 rounded-lg">
                    <SelectValue placeholder="Choose style..." />
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
                  Special Elements (Optional)
                </label>
                <Input 
                  placeholder="e.g., water feature, pergola, fire pit..."
                  className="h-12 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-lg"
                />
              </div>
              
              <Button 
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                style={{
                  animation: 'breathe 3s ease-in-out infinite'
                }}
                disabled={!selectedFile || !selectedStyle}
              >
                Generate Design
              </Button>
            </div>
          </div>
          
          {/* Right Side - Example Image */}
          <div className="relative">
            <div className="relative">
              <img 
                src="/imgs/showcases/1.png" 
                alt="AI Garden Design Example" 
                className="w-full h-auto rounded-xl shadow-2xl"
              />
              <div 
                className="absolute bottom-4 left-4 bg-white text-slate-900 px-3 py-1 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2"
                style={{
                  animation: 'breathe 4s ease-in-out infinite'
                }}
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                AI Generated
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}