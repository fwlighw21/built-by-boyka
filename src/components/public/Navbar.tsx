"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Menu, X, ChevronRight, Sparkles } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface NavItem {
  id: string;
  label: string;
  url: string;
  isExternal?: boolean;
}

interface NavbarProps {
  brandName?: string;
  logoText?: string;
  logoUrl?: string | null;
  whatsappPhone?: string;
  navItems?: NavItem[];
}

export default function Navbar({
  brandName = "Built By Boyka",
  logoText = "BUILT BY BOYKA",
  logoUrl,
  whatsappPhone = "+201140108262",
  navItems = [],
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappUrl = buildWhatsAppUrl(
    whatsappPhone,
    "Hello Built By Boyka, I would like to know more about your coaching services."
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-dark-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
          >
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden border border-primary/30 shadow-md shadow-primary/25 bg-black flex-shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src={logoUrl || "/images/logo-boyka.png"}
                alt={brandName}
                fill
                priority
                className="object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl tracking-tight text-white group-hover:text-primary transition-colors">
                {logoText}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">
                Premium Coaching
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 glass-panel px-4 py-1.5 rounded-full border border-white/5 shadow-inner">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                className="text-sm font-medium text-gray-300 hover:text-white px-3.5 py-1.5 rounded-full transition-all duration-200 hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold gradient-btn bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp VIP</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-white/10 px-6 py-6 mt-3 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-3 pb-3 border-b border-white/5">
            <div className="relative h-9 w-9 rounded-full overflow-hidden border border-primary/30 shadow-md bg-black flex-shrink-0">
              <Image
                src={logoUrl || "/images/logo-boyka.png"}
                alt={brandName}
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <span className="font-heading font-black text-base text-white block">
                {logoText}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-primary font-semibold block">
                VIP Coaching
              </span>
            </div>
          </div>
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-medium text-gray-200 hover:text-primary py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white gradient-btn bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Chat on WhatsApp (+201140108262)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
