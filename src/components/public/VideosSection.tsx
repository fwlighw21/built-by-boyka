"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, X, Clock, Video, Sparkles } from "lucide-react";
import { getYouTubeEmbedUrl } from "@/lib/utils";

export interface VideoItemProps {
  id: string;
  title: string;
  description?: string | null;
  videoType: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  category: string;
  duration?: string | null;
  isFeatured?: boolean;
}

interface VideosProps {
  title?: string;
  subtitle?: string;
  badge?: string | null;
  videos: VideoItemProps[];
}

export default function VideosSection({
  title = "TRAINING MASTERCLASSES & HIGHLIGHTS",
  subtitle = "Watch exercise mechanics, nutrition breakdowns, and client success breakdowns.",
  badge = "VIDEO HUB",
  videos = [],
}: VideosProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItemProps | null>(null);

  return (
    <section id="videos" className="py-24 relative z-10 bg-dark-900/40 border-t border-b border-white/5">
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

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => setActiveVideo(vid)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group border border-white/10 hover:border-primary/50 transition-all duration-300 flex flex-col"
            >
              {/* Thumbnail Container with Play Overlay */}
              <div className="relative aspect-video w-full bg-dark-950 overflow-hidden">
                {vid.thumbnailUrl && (
                  <Image
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    fill
                    unoptimized={vid.thumbnailUrl?.startsWith("http")}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-dark-950/40 group-hover:bg-dark-950/20 transition-colors" />

                {/* Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary/90 text-dark-950 flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>

                {/* Duration Badge */}
                {vid.duration && (
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[11px] font-bold bg-dark-950/80 text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" />
                    <span>{vid.duration}</span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-dark-950/80 text-primary border border-primary/30">
                  {vid.category}
                </div>
              </div>

              {/* Title & Description */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-black text-lg text-white group-hover:text-primary transition-colors line-clamp-2">
                    {vid.title}
                  </h3>
                  {vid.description && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1.5 text-primary font-semibold">
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch Masterclass</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-4xl rounded-3xl p-4 sm:p-6 border border-white/20 relative shadow-2xl">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 sm:top-4 sm:right-4 p-2 rounded-full glass-panel text-gray-300 hover:text-white transition-colors z-20"
              aria-label="Close video player"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-3">
              <span className="text-xs font-bold uppercase text-primary">
                {activeVideo.category}
              </span>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                {activeVideo.title}
              </h3>
            </div>

            {/* Video Embed Frame */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.videoUrl)}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {activeVideo.description && (
              <p className="text-sm text-gray-300 mt-4 leading-relaxed">
                {activeVideo.description}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
