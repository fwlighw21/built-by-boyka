"use client";

import React from "react";
import { Dumbbell, Utensils, MessageSquare, Award } from "lucide-react";

interface TrustProps {
  title?: string;
  subtitle?: string;
  badge?: string | null;
}

export default function TrustIndicators({
  title = "BACKED BY SCIENCE. PROVEN BY RESULTS.",
  subtitle = "The Built By Boyka coaching methodology combines evidence-based hypertrophy mechanics, tailored metabolic programming, and relentless accountability.",
  badge = "THE BOYKA STANDARD",
}: TrustProps) {
  const pillars = [
    {
      icon: Dumbbell,
      title: "Biomechanical Precision",
      description: "Customized exercise execution based on your bone structure and active ranges of motion to trigger maximum hypertrophy safely.",
    },
    {
      icon: Utensils,
      title: "Metabolic Nutrition",
      description: "Flexible, calculated macronutrient blueprints tailored to your metabolism, schedule, and social life. Zero extreme starvation diets.",
    },
    {
      icon: MessageSquare,
      title: "24/7 VIP Accountability",
      description: "Direct WhatsApp communication line with Coach Boyka. Weekly form video reviews, mindset checks, and real-time adjustments.",
    },
    {
      icon: Award,
      title: "Sustainable Autonomy",
      description: "We don't just tell you what to do—we educate you on the science behind your training so you maintain your physique for life.",
    },
  ];

  return (
    <section className="py-20 relative z-10 border-t border-b border-white/5 bg-dark-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          {badge && (
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 mb-3">
              {badge}
            </span>
          )}
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-gray-400 mt-3 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl relative group overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-dark-950 transition-all duration-300 mb-5 shadow-lg shadow-primary/10">
                  <Icon className="w-6 h-6 transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
