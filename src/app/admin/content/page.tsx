"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageFieldPicker from "@/components/admin/ImageFieldPicker";
import { Save, Check, RefreshCw, AlertCircle, FileText, Image as ImageIcon } from "lucide-react";

interface SectionData {
  id: string;
  sectionKey: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  body?: string | null;
  primaryButtonText?: string | null;
  primaryButtonLink?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonLink?: string | null;
  imageUrl?: string | null;
  secondaryImageUrl?: string | null;
  statsJson?: string | null;
  isVisible: boolean;
}

export default function WebsiteContentPage() {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/sections");
      if (res.ok) {
        const data = await res.json();
        setSections(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const currentSection = sections.find((s) => s.sectionKey === activeTab);

  const handleFieldChange = (field: keyof SectionData, value: any) => {
    setSections((prev) =>
      prev.map((s) => (s.sectionKey === activeTab ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    if (!currentSection) return;
    setSaving(true);
    setSavedMessage("");

    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentSection),
      });

      if (!res.ok) throw new Error("Failed to save section");

      setSavedMessage("Section updated successfully!");
      setTimeout(() => setSavedMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "hero", label: "Hero Section" },
    { key: "trust", label: "Trust Pillars" },
    { key: "about", label: "About Coach" },
    { key: "services", label: "Programs Header" },
    { key: "transformations", label: "Transformations Header" },
    { key: "packages", label: "Pricing Header" },
    { key: "contact", label: "Contact Header" },
  ];

  return (
    <AdminLayout title="Website Sections Content">
      <div className="space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-dark-950 shadow-md font-black"
                  : "glass-panel text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading Section Details...
          </div>
        ) : !currentSection ? (
          <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Section data unavailable.
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <h3 className="font-heading font-black text-xl text-white uppercase tracking-tight">
                  Editing: {tabs.find((t) => t.key === activeTab)?.label}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Changes made here appear instantly on the public website after saving.
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
                  <span>{saving ? "Saving..." : "Save Section"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {/* Visibility Switch */}
              <label className="flex items-center gap-3 p-3.5 rounded-xl glass-panel border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentSection.isVisible}
                  onChange={(e) => handleFieldChange("isVisible", e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Visible on Public Website</span>
                  <span className="text-[11px] text-gray-400">Toggle off to hide this section from visitors</span>
                </div>
              </label>

              {/* Badge & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Badge Tagline
                  </label>
                  <input
                    type="text"
                    value={currentSection.badge || ""}
                    onChange={(e) => handleFieldChange("badge", e.target.value)}
                    placeholder="e.g. ELITE 1-ON-1 COACHING"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Main Headline Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentSection.title || ""}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    placeholder="Headline title"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Subtitle / Value Proposition
                </label>
                <textarea
                  rows={2}
                  value={currentSection.subtitle || ""}
                  onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                  placeholder="Supporting subtitle text..."
                  className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none resize-none"
                />
              </div>

              {/* Body Text */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Detailed Body Narrative (Optional)
                </label>
                <textarea
                  rows={4}
                  value={currentSection.body || ""}
                  onChange={(e) => handleFieldChange("body", e.target.value)}
                  placeholder="Detailed biography or section description..."
                  className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none resize-none"
                />
              </div>

              {/* Primary & Secondary Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={currentSection.primaryButtonText || ""}
                    onChange={(e) => handleFieldChange("primaryButtonText", e.target.value)}
                    placeholder="e.g. Claim Your VIP Spot"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Primary CTA URL Link
                  </label>
                  <input
                    type="text"
                    value={currentSection.primaryButtonLink || ""}
                    onChange={(e) => handleFieldChange("primaryButtonLink", e.target.value)}
                    placeholder="https://wa.me/201140108262"
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Media Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-white/5">
                <div>
                  <ImageFieldPicker
                    label="Primary Section Image (Coach Portrait / Hero)"
                    value={currentSection.imageUrl || ""}
                    onChange={(url) => handleFieldChange("imageUrl", url)}
                    category="coach"
                    aspectRatio="aspect-[4/5]"
                    helperText="Upload official coach photo or select from Media Library. Shows in Hero / Head Coach section."
                  />
                </div>

                <div>
                  <ImageFieldPicker
                    label="Secondary Image (About Section Action Shot)"
                    value={currentSection.secondaryImageUrl || ""}
                    onChange={(url) => handleFieldChange("secondaryImageUrl", url)}
                    category="coach"
                    aspectRatio="aspect-[4/3]"
                    helperText="Upload secondary training shot or select from Media Library."
                  />
                </div>
              </div>

              {/* Stats JSON */}
              {activeTab === "hero" && (
                <div className="pt-2 border-t border-white/5">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Hero Counters (JSON Format)
                  </label>
                  <textarea
                    rows={3}
                    value={currentSection.statsJson || ""}
                    onChange={(e) => handleFieldChange("statsJson", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-mono focus:border-primary focus:outline-none resize-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Format: [{`{"number": "1,450+", "label": "Transformations"}`}, ...]
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
