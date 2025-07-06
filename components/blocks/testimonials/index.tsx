"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { useScrollAnimation } from "@/components/hooks/useScrollAnimation";

export default function Testimonials() {
  const { ref: animationRef, isVisible } = useScrollAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      name: "Sarah M.",
      location: "San Francisco, CA",
      rating: 5,
      quote: "I was skeptical about AI garden design at first, but I'm absolutely blown away by the results. My backyard transformation exceeded all expectations!"
    },
    {
      name: "Michael R.",
      location: "Austin, TX", 
      rating: 5,
      quote: "As a landscape designer, I use AI Garden Design for initial concepts. It's incredibly accurate and saves me hours of planning time."
    },
    {
      name: "Lisa K.",
      location: "Seattle, WA",
      rating: 5,
      quote: "The Japanese Zen design generated for my small patio was perfect. I followed the plan exactly and now have my dream outdoor space."
    },
    {
      name: "David L.",
      location: "Miami, FL",
      rating: 5,
      quote: "Property developer here - we use this for staging homes. The AI designs help buyers visualize the potential of outdoor spaces."
    },
    {
      name: "Emma J.",
      location: "Portland, OR",
      rating: 5,
      quote: "I'm not good with plants, but the AI recommended the perfect ones for my climate. Everything is thriving six months later!"
    },
    {
      name: "James T.",
      location: "Denver, CO",
      rating: 5,
      quote: "The before and after difference is incredible. My neighbors can't believe it's the same backyard. Worth every penny!"
    }
  ];

  // 复制数组以创建无限滚动
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const scrollDistance = scrollWidth / 2;

    let scrollPosition = 0;
    const scrollSpeed = 0.3; // 较慢的滚动速度

    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      if (scrollPosition >= scrollDistance) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 16);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section 
      ref={animationRef}
      className={`py-24 bg-gradient-to-b from-white to-slate-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            What Users Say About AI Garden Design
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who've transformed their outdoor spaces with our AI technology
          </p>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-hidden"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="flex-shrink-0 bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300"
              style={{ width: '350px' }}
            >
              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="text-slate-700 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              
              {/* Author info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}