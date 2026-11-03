"use client";

import React from "react";
import { MessageCircle, Check, Sparkles, Star, Zap, ShieldAlert } from "lucide-react";
import { getPackageWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice, parseJsonSafe, calculateDiscount } from "@/lib/utils";

export interface PackageItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string | null;
  price: number;
  originalPrice?: number | null;
  currency: string;
  billingPeriod: string;
  duration: string;
  sessionsCount?: string | null;
  featuresJson: string;
  benefitsJson?: string | null;
  isFeatured?: boolean;
  badge?: string | null;
  coverImage?: string | null;
  ctaText?: string;
  customGradient?: string | null;
}

interface PackagesProps {
  title?: string;
  subtitle?: string;
  badge?: string | null;
  packages: PackageItem[];
  whatsappPhone?: string;
  packageTemplate?: string;
}

export default function PackagesSection({
  title = "INVEST IN YOUR PHYSIQUE",
  subtitle = "Choose your commitment level. Direct WhatsApp enrollment with Coach Boyka.",
  badge = "PRICING & PACKAGES",
  packages = [],
  whatsappPhone = "+201140108262",
  packageTemplate,
}: PackagesProps) {
  return (
    <section id="packages" className="py-24 relative z-10">
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

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const features = parseJsonSafe<string[]>(pkg.featuresJson, []);
            const waUrl = getPackageWhatsAppUrl(pkg.name, whatsappPhone, packageTemplate);
            const isFeatured = pkg.isFeatured;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? "glass-card border-2 border-primary shadow-2xl shadow-primary/20 md:-translate-y-4 bg-dark-850/90"
                    : "glass-card border border-white/10 hover:border-primary/40 bg-dark-900/70"
                }`}
              >
                {/* Featured Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg ${
                        isFeatured
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-primary/30"
                          : "bg-white/10 text-gray-200 border border-white/20"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{pkg.badge}</span>
                    </span>
                  </div>
                )}

                <div>
                  {/* Package Title & Description */}
                  <div className="mb-6">
                    <h3 className="font-heading font-black text-2xl text-white">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-primary font-semibold mt-1">
                      {pkg.duration}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {pkg.shortDescription}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="py-5 border-t border-b border-white/10 mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-black text-4xl sm:text-5xl text-white">
                        {formatPrice(pkg.price, pkg.currency)}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        / {pkg.billingPeriod}
                      </span>
                    </div>

                    {(() => {
                      const discount = calculateDiscount(pkg.price, pkg.originalPrice);
                      if (discount.savings <= 0) return null;
                      return (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(pkg.originalPrice, pkg.currency)}
                          </span>
                          <span className="text-[10px] font-bold text-accent px-2 py-0.5 rounded bg-primary/20 border border-primary/30">
                            Save {formatPrice(discount.savings, pkg.currency)} ({discount.percentage}% OFF)
                          </span>
                        </div>
                      );
                    })()}

                    {pkg.sessionsCount && (
                      <p className="text-xs text-gray-300 mt-2 font-medium">
                        ✓ {pkg.sessionsCount}
                      </p>
                    )}
                  </div>

                  {/* Features Checklist */}
                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                      Everything included:
                    </p>
                    <ul className="space-y-2.5">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                          <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Direct WhatsApp CTA Button */}
                <div className="pt-4">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-extrabold transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl ${
                      isFeatured
                        ? "gradient-btn bg-gradient-to-r from-primary to-secondary text-white shadow-primary/30"
                        : "glass-panel hover:border-primary/50 text-white"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{pkg.ctaText || "Join on WhatsApp"}</span>
                  </a>
                  <p className="text-[10px] text-center text-gray-400 mt-2">
                    Direct conversation with Coach Boyka
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
