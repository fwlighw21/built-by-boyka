"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, X, MessageCircle, Sparkles, Volume2, ShieldCheck, ArrowRight } from "lucide-react";
import { getVideoEmbedUrl } from "@/lib/utils";

export interface FeaturedVideoProps {
  id?: string;
  title?: string;
  subtitle?: string | null;
  description?: string | null;
  videoType?: string; // youtube, vimeo, upload
  videoUrl?: string;
  thumbnailUrl?: string | null;
  ctaLabel?: string;
  ctaUrl?: string;
  showHeadline?: boolean;
  showDescription?: boolean;
  showCta?: boolean;
  playMode?: string; // inline, modal
  autoplay?: boolean;
  videoWidth?: string; // max-w-4xl, max-w-5xl, max-w-6xl, max-w-7xl
  maxHeight?: string;
  backgroundGradient?: string | null;
  isVisible?: boolean;
}

export default function FeaturedVideoSection({
  title = "THE BUILT BY BOYKA METHOD",
  subtitle = "WATCH HOW WE TRANSFORM YOUR PHYSIQUE & DISCIPLINE IN 12 WEEKS",
  description = "Coach Boyka breaks down the exact science of progressive hypertrophy, metabolic meal planning, and daily 1-on-1 WhatsApp accountability that delivers championship-level transformations.",
  videoType = "youtube",
  videoUrl = "https://www.youtube.com/watch?v=4Y2ZdHCOXok",
  thumbnailUrl = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
  ctaLabel = "Claim Your Free VIP Assessment",
  ctaUrl = "https://wa.me/201140108262?text=Hello%20Coach%20Boyka%2C%20I%20watched%20your%20service%20video%20and%20want%20to%20apply%20for%20VIP%20coaching.",
  showHeadline = true,
  showDescription = true,
  showCta = true,
  playMode = "inline",
  autoplay = false,
  videoWidth = "max-w-5xl",
  backgroundGradient,
  isVisible = true,
}: FeaturedVideoProps) {
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isVisible) return null;

  const isUploadedVideo = videoType === "upload" || videoUrl?.endsWith(".mp4") || videoUrl?.endsWith(".webm");
  const embedUrl = getVideoEmbedUrl(videoUrl, true);

  const handlePlayClick = () => {
    if (playMode === "modal") {
      setIsModalOpen(true);
    } else {
      setIsPlayingInline(true);
    }
  };

  const bgStyle = backgroundGradient
    ? { background: backgroundGradient }
    : {
        background:
          "radial-gradient(ellipse at 50% 30%, rgba(117, 71, 245, 0.12) 0%, rgba(5, 3, 10, 0.98) 75%)",
      };

  return (
    <section
      id="featured-video"
      className="relative py-24 sm:py-32 overflow-hidden border-t border-b border-purple-500/10"
      style={bgStyle}
    >
      {/* Ambient background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        {showHeadline && (
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-primary/30 text-xs font-bold tracking-widest uppercase text-accent mb-4 shadow-sm shadow-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span>THE BOYKA SYSTEM BREAKDOWN</span>
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
              {title}
            </h2>

            {subtitle && (
              <p className="text-sm sm:text-base font-semibold text-secondary uppercase tracking-wider mt-3">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Cinematic Video Player Container */}
        <div className={`mx-auto ${videoWidth} w-full`}>
          <div className="relative rounded-3xl overflow-hidden glass-card border-2 border-primary/30 hover:border-primary/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(117,71,245,0.4)] transition-all duration-500 group">
            
            {/* 16:9 Video Box */}
            <div className="relative aspect-[16/9] w-full bg-dark-950 overflow-hidden">
              
              {/* State 1: Active Inline Video Playing */}
              {isPlayingInline ? (
                isUploadedVideo ? (
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support HTML5 video.
                  </video>
                ) : (
                  <iframe
                    src={embedUrl}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )
              ) : (
                /* State 2: Cinematic Thumbnail & Play Trigger */
                <div
                  onClick={handlePlayClick}
                  className="relative w-full h-full cursor-pointer select-none"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handlePlayClick();
                  }}
                  aria-label="Play featured coaching masterclass video"
                >
                  {/* Thumbnail Image */}
                  {thumbnailUrl ? (
                    <Image
                      src={thumbnailUrl}
                      alt={title}
                      fill
                      unoptimized={thumbnailUrl.startsWith("http")}
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-dark-950 via-[#100726] to-[#1e0e45]" />
                  )}

                  {/* Gradient & Ambient Lighting Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-color" />

                  {/* Top Bar Badges */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-dark-950/80 backdrop-blur-md text-white border border-white/10 shadow-lg">
                      Full Service Breakdown
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-accent bg-primary/20 backdrop-blur-md border border-primary/30 hidden sm:inline-block">
                      1080p HD
                    </span>
                  </div>

                  {/* Center Glowing Play Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      {/* Pulsing glow ring */}
                      <span className="absolute -inset-3 rounded-full bg-primary/30 animate-ping pointer-events-none" />
                      
                      {/* Glowing Button Body */}
                      <div className="relative w-18 h-18 sm:w-24 sm:h-24 rounded-full gradient-btn bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white ml-1.5 transition-transform group-hover:scale-105" />
                      </div>
                    </div>

                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-white drop-shadow-md group-hover:text-accent transition-colors">
                      Click To Watch Coaching Overview
                    </span>
                  </div>

                  {/* Bottom Video Meta Bar */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-accent" />
                      <span className="font-medium">Sound On Recommended</span>
                    </div>
                    <span className="font-bold text-accent">Coach Boyka 1-on-1</span>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Description & Supporting Text */}
          {showDescription && description && (
            <div className="mt-8 text-center max-w-2xl mx-auto">
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                {description}
              </p>
            </div>
          )}

          {/* Prominent CTA below the Video */}
          {showCta && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-extrabold text-white gradient-btn bg-gradient-to-r from-primary to-secondary shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-[1.03] active:scale-95 group"
              >
                <MessageCircle className="w-5 h-5 fill-white text-white group-hover:rotate-12 transition-transform" />
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          )}

          {/* Direct Guarantee Subtext */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Strictly 1-on-1 direct coaching • Tailored to your physiology & routine</span>
          </div>

        </div>

      </div>

      {/* Cinematic Modal Player if playMode === "modal" */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-5xl rounded-3xl p-4 sm:p-6 border border-primary/40 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 sm:top-4 sm:right-4 p-2 rounded-full glass-panel text-gray-300 hover:text-white transition-colors z-20"
              aria-label="Close featured video modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Built By Boyka Masterclass
              </span>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                {title}
              </h3>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
              {isUploadedVideo ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                >
                  Your browser does not support HTML5 video.
                </video>
              ) : (
                <iframe
                  src={embedUrl}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              )}
            </div>

            {description && (
              <p className="text-sm text-gray-300 mt-4 leading-relaxed">
                {description}
              </p>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end">
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white gradient-btn bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{ctaLabel}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
