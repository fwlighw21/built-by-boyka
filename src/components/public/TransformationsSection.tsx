"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Trophy, Calendar, TrendingDown, TrendingUp, Sliders, X, MessageCircle } from "lucide-react";

export interface TransformationItem {
  id: string;
  clientName: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  durationWeeks?: number | null;
  weightLossKg?: number | null;
  muscleGainKg?: number | null;
  description?: string | null;
  clientQuote?: string | null;
  isFeatured?: boolean;
}

interface TransformationsProps {
  title?: string;
  subtitle?: string;
  badge?: string | null;
  transformations: TransformationItem[];
  whatsappPhone?: string;
}

export default function TransformationsSection({
  title = "REAL CLIENT TRANSFORMATIONS",
  subtitle = "Documented progress from real people who committed to the Built By Boyka methodology.",
  badge = "UNFILTERED RESULTS",
  transformations = [],
  whatsappPhone = "+201140108262",
}: TransformationsProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sliderPosition, setSliderPosition] = useState(50); // percentage for the interactive hero comparison
  const [selectedItem, setSelectedItem] = useState<TransformationItem | null>(null);

  // Derive unique categories
  const categories = ["All", ...Array.from(new Set(transformations.map((t) => t.category)))];

  const filtered = activeCategory === "All"
    ? transformations
    : transformations.filter((t) => t.category === activeCategory);

  // The featured item for the interactive interactive split comparison
  const featured = transformations.find((t) => t.isFeatured) || transformations[0];

  return (
    <section id="results" className="py-24 relative z-10 bg-dark-900/30 border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
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

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-dark-950 shadow-lg shadow-primary/25 scale-105"
                    : "glass-panel text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Before & After Hero Spotlight */}
        {featured && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-primary/30 mb-16 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Interactive Wipe Slider */}
              <div className="lg:col-span-7">
                <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden select-none touch-none shadow-2xl">
                  
                  {/* AFTER Image (Underneath) */}
                  <Image
                    src={featured.afterImage}
                    alt={`${featured.clientName} After`}
                    fill
                    unoptimized={featured.afterImage?.startsWith("http")}
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
                    AFTER
                  </div>

                  {/* BEFORE Image (Clipped by slider position) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <Image
                      src={featured.beforeImage}
                      alt={`${featured.clientName} Before`}
                      fill
                      unoptimized={featured.beforeImage?.startsWith("http")}
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-dark-950/80 text-gray-200 border border-white/10 shadow-lg">
                      BEFORE
                    </div>
                  </div>

                  {/* Divider Line & Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-dark-950 flex items-center justify-center shadow-xl">
                      <Sliders className="w-4 h-4 text-dark-950" />
                    </div>
                  </div>

                  {/* Range Input for dragging */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    aria-label="Drag before and after transformation slider"
                  />
                </div>
                <p className="text-[11px] text-center text-gray-400 mt-2">
                  ← Drag or tap image to compare Before & After →
                </p>
              </div>

              {/* Spotlight Details */}
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-primary/20 text-accent border border-primary/30">
                    FEATURED SPOTLIGHT
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {featured.category}
                  </span>
                </div>

                <h3 className="font-heading font-black text-3xl sm:text-4xl text-white">
                  {featured.clientName}&apos;s Transformation
                </h3>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {featured.durationWeeks && (
                    <div className="glass-panel p-3 rounded-xl border border-white/5 text-center">
                      <div className="flex items-center justify-center gap-1 text-primary text-xs font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Duration</span>
                      </div>
                      <p className="font-heading font-black text-xl text-white mt-1">
                        {featured.durationWeeks} Wks
                      </p>
                    </div>
                  )}

                  {featured.weightLossKg && featured.weightLossKg > 0 ? (
                    <div className="glass-panel p-3 rounded-xl border border-white/5 text-center">
                      <div className="flex items-center justify-center gap-1 text-accent text-xs font-bold">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>Fat Lost</span>
                      </div>
                      <p className="font-heading font-black text-xl text-accent mt-1">
                        -{featured.weightLossKg} kg
                      </p>
                    </div>
                  ) : null}

                  {featured.muscleGainKg && featured.muscleGainKg > 0 ? (
                    <div className="glass-panel p-3 rounded-xl border border-white/5 text-center">
                      <div className="flex items-center justify-center gap-1 text-secondary text-xs font-bold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Muscle Gain</span>
                      </div>
                      <p className="font-heading font-black text-xl text-secondary mt-1">
                        +{featured.muscleGainKg} kg
                      </p>
                    </div>
                  ) : null}
                </div>

                {featured.clientQuote && (
                  <blockquote className="border-l-2 border-primary pl-4 py-1 text-sm text-gray-300 italic">
                    &ldquo;{featured.clientQuote}&rdquo;
                  </blockquote>
                )}

                {featured.description && (
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {featured.description}
                  </p>
                )}

                <div className="pt-2">
                  <a
                    href={`https://wa.me/201140108262?text=${encodeURIComponent(
                      `Hello Built By Boyka, I saw ${featured.clientName}'s transformation and I want to achieve similar results!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white gradient-btn bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/25 hover:scale-105 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Get Similar Results</span>
                  </a>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group border border-white/5 hover:border-primary/50 transition-all duration-300"
            >
              {/* Dual image preview */}
              <div className="relative aspect-[16/10] w-full grid grid-cols-2 overflow-hidden bg-dark-900">
                <div className="relative h-full border-r border-dark-950">
                  <Image
                    src={item.beforeImage}
                    alt={`${item.clientName} Before`}
                    fill
                    unoptimized={item.beforeImage?.startsWith("http")}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-extrabold bg-dark-950/80 text-gray-300">
                    BEFORE
                  </span>
                </div>
                <div className="relative h-full">
                  <Image
                    src={item.afterImage}
                    alt={`${item.clientName} After`}
                    fill
                    unoptimized={item.afterImage?.startsWith("http")}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-extrabold bg-gradient-to-r from-primary to-secondary text-white">
                    AFTER
                  </span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-black text-lg text-white group-hover:text-primary transition-colors">
                    {item.clientName}
                  </h4>
                  <span className="text-[11px] font-bold text-accent px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                  {item.durationWeeks && <span>⏱ {item.durationWeeks} Weeks</span>}
                  {item.weightLossKg && item.weightLossKg > 0 && (
                    <span className="text-accent font-bold">-{item.weightLossKg} kg</span>
                  )}
                  {item.muscleGainKg && item.muscleGainKg > 0 && (
                    <span className="text-secondary font-bold">+{item.muscleGainKg} kg muscle</span>
                  )}
                </div>

                {item.clientQuote && (
                  <p className="text-xs text-gray-300 line-clamp-2 italic">
                    &ldquo;{item.clientQuote}&rdquo;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 sm:p-8 border border-primary/30 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full glass-panel text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              {selectedItem.category}
            </span>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
              {selectedItem.clientName}&apos;s Transformation Details
            </h3>

            {/* Side-by-side high-res images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 block text-center">BEFORE</span>
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src={selectedItem.beforeImage}
                    alt="Before"
                    fill
                    unoptimized={selectedItem.beforeImage?.startsWith("http")}
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-accent block text-center">AFTER</span>
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-primary/40 shadow-lg shadow-primary/20">
                  <Image
                    src={selectedItem.afterImage}
                    alt="After"
                    fill
                    unoptimized={selectedItem.afterImage?.startsWith("http")}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {selectedItem.clientQuote && (
                <blockquote className="border-l-2 border-primary pl-4 text-sm text-gray-200 italic">
                  &ldquo;{selectedItem.clientQuote}&rdquo;
                </blockquote>
              )}
              {selectedItem.description && (
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedItem.description}
                </p>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-end">
              <a
                href={`https://wa.me/201140108262?text=${encodeURIComponent(
                  `Hello Built By Boyka, I saw ${selectedItem.clientName}'s results and would like to ask about coaching.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white gradient-btn bg-gradient-to-r from-primary to-secondary shadow-xl hover:scale-105 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Start Your Transformation</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
