"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientTitle?: string | null;
  avatarUrl?: string | null;
  rating: number;
  program?: string | null;
  content: string;
  isFeatured?: boolean;
}

interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  badge?: string | null;
  testimonials: TestimonialItem[];
}

export default function TestimonialsSection({
  title = "WHAT OUR ATHLETES SAY",
  subtitle = "Hear directly from those who took the leap and rebuilt themselves from the ground up.",
  badge = "TESTIMONIALS",
  testimonials = [],
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((curr) => (curr === 0 ? testimonials.length - 1 : curr - 1));
  };

  const next = () => {
    setCurrentIndex((curr) => (curr === testimonials.length - 1 ? 0 : curr + 1));
  };

  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge && (
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 mb-3">
              {badge}
            </span>
          )}
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base sm:text-lg text-gray-400 mt-4 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="glass-card rounded-3xl p-7 flex flex-col justify-between border border-white/10 hover:border-primary/40 transition-all duration-300 relative group"
            >
              <div>
                {/* Star Ratings & Program Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {t.program && (
                    <span className="text-[10px] font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                      {t.program}
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-sm text-gray-300 leading-relaxed italic relative z-10">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* Client Profile Footer */}
              <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-white/10">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/20 border border-primary/40 shrink-0">
                  {t.avatarUrl ? (
                    <Image
                      src={t.avatarUrl}
                      alt={t.clientName}
                      fill
                      unoptimized={t.avatarUrl?.startsWith("http")}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-white text-base">
                      {t.clientName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-heading font-black text-base text-white truncate">
                      {t.clientName}
                    </h4>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  {t.clientTitle && (
                    <p className="text-xs text-gray-400 truncate font-medium">
                      {t.clientTitle}
                    </p>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
