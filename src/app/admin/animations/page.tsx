"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Sparkles, Save, Check, Sliders, Eye, RefreshCw } from "lucide-react";

export default function AnimationsPage() {
  const [settings, setSettings] = useState({
    animationsEnabled: true,
    reducedMotion: false,
    orbCount: 3,
    animationSpeed: "normal",
    animationIntensity: "medium",
    blurAmount: 90,
    backgroundEffect: "floating-orbs",
    entranceAnimation: "fade-up",
    hoverEffects: true,
  });

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/animations");
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            setSettings(data);
          }
        }
      } catch (e) {
        console.error("Error loading animation settings:", e);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage("");
    try {
      const res = await fetch("/api/admin/animations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save animation settings");

      setSavedMessage("Animation settings saved!");
      setTimeout(() => setSavedMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Background Animations & Motion">
      <div className="space-y-8 max-w-4xl">
        
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-black text-xl text-white">
              Motion & Ambient Effects
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Configure floating orbs, movement speed, blur intensity, and accessibility settings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedMessage && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
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

        {/* Master Toggles */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="font-heading font-black text-base uppercase tracking-wider text-gray-300">
            Master Motion Switches
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/5 cursor-pointer">
              <div>
                <span className="text-sm font-bold text-white block">Background Animations</span>
                <span className="text-xs text-gray-400">Enable floating orbs & mesh lighting</span>
              </div>
              <input
                type="checkbox"
                checked={settings.animationsEnabled}
                onChange={(e) => setSettings({ ...settings, animationsEnabled: e.target.checked })}
                className="w-5 h-5 accent-primary rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/5 cursor-pointer">
              <div>
                <span className="text-sm font-bold text-white block">Reduced Motion Mode</span>
                <span className="text-xs text-gray-400">Keep orbs static for accessibility</span>
              </div>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => setSettings({ ...settings, reducedMotion: e.target.checked })}
                className="w-5 h-5 accent-primary rounded"
              />
            </label>
          </div>
        </div>

        {/* Fine Tuning Controls */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="font-heading font-black text-base uppercase tracking-wider text-gray-300">
            Fine-Tuning Controls
          </h3>

          {/* Number of Orbs */}
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              <span>Floating Ambient Orbs Count</span>
              <span className="text-primary font-mono">{settings.orbCount} Orbs</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={settings.orbCount}
              onChange={(e) => setSettings({ ...settings, orbCount: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>

          {/* Blur Amount */}
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              <span>Orb Blur Radius</span>
              <span className="text-primary font-mono">{settings.blurAmount}px</span>
            </div>
            <input
              type="range"
              min="40"
              max="160"
              value={settings.blurAmount}
              onChange={(e) => setSettings({ ...settings, blurAmount: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>

          {/* Animation Speed & Intensity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Motion Speed
              </label>
              <select
                value={settings.animationSpeed}
                onChange={(e) => setSettings({ ...settings, animationSpeed: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-semibold focus:border-primary focus:outline-none"
              >
                <option value="slow">Slow & Cinematic (Recommended)</option>
                <option value="normal">Normal Pace</option>
                <option value="fast">High Energy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Card Hover Interactions
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl glass-panel border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.hoverEffects}
                  onChange={(e) => setSettings({ ...settings, hoverEffects: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-xs text-gray-200 font-medium">Enable 3D hover tilt & border glow</span>
              </label>
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
