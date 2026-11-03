"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageFieldPicker from "@/components/admin/ImageFieldPicker";
import { Settings, Save, Check } from "lucide-react";

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState({
    brandName: "Built By Boyka",
    siteTitle: "Built By Boyka | Premium Coaching",
    tagline: "Forge Your Physique. Master Your Discipline.",
    logoText: "BUILT BY BOYKA",
    logoUrl: "",
    faviconUrl: "",
    bioShort: "ISSA Certified Master Fitness Coach & Bodybuilding Prep Specialist.",
    contactEmail: "contact@builtbyboyka.com",
    contactPhone: "+201140108262",
    location: "Cairo, Egypt / Worldwide Online Coaching",
  });

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      setSavedMessage("General settings updated successfully!");
      setTimeout(() => setSavedMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="General Website Settings">
      <div className="space-y-8 max-w-4xl">
        
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-black text-xl text-white">
              Brand Identity & Site Defaults
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Configure the official brand name, browser title, and custom logo without editing code.
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
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Official Brand Name *
              </label>
              <input
                type="text"
                required
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Website Browser Title *
              </label>
              <input
                type="text"
                required
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Navbar Wordmark Text
              </label>
              <input
                type="text"
                value={settings.logoText}
                onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-white/5">
            <div>
              <ImageFieldPicker
                label="Custom Brand Logo"
                value={settings.logoUrl || ""}
                onChange={(url) => setSettings({ ...settings, logoUrl: url })}
                category="branding"
                aspectRatio="aspect-square"
                helperText="Upload official Built By Boyka logo or select from Media Library. PNG/SVG with transparency recommended."
              />
            </div>

            <div>
              <ImageFieldPicker
                label="Website Favicon / Icon"
                value={settings.faviconUrl || ""}
                onChange={(url) => setSettings({ ...settings, faviconUrl: url })}
                category="branding"
                aspectRatio="aspect-square"
                helperText="Upload 32x32 or 64x64 browser tab icon or select from Media Library."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Primary Phone / Support
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </form>

      </div>
    </AdminLayout>
  );
}
