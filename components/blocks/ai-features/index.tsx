"use client";

import { Card } from "@/components/ui/card";
import { 
  Zap, 
  Camera, 
  Palette, 
  Eye, 
  Brain,
  MapPin
} from "lucide-react";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";
import { useTranslations } from "next-intl";

export default function AIFeatures() {
  const { ref, isVisible } = useScrollAnimation();
  const t = useTranslations('ai_features');
  const features = [
    {
      icon: Camera,
      title: t('features.analysis.title'),
      description: t('features.analysis.description'),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: t('features.plant_selection.title'), 
      description: t('features.plant_selection.description'),
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Palette,
      title: t('features.design_optimization.title'),
      description: t('features.design_optimization.description'),
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Eye,
      title: t('features.seasonal_planning.title'),
      description: t('features.seasonal_planning.description'),
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: MapPin,
      title: "Local Plant Database",
      description: "Access curated plant recommendations from local nurseries with pricing and availability",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Complete professional garden designs generated in under 2 minutes, not weeks",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <section 
      ref={ref}
      className={`py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-radial from-emerald-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-radial from-teal-200/20 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full font-semibold mb-6">
            <Brain className="w-4 h-4" />
            {t('subtitle')}
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="group relative overflow-hidden bg-white border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl cursor-pointer hover:-translate-y-2">
              <div className="p-8 relative z-10">
                {/* Icon with gradient background */}
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  {/* Enhanced glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-30 blur-xl scale-150 transition-opacity duration-500`}></div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
              
              {/* Enhanced hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-teal-50/0 group-hover:from-emerald-50/80 group-hover:to-teal-50/80 transition-all duration-500 rounded-2xl"></div>
              
              {/* Floating particles effect */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-700"></div>
              
              {/* Border glow on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-emerald-200 transition-all duration-500"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}