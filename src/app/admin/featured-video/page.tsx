"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageFieldPicker from "@/components/admin/ImageFieldPicker";
import {
  Video,
  Play,
  Upload,
  Link as LinkIcon,
  Save,
  Check,
  Eye,
  Sparkles,
  Layers,
  Settings2,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { getVideoEmbedUrl } from "@/lib/utils";

export default function FeaturedVideoAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const [settings, setSettings] = useState({
    title: "THE BUILT BY BOYKA METHOD",
    subtitle: "WATCH HOW WE TRANSFORM YOUR PHYSIQUE & DISCIPLINE IN 12 WEEKS",
    description:
      "Coach Boyka breaks down the exact science of progressive hypertrophy, metabolic meal planning, and daily 1-on-1 WhatsApp accountability that delivers championship-level transformations.",
    videoType: "youtube", // youtube, vimeo, upload
    videoUrl: "https://www.youtube.com/watch?v=4Y2ZdHCOXok",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
    ctaLabel: "Claim Your Free VIP Assessment",
    ctaUrl:
      "https://wa.me/201140108262?text=Hello%20Coach%20Boyka%2C%20I%20watched%20your%20service%20video%20and%20want%20to%20apply%20for%20VIP%20coaching.",
    showHeadline: true,
    showDescription: true,
    showCta: true,
    playMode: "inline", // inline, modal
    autoplay: false,
    videoWidth: "max-w-5xl",
    maxHeight: "aspect-video",
    backgroundGradient:
      "radial-gradient(ellipse at center, rgba(117, 71, 245, 0.15) 0%, rgba(5, 3, 10, 0.98) 75%)",
    order: 1,
    isVisible: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/featured-video");
        if (res.ok) {
          const data = await res.json();
          if (data && data.title) {
            setSettings((prev) => ({ ...prev, ...data }));
          }
        }
      } catch (e) {
        console.error("Error loading featured video settings:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "video" | "thumbnail"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "video") setUploadingVideo(true);
    if (type === "thumbnail") setUploadingThumbnail(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", type === "video" ? "featured-video" : "thumbnails");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (type === "video") {
        setSettings((prev) => ({
          ...prev,
          videoType: "upload",
          videoUrl: data.url,
        }));
      } else {
        setSettings((prev) => ({
          ...prev,
          thumbnailUrl: data.url,
        }));
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload file");
    } finally {
      if (type === "video") setUploadingVideo(false);
      if (type === "thumbnail") setUploadingThumbnail(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage("");
    try {
      const res = await fetch("/api/admin/featured-video", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save featured video settings");

      setSavedMessage("Featured Service Video updated & published to homepage!");
      setTimeout(() => setSavedMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Error saving featured video settings");
    } finally {
      setSaving(false);
    }
  };

  const embedUrl = getVideoEmbedUrl(settings.videoUrl, settings.autoplay);
  const isUploadedVideo =
    settings.videoType === "upload" ||
    settings.videoUrl?.endsWith(".mp4") ||
    settings.videoUrl?.endsWith(".webm");

  return (
    <AdminLayout title="Featured Service Video">
      <div className="space-y-8">
        
        {/* Header Action Bar */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <h2 className="font-heading font-black text-xl text-white">
                Featured Coaching Service Video
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Configure the single large cinematic video section on the public homepage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedMessage && (
              <span className="text-xs font-bold text-accent flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4 text-accent" />
                <span>{savedMessage}</span>
              </span>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/25 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save & Publish"}</span>
            </button>
          </div>
        </div>

        {/* Two-Column Layout: Controls on Left, Live Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Video Source & Upload */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-black text-base text-white uppercase tracking-wider flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary" />
                  <span>Video Source & Media</span>
                </h3>
                <span className="text-[11px] font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                  {settings.videoType.toUpperCase()}
                </span>
              </div>

              {/* Source Type Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Select Video Source Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "youtube", label: "YouTube URL" },
                    { id: "vimeo", label: "Vimeo URL" },
                    { id: "upload", label: "Direct MP4 Upload" },
                  ].map((src) => (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setSettings({ ...settings, videoType: src.id })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        settings.videoType === src.id
                          ? "bg-primary text-dark-950 shadow-md shadow-primary/20 scale-[1.02]"
                          : "glass-panel text-gray-400 hover:text-white"
                      }`}
                    >
                      {src.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video URL Input */}
              {settings.videoType !== "upload" ? (
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    {settings.videoType === "vimeo" ? "Vimeo Video URL" : "YouTube Video URL"}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="url"
                        value={settings.videoUrl}
                        onChange={(e) => setSettings({ ...settings, videoUrl: e.target.value })}
                        placeholder={
                          settings.videoType === "vimeo"
                            ? "https://vimeo.com/123456789"
                            : "https://www.youtube.com/watch?v=..."
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-mono focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Upload Video File (.mp4 / .webm)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary/20 text-accent border border-primary/30 hover:bg-primary/30 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingVideo ? "Uploading..." : "Upload MP4 / WebM"}</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={(e) => handleFileUpload(e, "video")}
                        className="hidden"
                      />
                    </label>
                    {settings.videoUrl && (
                      <span className="text-xs text-gray-400 font-mono truncate max-w-[200px]">
                        {settings.videoUrl}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Thumbnail */}
              <ImageFieldPicker
                label="Custom Video Poster Thumbnail"
                value={settings.thumbnailUrl || ""}
                onChange={(url) => setSettings({ ...settings, thumbnailUrl: url })}
                category="videos"
                aspectRatio="aspect-video"
                helperText="Upload custom video poster image or select from Media Library."
              />

            </div>

            {/* 2. Text Copy & Call To Action */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
              <h3 className="font-heading font-black text-base text-white uppercase tracking-wider">
                Headlines & WhatsApp CTA
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Headline Title
                </label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Subtitle Hook
                </label>
                <input
                  type="text"
                  value={settings.subtitle || ""}
                  onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Description / Service Breakdown
                </label>
                <textarea
                  rows={3}
                  value={settings.description || ""}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={settings.ctaLabel}
                    onChange={(e) => setSettings({ ...settings, ctaLabel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    CTA WhatsApp URL
                  </label>
                  <input
                    type="url"
                    value={settings.ctaUrl}
                    onChange={(e) => setSettings({ ...settings, ctaUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-mono focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

            </div>

            {/* 3. Display Toggles & Sizing */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
              <h3 className="font-heading font-black text-base text-white uppercase tracking-wider flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" />
                <span>Player Settings & Display Controls</span>
              </h3>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer glass-panel p-3 rounded-xl border border-white/5">
                  <input
                    type="checkbox"
                    checked={settings.showHeadline}
                    onChange={(e) => setSettings({ ...settings, showHeadline: e.target.checked })}
                    className="accent-primary rounded"
                  />
                  <span className="text-xs font-bold text-gray-300">Headline</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer glass-panel p-3 rounded-xl border border-white/5">
                  <input
                    type="checkbox"
                    checked={settings.showDescription}
                    onChange={(e) => setSettings({ ...settings, showDescription: e.target.checked })}
                    className="accent-primary rounded"
                  />
                  <span className="text-xs font-bold text-gray-300">Description</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer glass-panel p-3 rounded-xl border border-white/5">
                  <input
                    type="checkbox"
                    checked={settings.showCta}
                    onChange={(e) => setSettings({ ...settings, showCta: e.target.checked })}
                    className="accent-primary rounded"
                  />
                  <span className="text-xs font-bold text-gray-300">CTA Button</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer glass-panel p-3 rounded-xl border border-white/5">
                  <input
                    type="checkbox"
                    checked={settings.isVisible}
                    onChange={(e) => setSettings({ ...settings, isVisible: e.target.checked })}
                    className="accent-primary rounded"
                  />
                  <span className="text-xs font-bold text-accent">Active Section</span>
                </label>
              </div>

              {/* Player Mode & Width */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Player Mode
                  </label>
                  <select
                    value={settings.playMode}
                    onChange={(e) => setSettings({ ...settings, playMode: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  >
                    <option value="inline">Inline Player (Replaces Thumbnail)</option>
                    <option value="modal">Cinematic Lightbox Modal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Video Max Width
                  </label>
                  <select
                    value={settings.videoWidth}
                    onChange={(e) => setSettings({ ...settings, videoWidth: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  >
                    <option value="max-w-4xl">Compact (max-w-4xl)</option>
                    <option value="max-w-5xl">Standard (max-w-5xl - Recommended)</option>
                    <option value="max-w-6xl">Cinematic Wide (max-w-6xl)</option>
                    <option value="max-w-7xl">Full Screen Edge (max-w-7xl)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Autoplay on Load
                  </label>
                  <select
                    value={settings.autoplay ? "true" : "false"}
                    onChange={(e) => setSettings({ ...settings, autoplay: e.target.value === "true" })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  >
                    <option value="false">Off (User clicks to play - Recommended)</option>
                    <option value="true">On (Muted Autoplay where permitted)</option>
                  </select>
                </div>
              </div>

              {/* Background Ambient Gradient */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Section Ambient Background
                </label>
                <input
                  type="text"
                  value={settings.backgroundGradient || ""}
                  onChange={(e) => setSettings({ ...settings, backgroundGradient: e.target.value })}
                  placeholder="radial-gradient(ellipse at center, rgba(117, 71, 245, 0.15) 0%, rgba(5, 3, 10, 0.98) 75%)"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-mono focus:border-primary focus:outline-none"
                />
              </div>

            </div>

          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-5 space-y-6 sticky top-20">
            <div className="glass-card rounded-3xl p-6 border border-primary/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-accent" />
                  <span>Live Video Player Preview</span>
                </span>
                <span className="text-[10px] text-gray-400 font-mono">16:9 Aspect</span>
              </div>

              {/* Player Preview Box */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-dark-950 border border-white/10 shadow-2xl group">
                {settings.thumbnailUrl && (
                  <img
                    src={settings.thumbnailUrl}
                    alt="Preview"
                    className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-color" />

                {/* Center Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="w-16 h-16 rounded-full gradient-btn bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-lg shadow-primary/50 group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-white text-white ml-1" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-white tracking-widest">
                    {settings.playMode === "modal" ? "Plays in Modal" : "Plays Inline"}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-bold">
                  <span className="truncate max-w-[200px]">{settings.title}</span>
                  <span className="text-accent text-[10px] px-2 py-0.5 rounded bg-dark-900/80">
                    {settings.videoWidth}
                  </span>
                </div>
              </div>

              {/* Preview Meta */}
              <div className="p-4 glass-panel rounded-2xl space-y-3">
                <p className="text-xs font-bold text-white">{settings.title}</p>
                <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                  {settings.description}
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white gradient-btn bg-gradient-to-r from-primary to-secondary shadow-md shadow-primary/30"
                  >
                    {settings.ctaLabel}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
