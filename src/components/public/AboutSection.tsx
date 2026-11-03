"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, MessageCircle, Award, Target, Zap } from "lucide-react";
import { parseJsonSafe } from "@/lib/utils";

interface AboutProps {
  title?: string;
  subtitle?: string;
  badge?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  secondaryImageUrl?: string | null;
  primaryButtonText?: string | null;
  primaryButtonLink?: string | null;
  statsJson?: string | null;
}

export default function AboutSection({
  title = "MEET COACH BOYKA",
  subtitle = "Head Coach & Founder of Built By Boyka",
  badge = "THE COACH",
  body = "With over a decade of hands-on coaching, competitive bodybuilding, and transformative sports science education, Coach Boyka has helped thousands of athletes and everyday individuals shatter physical plateaus and sculpt championship physiques.\n\nCertified by ISSA in Master Personal Training, Sports Nutrition, and Strength Periodization, Boyka delivers an authentic, no-nonsense coaching experience tailored around your life, your metabolism, and your schedule.",
  imageUrl = "/images/head-coach.jpg",
  secondaryImageUrl = null,
  primaryButtonText = "Start With Boyka Today",
  primaryButtonLink = "https://wa.me/201140108262?text=Hello%20Built%20By%20Boyka%2C%20I%20would%20like%20to%20start%20coaching%20with%20you.",
  statsJson,
}: AboutProps) {
  const stats = parseJsonSafe<{ number: string; label: string }[]>(statsJson, [
    { number: "ISSA Master", label: "Certified Coach" },
    { number: "12,000+", label: "Hours Coaching" },
    { number: "100%", label: "Custom Programming" },
  ]);

  const highlights = [
    "ISSA Certified Master Fitness Coach & Specialist",
    "Sports Nutrition & Metabolic Rate Specialist",
    "Competitive Natural Bodybuilding Experience",
    "10+ Years Transforming Clients Globally",
  ];

  return (
    <section id="about" className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Collage with Liquid Glass Borders */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Coach Photo */}
              <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden glass-card p-2 border border-primary/30 shadow-2xl shadow-primary/10">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src={imageUrl || "/images/head-coach.jpg"}
                    alt="Coach Boyka - Head Coach"
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
                </div>
              </div>

              {/* Secondary Overlapping Training Photo */}
              {secondaryImageUrl && (
                <div className="absolute -bottom-8 -right-6 sm:-right-8 w-48 sm:w-56 aspect-[4/3] rounded-2xl overflow-hidden glass-panel p-1.5 border border-white/20 shadow-2xl hidden sm:block">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={secondaryImageUrl}
                      alt="Coach Boyka Training Technique"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Floating Credential Badge */}
              <div className="absolute top-6 -left-6 glass-panel px-4 py-3 rounded-2xl border border-primary/40 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-primary">Verified</p>
                  <p className="text-xs font-black text-white">Elite Coaching</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Bio, Philosophy & Credentials */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {badge && (
              <span className="inline-block self-start px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/20">
                {badge}
              </span>
            )}

            <div>
              <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-base sm:text-lg text-primary font-semibold mt-1">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Bio Paragraphs */}
            <div className="space-y-4 text-gray-300 text-base leading-relaxed">
              {body?.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Highlights List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              {stats.map((st, i) => (
                <div key={i}>
                  <p className="font-heading font-black text-2xl text-white gradient-text">{st.number}</p>
                  <p className="text-xs text-gray-400 font-medium">{st.label}</p>
                </div>
              ))}
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <a
                href={primaryButtonLink || "https://wa.me/201140108262"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-extrabold text-white gradient-btn bg-gradient-to-r from-primary to-secondary shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>{primaryButtonText || "Start With Boyka Today"}</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
