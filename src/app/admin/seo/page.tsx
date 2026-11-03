"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageFieldPicker from "@/components/admin/ImageFieldPicker";
import { Globe, Save, Check, Search, Eye } from "lucide-react";

export default function SeoAdminPage() {
  const [seo, setSeo] = useState({
    metaTitle: "Built By Boyka | Premium Coaching",
    metaDescription: "Elite online fitness coaching, custom diet protocols, personalized training programs, and transformation guidance by Boyka.",
    keywords: "fitness coaching, online coach, body transformation, muscle building, fat loss, Boyka coaching, Egypt fitness, VIP fitness",
    ogImage: "",
    twitterHandle: "@builtbyboyka",
    canonicalUrl: "https://builtbyboyka.com",
    googleAnalyticsId: "",
  });

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    async function loadSeo() {
      try {
        const res = await fetch("/api/admin/seo");
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) setSeo(data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadSeo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage("");

    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seo),
      });

      if (!res.ok) throw new Error("Failed to save SEO settings");

      setSavedMessage("SEO metadata updated successfully!");
      setTimeout(() => setSavedMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="SEO & Search Engine Metadata">
      <div className="space-y-8 max-w-4xl">
        
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-black text-xl text-white">
              Search Engine Optimization & Social Previews
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Configure titles, descriptions, and Open Graph tags used by Google, WhatsApp, and social networks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedMessage && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>{savedMessage}</span>
              </span>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/25 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Metadata"}</span>
            </button>
          </div>
        </div>

        {/* Google Search Result Preview */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Search className="w-3.5 h-3.5" />
            <span>Google Search Result Snippet Preview</span>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900 border border-white/5 space-y-1">
            <p className="text-xs text-gray-400 truncate font-mono">
              {seo.canonicalUrl || "https://builtbyboyka.com"}
            </p>
            <h3 className="text-base sm:text-lg font-bold text-blue-400 hover:underline cursor-pointer">
              {seo.metaTitle || "Built By Boyka | Premium Coaching"}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
              {seo.metaDescription || "Elite online fitness coaching, custom diet protocols, personalized training programs, and transformation guidance by Boyka."}
            </p>
          </div>
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Meta Title (Search Heading) *
            </label>
            <input
              type="text"
              required
              value={seo.metaTitle || ""}
              onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Recommended: 50-60 characters. Current length: {seo.metaTitle?.length || 0}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Meta Description *
            </label>
            <textarea
              rows={3}
              required
              value={seo.metaDescription || ""}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none resize-none leading-relaxed"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Recommended: 150-160 characters. Current length: {seo.metaDescription?.length || 0}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Keywords (Comma-separated)
            </label>
            <input
              type="text"
              value={seo.keywords || ""}
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <ImageFieldPicker
                label="Social Sharing Image (Open Graph)"
                value={seo.ogImage || ""}
                onChange={(url) => setSeo({ ...seo, ogImage: url })}
                category="branding"
                aspectRatio="aspect-video"
                helperText="Upload social card image (1200x630) or select from Media Library."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Canonical Base URL
              </label>
              <input
                type="text"
                value={seo.canonicalUrl || ""}
                onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                placeholder="https://builtbyboyka.com"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </form>

      </div>
    </AdminLayout>
  );
}
