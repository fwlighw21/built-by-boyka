"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface FloatingWhatsAppProps {
  phone?: string;
  defaultMessage?: string;
  enabled?: boolean;
  position?: string;
}

export default function FloatingWhatsApp({
  phone = "+201140108262",
  defaultMessage = "Hello Built By Boyka, I would like to know more about your coaching services.",
  enabled = true,
  position = "bottom-right",
}: FloatingWhatsAppProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!enabled || dismissed) return null;

  const url = buildWhatsAppUrl(phone, defaultMessage);
  const isRight = position !== "bottom-left";

  return (
    <aside
      aria-label="WhatsApp quick chat"
      className={`fixed z-50 bottom-6 ${isRight ? "right-6" : "left-6"} flex items-center gap-3`}
    >
      {/* Interactive Tooltip Card */}
      <div
        className={`glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-300 ${
          showTooltip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        } hidden sm:flex`}
      >
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white tracking-wide">Coach Boyka Online</span>
          <span className="text-[11px] text-gray-400">Tap to start 1-on-1 consultation</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-white p-1"
          aria-label="Dismiss tooltip"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Action Button */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative group flex items-center justify-center w-14 h-14 rounded-full gradient-btn bg-gradient-to-tr from-primary to-secondary text-white shadow-2xl shadow-primary/50 hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Chat with Coach Boyka on WhatsApp"
      >
        {/* Pulsing ring animation */}
        <span className="absolute -inset-1 rounded-full bg-primary/35 animate-ping pointer-events-none" />
        
        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 fill-white text-white transition-transform group-hover:rotate-12" />

        {/* Status Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-accent border-2 border-dark-950 rounded-full" />
      </a>
    </aside>
  );
}
