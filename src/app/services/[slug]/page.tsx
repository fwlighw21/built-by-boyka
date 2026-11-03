import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { MessageCircle, Check, ArrowLeft, Clock, ShieldCheck } from "lucide-react";
import { getServiceWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice, parseJsonSafe } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const [service, site, navItems] = await Promise.all([
    prisma.coachingService.findUnique({
      where: { slug: params.slug },
    }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.navigationItem.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
  ]);

  if (!service || !service.isPublished) {
    notFound();
  }

  const features = parseJsonSafe<string[]>(service.featuresJson, []);
  const phone = site?.whatsappInternational || "+201140108262";
  const waUrl = getServiceWhatsAppUrl(service.name, phone, site?.whatsappServiceTemplate);

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Navbar
        brandName={site?.brandName}
        logoText={site?.logoText}
        logoUrl={site?.logoUrl}
        whatsappPhone={phone}
        navItems={navItems}
      />

      <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <Link
          href="/#services"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors mb-8 glass-panel px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Programs</span>
        </Link>

        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 overflow-hidden">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {service.badge && (
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-primary text-dark-950">
                {service.badge}
              </span>
            )}
            {service.duration && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 glass-panel px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{service.duration}</span>
              </span>
            )}
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white mb-4">
            {service.name}
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-3xl">
            {service.shortDescription}
          </p>

          {/* Cover Media */}
          {service.coverImage && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-10 border border-white/10">
              <Image
                src={service.coverImage}
                alt={service.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Detailed Narrative */}
          {service.fullDescription && (
            <div className="prose prose-invert max-w-none text-gray-300 text-base leading-relaxed space-y-4 mb-10">
              <h2 className="text-xl font-bold font-heading text-white">Program In-Depth Architecture</h2>
              <p>{service.fullDescription}</p>
            </div>
          )}

          {/* Features Grid */}
          <div className="border-t border-b border-white/10 py-8 my-8">
            <h3 className="font-heading font-bold text-lg text-white mb-6">
              Everything Included In This Program:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feat, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl glass-panel">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-200">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
            <div>
              {service.price ? (
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Investment Fee</span>
                  <span className="text-3xl font-black text-white font-heading">
                    {formatPrice(service.price, service.currency || "EGP")}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-bold text-primary">Custom Personalized Enrollment</span>
              )}
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>{service.ctaText || "Inquire On WhatsApp (+201140108262)"}</span>
            </a>
          </div>

        </div>
      </div>

      <Footer
        brandName={site?.brandName}
        logoText={site?.logoText}
        logoUrl={site?.logoUrl || "/images/logo-boyka.png"}
        whatsappPhone={phone}
        whatsappLocal={site?.whatsappLocal}
      />
    </main>
  );
}
