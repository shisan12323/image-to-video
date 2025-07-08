"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";

export default function FAQ() {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How accurate are the AI-generated garden designs?",
      answer: "Our AI garden designs are highly accurate, taking into account your specific space dimensions, lighting conditions, and climate zone. The AI has been trained on thousands of professional landscape designs and considers factors like plant compatibility, seasonal changes, and maintenance requirements. Most users report 90%+ satisfaction with the design accuracy."
    },
    {
      question: "Is it complicated to implement the AI-generated designs?",
      answer: "Not at all! Each design comes with detailed implementation guides, plant lists with local suppliers, and step-by-step instructions. We provide shopping lists, planting schedules, and maintenance tips. Many designs can be implemented as weekend DIY projects, while others may require professional landscaping for complex features."
    },
    {
      question: "How does AI garden design compare to traditional landscape design?",
      answer: "AI garden design offers several advantages: it's faster (2 minutes vs weeks), more affordable (fraction of the cost), and provides multiple design options instantly. While traditional designers offer personal consultation, our AI considers the same principles of design, plant science, and aesthetics. Many professional landscapers actually use our tool for initial concepts."
    },
    {
      question: "What kind of photos work best for AI garden design?",
      answer: "For best results, upload clear, well-lit photos taken during daylight hours. Include the entire space you want to redesign, taken from a good vantage point. Multiple angles help, but one comprehensive photo is sufficient. The AI works with photos from any smartphone or camera - no special equipment needed."
    },
    {
      question: "What's included in the AI garden design service?",
      answer: "Each design includes: photorealistic visualizations, detailed plant lists with local availability, seasonal care guides, implementation timelines, cost estimates, and maintenance schedules. Premium plans also include multiple design variations, 3D renderings, and direct consultation with landscape professionals."
    },
    {
      question: "Can I customize the AI-generated designs?",
      answer: "Absolutely! The AI designs serve as professional starting points that you can customize. You can specify preferences like color schemes, plant types, maintenance levels, and budget constraints. Our system learns from your feedback to create increasingly personalized designs that match your style and needs."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      ref={ref}
      className={`py-24 bg-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            FAQ About AI Garden Design
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Get answers to the most common questions about our AI-powered garden design service
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-900 pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 pt-2 bg-slate-50 rounded-b-lg">
                  <p className="text-slate-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 max-w-4xl mx-auto text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Experience AI Garden Design?
            </h3>
            <p className="text-xl text-emerald-100 mb-8">
              Join thousands of gardeners who've transformed their spaces with our intelligent design system
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-emerald-100 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm">Gardens Designed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm">Cities Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">2</div>
                <div className="text-sm">Minutes Design Time</div>
              </div>
            </div>
            <button 
              className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{
                animation: 'breathe 3s ease-in-out infinite'
              }}
              onClick={() => {
                const uploadSection = document.getElementById('upload-section');
                if (uploadSection) {
                  uploadSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Start Your Garden Transformation Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
