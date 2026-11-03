"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Menu,
  Palette,
  Sparkles,
  ImageIcon,
  Video,
  Trophy,
  MessageSquareQuote,
  Dumbbell,
  Tag,
  PhoneCall,
  Share2,
  Globe,
  Settings,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Monitor,
  FolderOpen,
} from "lucide-react";

export interface NavGroup {
  id: string;
  label: string;
  icon: any;
  items: {
    label: string;
    href: string;
    icon: any;
    badge?: string;
  }[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    id: "website",
    label: "Website",
    icon: Monitor,
    items: [
      { label: "Website Content", href: "/admin/content", icon: FileText },
      { label: "Custom Pages", href: "/admin/pages", icon: Layers },
      { label: "Navigation Menus", href: "/admin/navigation", icon: Menu },
      { label: "Theme & Appearance", href: "/admin/theme", icon: Palette },
      { label: "Featured Video", href: "/admin/featured-video", icon: Video },
      { label: "Motion & Effects", href: "/admin/animations", icon: Sparkles },
    ],
  },
  {
    id: "media",
    label: "Media",
    icon: FolderOpen,
    items: [
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      { label: "Video Library", href: "/admin/videos", icon: Video },
      { label: "Client Results", href: "/admin/transformations", icon: Trophy },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
    ],
  },
  {
    id: "business",
    label: "Business",
    icon: Briefcase,
    items: [
      { label: "Coaching Services", href: "/admin/services", icon: Dumbbell },
      { label: "Packages & Pricing", href: "/admin/packages", icon: Tag },
      { label: "FAQs Manager", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    items: [
      { label: "WhatsApp & Contact", href: "/admin/contact", icon: PhoneCall },
      { label: "Social Media", href: "/admin/social", icon: Share2 },
      { label: "SEO Settings", href: "/admin/seo", icon: Globe },
      { label: "General Settings", href: "/admin/settings", icon: Settings },
      { label: "Admin Security", href: "/admin/security", icon: ShieldCheck },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  // Find which group contains the current active route
  const activeGroupId = ADMIN_NAV_GROUPS.find((group) =>
    group.items.some((item) =>
      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
    )
  )?.id || "dashboard";

  // State of open/collapsed groups (auto-opens the active one by default)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    dashboard: true,
    website: true,
    media: true,
    business: true,
    settings: true,
  });

  // Ensure active group is expanded whenever pathname changes
  useEffect(() => {
    if (activeGroupId) {
      setOpenGroups((prev) => ({
        ...prev,
        [activeGroupId]: true,
      }));
    }
  }, [activeGroupId, pathname]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-dark-950/95 border-r border-white/10 flex flex-col transition-transform duration-300 shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-primary/30 shadow-md shadow-primary/20 bg-black flex-shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo-boyka.png"
                alt="Built By Boyka"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <span className="font-heading font-black text-base tracking-tight text-white block group-hover:text-primary transition-colors">
                BOYKA ADMIN
              </span>
              <span className="text-[10px] text-primary uppercase font-bold tracking-widest block">
                Command Center
              </span>
            </div>
          </Link>
        </div>

        {/* Scrollable Nav Groups */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-3">
          {ADMIN_NAV_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            const isGroupOpen = openGroups[group.id] ?? true;
            const hasActiveItem = group.items.some((item) =>
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
            );

            return (
              <div key={group.id} className="space-y-1">
                {/* Group Header Button */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    hasActiveItem
                      ? "text-primary font-black bg-primary/5"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GroupIcon className={`w-3.5 h-3.5 ${hasActiveItem ? "text-primary" : "text-gray-400"}`} />
                    <span className="uppercase tracking-wider text-[11px]">{group.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-500 font-mono">
                      {group.items.length}
                    </span>
                    {isGroupOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Sub-Items */}
                {isGroupOpen && (
                  <div className="pl-2 space-y-0.5 animate-in fade-in duration-150">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                            isActive
                              ? "bg-gradient-to-r from-primary to-secondary text-white font-black shadow-md shadow-primary/25"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon
                              className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${
                                isActive ? "text-white" : "text-gray-400 group-hover:text-primary"
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-white/10 bg-dark-900/40">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-bold text-gray-300 hover:text-white glass-panel hover:bg-white/10 transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
          </Link>
        </div>
      </aside>
    </>
  );
}
