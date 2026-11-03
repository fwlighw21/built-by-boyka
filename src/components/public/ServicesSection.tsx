"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Check, Clock, ChevronRight, X, Sparkles } from "lucide-react";
import { getServiceWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice, parseJsonSafe } from "@/lib/utils";

export interface CoachingServiceItem {
  id: string;
  name: string;
  slug: string;
  badge?: string | null;
  shortDescription: string;
  fullDescription?: string | null;
  coverImage?: string | null;
  featuresJson: string;
  duration?: string | null;
  price?: number | null;
  currency?: string;
  ctaText?: string;
}

interface ServicesProps {
  title?: string;
  subtitle?: string;
  badge?: string | null;
  services: CoachingServiceItem[];
  whatsappPhone?: string;
  serviceTemplate?: string;
}

export default function ServicesSection({
  title = "SPECIALIZED COACHING PROGRAMS",
  subtitle = "Engineered specifically for your exact physiological targets and lifestyle demands.",
  badge = "OUR PROGRAMS",
  services = [],
  whatsappPhone = "+201140108262",
  serviceTemplate,
}: ServicesProps) {
  const [selectedService, setSelectedService] = useState<CoachingServiceItem | null>(null);

  return (
    <section id="services" className="py-24 relative z-10">
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const features = parseJsonSafe<string[]>(service.featuresJson, []);
            const waUrl = getServiceWhatsAppUrl(service.name, whatsappPhone, serviceTemplate);

            return (
              <div
                key={service.id}
                className="glass-card rounded-3xl overflow-hidden flex flex-col group border border-white/10 hover:border-primary/50 transition-all duration-300"
              >
                {/* Cover Image & Badge */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-dark-900">
                  {service.coverImage && (
                    <Image
                      src={service.coverImage}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    {service.badge ? (
                      <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-primary text-dark-950 shadow-md">
                        {service.badge}
                      </span>
                    ) : <span />}

                    {service.duration && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white glass-panel border border-white/20">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>{service.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Title on Image bottom */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-heading font-black text-2xl text-white group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {service.shortDescription}
                    </p>

                    {/* Features checklist */}
                    <ul className="mt-5 space-y-2.5">
                      {features.slice(0, 4).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & Action CTA */}
                  <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div>
                      {service.price ? (
                        <div>
                          <span className="text-xs text-gray-400 block font-medium">Investment From</span>
                          <span className="text-2xl font-black text-white font-heading">
                            {formatPrice(service.price, service.currency || "EGP")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs uppercase tracking-wider font-bold text-primary">Custom Protocol</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {service.fullDescription && (
                        <button
                          onClick={() => setSelectedService(service)}
                          className="px-4 py-3 rounded-xl text-xs font-bold text-gray-300 hover:text-white glass-panel hover:bg-white/10 transition-colors"
                        >
                          Details
                        </button>
                      )}

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>{service.ctaText || "Inquire on WhatsApp"}</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Program Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-white/15 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-2 rounded-full glass-panel text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedService.badge && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-dark-950 mb-3">
                {selectedService.badge}
              </span>
            )}

            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
              {selectedService.name}
            </h3>

            {selectedService.duration && (
              <p className="text-xs text-primary font-semibold mt-1">
                Duration: {selectedService.duration}
              </p>
            )}

            <div className="mt-5 text-gray-300 text-sm sm:text-base leading-relaxed space-y-4">
              <p>{selectedService.fullDescription || selectedService.shortDescription}</p>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-3">
                What&apos;s Included In This Program:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {parseJsonSafe<string[]>(selectedService.featuresJson, []).map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between gap-4">
              <div>
                {selectedService.price && (
                  <span className="text-xl font-black text-white font-heading">
                    {formatPrice(selectedService.price, selectedService.currency || "EGP")}
                  </span>
                )}
              </div>

              <a
                href={getServiceWhatsAppUrl(selectedService.name, whatsappPhone, serviceTemplate)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Enroll Via WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
