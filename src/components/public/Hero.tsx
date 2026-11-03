"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowRight, ShieldCheck, Flame, Trophy, Users } from "lucide-react";
import { parseJsonSafe } from "@/lib/utils";

interface HeroStat {
  number: string;
  label: string;
}

interface HeroProps {
  title?: string;
  subtitle?: string;
  badge?: string | null;
  body?: string | null;
  primaryButtonText?: string | null;
  primaryButtonLink?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonLink?: string | null;
  imageUrl?: string | null;
  statsJson?: string | null;
}

export default function Hero({
  title = "FORGE YOUR ULTIMATE PHYSIQUE",
  subtitle = "Uncompromising Elite Online Coaching. Custom Periodized Training, Metabolic Nutrition & Direct 24/7 WhatsApp Mentorship with Coach Boyka.",
  badge = "ELITE 1-ON-1 ONLINE COACHING",
  body,
  primaryButtonText = "Claim Your VIP Spot",
  primaryButtonLink = "https://wa.me/201140108262?text=Hello%20Built%20By%20Boyka%2C%20I%20would%20like%20to%20know%20more%20about%20your%20coaching%20services.",
  secondaryButtonText = "View Transformations",
  secondaryButtonLink = "/#results",
  imageUrl = "/images/head-coach.jpg",
  statsJson,
}: HeroProps) {
  const stats: HeroStat[] = parseJsonSafe<HeroStat[]>(statsJson, [
    { number: "1,450+", label: "Transformations Delivered" },
    { number: "10+ Yrs", label: "Professional Coaching" },
    { number: "99.4%", label: "Client Goal Achievement" },
    { number: "24/7", label: "Direct WhatsApp Line" },
  ]);

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/15 via-secondary/15 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Trust Badge */}
            {badge && (
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-primary/30 text-xs font-bold tracking-wider uppercase text-primary shadow-sm shadow-primary/20">
                <Flame className="w-4 h-4 text-primary animate-pulse" />
                <span>{badge}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.08]">
              {title.split(" ").map((word, i) => (
                <span key={i} className={i % 3 === 1 ? "gradient-text mr-3" : "mr-3"}>
                  {word}
                </span>
              ))}
            </h1>

            {/* Subtitle & Value Proposition */}
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl font-normal leading-relaxed">
              {subtitle}
            </p>

            {body && (
              <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
                {body}
              </p>
            )}

            {/* Call To Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <a
                href={primaryButtonLink || "https://wa.me/201140108262"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-extrabold text-white gradient-btn bg-gradient-to-r from-primary to-secondary shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
              >
                <MessageCircle className="w-5 h-5 fill-white text-white group-hover:rotate-12 transition-transform" />
                <span>{primaryButtonText || "Claim Your VIP Spot"}</span>
              </a>

              {secondaryButtonText && (
                <Link
                  href={secondaryButtonLink || "/#results"}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-gray-200 glass-panel hover:text-white hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
                >
                  <span>{secondaryButtonText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            {/* WhatsApp Direct Guarantee Info */}
            <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Direct WhatsApp access with Coach Boyka • No bots or automated assistants</span>
            </div>
          </div>

          {/* Right Column: Hero Visual, Coach Portrait & Floating Liquid Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Visual Container */}
            <div className="relative w-full max-w-md lg:max-w-none aspect-[4/5] rounded-3xl overflow-hidden glass-card p-2 border-2 border-primary/20 shadow-2xl shadow-primary/20 group">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src={imageUrl || "/images/head-coach.jpg"}
                  alt="Coach Boyka - Head Coach"
                  fill
                  priority
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
                
                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 glass-panel p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase font-bold tracking-wider text-primary">Head Coach</p>
                      <h4 className="font-heading font-black text-lg text-white">COACH BOYKA</h4>
                      <p className="text-[11px] text-gray-300">ISSA Master Trainer & Prep Specialist</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-accent">
                      <Trophy className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Achievement Badge Top-Left */}
            <div className="absolute -top-4 -left-4 sm:-left-8 glass-panel px-4 py-3 rounded-2xl border border-primary/30 shadow-xl hidden sm:flex items-center gap-3 animate-float-slow">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-accent font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Proven Results</p>
                <p className="text-sm font-extrabold text-white">1,450+ Athletes</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Statistics Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col items-center sm:items-start text-center sm:text-left hover:border-primary/40 transition-colors"
            >
              <span className="font-heading font-black text-3xl sm:text-4xl gradient-text">
                {stat.number}
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-400 mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
