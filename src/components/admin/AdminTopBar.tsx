"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut, ExternalLink, ShieldCheck, User, Clock } from "lucide-react";

interface AdminTopBarProps {
  onToggleSidebar: () => void;
  title: string;
  adminName?: string;
  remainingSeconds?: number;
}

export default function AdminTopBar({
  onToggleSidebar,
  title,
  adminName = "Coach Boyka",
  remainingSeconds,
}: AdminTopBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login?reason=logged_out");
      router.refresh();
    } catch (e) {
      router.push("/admin/login?reason=logged_out");
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-dark-950/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl glass-panel text-gray-400 hover:text-white"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="font-heading font-black text-lg sm:text-xl text-white">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Strict 30-Second Inactivity Indicator */}
        {remainingSeconds !== undefined && (
          <div
            className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border transition-colors ${
              remainingSeconds <= 10
                ? "bg-red-500/10 border-red-500/40 text-red-400 animate-pulse"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            }`}
            title="Active 30-Second Inactivity Security Policy. User activity automatically touches session."
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>30s Session: {remainingSeconds}s</span>
          </div>
        )}

        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-300 glass-panel hover:text-white hover:border-primary/40 transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-primary" />
        </Link>

        {/* Admin User Chip */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full glass-panel border border-white/10">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-gray-200 hidden sm:inline">
            {adminName}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-full glass-panel text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
          title="Sign Out"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
