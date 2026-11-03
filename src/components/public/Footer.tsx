"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Instagram, Youtube, Video, Facebook, Shield, ArrowUp } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface FooterProps {
  brandName?: string;
  logoText?: string;
  logoUrl?: string | null;
  whatsappPhone?: string;
  whatsappLocal?: string;
}

export default function Footer({
  brandName = "Built By Boyka",
  logoText = "BUILT BY BOYKA",
  logoUrl,
  whatsappPhone = "+201140108262",
  whatsappLocal = "01140108262",
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappUrl = buildWhatsAppUrl(
    whatsappPhone,
    "Hello Built By Boyka, I would like to know more about your coaching services."
  );

  return (
    <footer className="relative z-10 border-t border-white/10 bg-dark-950/90 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-full overflow-hidden border border-primary/30 shadow-lg shadow-primary/20 bg-black flex-shrink-0">
                <Image
                  src={logoUrl || "/images/logo-boyka.png"}
                  alt={brandName}
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="font-heading font-black text-2xl tracking-tight text-white">
                {logoText}
              </span>
            </div>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Uncompromising 1-on-1 online fitness coaching, precision biomechanics, tailored metabolic nutrition, and direct WhatsApp mentorship. Built for high-performers.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/builtbyboyka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@builtbyboyka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@builtbyboyka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-colors"
                aria-label="TikTok"
              >
                <Video className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/builtbyboyka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/#home" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/#featured-video" className="hover:text-white transition-colors">The Boyka Method</Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">About Coach Boyka</Link>
              </li>
              <li>
                <Link href="/#results" className="hover:text-white transition-colors">Transformations</Link>
              </li>
              <li>
                <Link href="/#packages" className="hover:text-white transition-colors">Packages & Pricing</Link>
              </li>
            </ul>
          </div>

          {/* Learning & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Community</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/#testimonials" className="hover:text-white transition-colors">Athlete Reviews</Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white transition-colors">Contact & Inquiries</Link>
              </li>
            </ul>
          </div>

          {/* WhatsApp Direct Line */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-accent">VIP Direct Line</h4>
            <p className="text-xs text-gray-400">
              Direct access for enrollment & support:
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-accent text-xs font-bold hover:bg-primary/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-accent text-accent" />
              <span>{whatsappPhone}</span>
            </a>
            <p className="text-[11px] text-gray-400">
              Local: {whatsappLocal}
            </p>
          </div>

        </div>

        {/* Bottom Bar with Admin access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link
              href="/admin/login"
              className="text-gray-600 hover:text-gray-400 flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl glass-panel text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              aria-label="Scroll to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
