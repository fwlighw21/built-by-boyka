"use client";

import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { READY_MADE_THEMES, ReadyMadeTheme, normalizeTheme, normalizeThemeList } from "@/lib/themeLibrary";
import { clampAngle, clampPercentage } from "@/lib/utils";
import {
  Palette,
  Sparkles,
  Check,
  RefreshCw,
  Save,
  Eye,
  Layers,
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  Sliders,
  SlidersHorizontal,
  BookmarkPlus,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Flame,
  Star,
  X,
  Shuffle,
} from "lucide-react";

export default function ThemeEditorPage() {
  // Theme state representing current active configuration
  const [theme, setTheme] = useState({
    activePreset: "luminous-purple",
    primaryColor: "#7547F5",
    primaryHover: "#6532eb",
    secondaryColor: "#9B7BFF",
    secondaryHover: "#8963ff",
    accentColor: "#C9B9FF",
    backgroundColor: "#05030a",
    cardBackground: "rgba(14, 9, 28, 0.75)",
    cardBorderColor: "rgba(155, 123, 255, 0.22)",
    textColor: "#ffffff",
    textMutedColor: "#9d8ec2",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #5424D8 0%, #7547F5 50%, #9B7BFF 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(5, 3, 10, 0.85)",
    footerBackground: "#05030a",
    heroGradient:
      "linear-gradient(135deg, rgba(84, 36, 216, 0.28) 0%, rgba(117, 71, 245, 0.18) 50%, transparent 100%)",
    cardGradient: "",
    borderGradient:
      "linear-gradient(135deg, rgba(155, 123, 255, 0.35) 0%, rgba(117, 71, 245, 0.1) 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(117, 71, 245, 0.45)",
    glassBlur: 16,
    borderRadius: "1rem",
    sectionOverridesJson: "{}",
    customGradientsJson: "[]",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "name" | "recent">("featured");
  const [recentlyUsedIds, setRecentlyUsedIds] = useState<string[]>(["luminous-purple"]);

  // Preview Modal State
  const [previewTheme, setPreviewTheme] = useState<ReadyMadeTheme | null>(null);

  // Collapsible Advanced Section
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [customThemes, setCustomThemes] = useState<ReadyMadeTheme[]>([]);
  const [newCustomThemeName, setNewCustomThemeName] = useState("");
  const [showSaveCustomModal, setShowSaveCustomModal] = useState(false);

  // Gradient Builder State (Advanced)
  const [gradientAngle, setGradientAngle] = useState(135);
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [colorStops, setColorStops] = useState([
    { id: "1", color: "#5424D8", position: 0 },
    { id: "2", color: "#7547F5", position: 50 },
    { id: "3", color: "#9B7BFF", position: 100 },
  ]);

  const categories = [
    "All",
    "Purple",
    "Blue",
    "Green",
    "Red & Orange",
    "Pink",
    "Luxury",
    "Dark",
    "Light",
    "Multicolor",
  ];

  // Fetch initial theme settings
  const fetchTheme = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/theme");
      if (res.ok) {
        const data = await res.json();
        if (data.id) {
          setTheme((prev) => ({
            ...prev,
            ...data,
          }));

          // Parse custom themes if any
          if (data.customGradientsJson) {
            try {
              const parsed = JSON.parse(data.customGradientsJson);
              if (Array.isArray(parsed)) {
                setCustomThemes(normalizeThemeList(parsed));
              }
            } catch {
              // ignore
            }
          }
        }
      }
    } catch (e) {
      console.error("Error fetching theme:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  // Combine built-in and user-saved custom themes (always normalized)
  const allAvailableThemes = useMemo(() => {
    return normalizeThemeList([...READY_MADE_THEMES, ...customThemes]);
  }, [customThemes]);

  // Filtered & Sorted Themes
  const filteredThemes = useMemo(() => {
    return allAvailableThemes
      .filter((t) => {
        const matchesCategory =
          selectedCategory === "All" || t.category === selectedCategory;
        const matchesSearch =
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "recent") {
          const aIndex = recentlyUsedIds.indexOf(a.id);
          const bIndex = recentlyUsedIds.indexOf(b.id);
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
        }
        // Default: featured first, active first
        if (a.id === theme.activePreset) return -1;
        if (b.id === theme.activePreset) return 1;
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [allAvailableThemes, selectedCategory, searchQuery, sortBy, theme.activePreset, recentlyUsedIds]);

  // Apply a theme with one click and persist to database
  const applyTheme = async (targetTheme: ReadyMadeTheme) => {
    try {
      setSaving(true);
      setErrorMessage("");

      const updatedPayload = {
        ...theme,
        activePreset: targetTheme.id,
        primaryColor: targetTheme.primaryColor,
        primaryHover: targetTheme.primaryHover,
        secondaryColor: targetTheme.secondaryColor,
        secondaryHover: targetTheme.secondaryHover,
        accentColor: targetTheme.accentColor,
        backgroundColor: targetTheme.backgroundColor,
        cardBackground: targetTheme.cardBackground,
        cardBorderColor: targetTheme.cardBorderColor,
        textColor: targetTheme.textColor,
        textMutedColor: targetTheme.textMutedColor,
        headingColor: targetTheme.headingColor,
        buttonBg: targetTheme.buttonBg,
        buttonText: targetTheme.buttonText,
        navBackground: targetTheme.navBackground,
        footerBackground: targetTheme.footerBackground,
        heroGradient: targetTheme.heroGradient,
        cardGradient: targetTheme.cardGradient || "",
        borderGradient: targetTheme.borderGradient,
        glowIntensity: targetTheme.glowIntensity,
        glowColor: targetTheme.glowColor,
        glassBlur: targetTheme.glassBlur,
        borderRadius: targetTheme.borderRadius,
      };

      const res = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      if (!res.ok) throw new Error("Failed to apply theme");

      setTheme(updatedPayload);
      setRecentlyUsedIds((prev) => [
        targetTheme.id,
        ...prev.filter((id) => id !== targetTheme.id).slice(0, 5),
      ]);
      setHasUnsavedChanges(false);
      setSavedMessage(`Theme "${targetTheme.name}" is now live!`);
      setTimeout(() => setSavedMessage(""), 4000);

      if (previewTheme) setPreviewTheme(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to apply theme");
    } finally {
      setSaving(false);
    }
  };

  // Restore Default Logo Theme (Luminous Violet)
  const handleRestoreDefault = () => {
    const defaultTheme = READY_MADE_THEMES.find((t) => t.id === "luminous-purple");
    if (defaultTheme) {
      if (confirm("Restore the official Built By Boyka Luminous Violet theme?")) {
        applyTheme(defaultTheme);
      }
    }
  };

  // Duplicate active theme as a custom theme
  const handleDuplicateAsCustom = () => {
    const active = allAvailableThemes.find((t) => t.id === theme.activePreset) || READY_MADE_THEMES[0];
    const newId = `custom-${Date.now()}`;
    const duplicated: ReadyMadeTheme = normalizeTheme({
      ...active,
      id: newId,
      name: `${active.name} (Custom Copy)`,
      category: active.category,
      description: `Customized version of ${active.name}.`,
    }, newId);

    const newCustoms = [...customThemes, duplicated];
    setCustomThemes(newCustoms);
    setTheme((prev) => ({
      ...prev,
      activePreset: newId,
      customGradientsJson: JSON.stringify(newCustoms),
    }));

    // Auto save custom list
    fetch("/api/admin/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...theme,
        activePreset: newId,
        customGradientsJson: JSON.stringify(newCustoms),
      }),
    });

    setSavedMessage(`Created custom copy: "${duplicated.name}"`);
    setTimeout(() => setSavedMessage(""), 4000);
  };

  // Save current modifications as a new custom theme
  const handleSaveAsCustomTheme = () => {
    if (!newCustomThemeName.trim()) return;
    const newId = `custom-${Date.now()}`;
    const customObj: ReadyMadeTheme = normalizeTheme({
      id: newId,
      name: newCustomThemeName.trim(),
      category: "Multicolor",
      description: "User customized palette saved in dashboard.",
      previewGradient: theme.buttonBg,
      swatches: [
        theme.primaryColor,
        theme.secondaryColor,
        theme.accentColor,
        theme.backgroundColor,
        theme.headingColor,
      ],
      primaryColor: theme.primaryColor,
      primaryHover: theme.primaryHover,
      secondaryColor: theme.secondaryColor,
      secondaryHover: theme.secondaryHover,
      accentColor: theme.accentColor,
      backgroundColor: theme.backgroundColor,
      cardBackground: theme.cardBackground,
      cardBorderColor: theme.cardBorderColor,
      textColor: theme.textColor,
      textMutedColor: theme.textMutedColor,
      headingColor: theme.headingColor,
      buttonBg: theme.buttonBg,
      buttonText: theme.buttonText,
      navBackground: theme.navBackground,
      footerBackground: theme.footerBackground,
      heroGradient: theme.heroGradient,
      cardGradient: theme.cardGradient || "",
      borderGradient: theme.borderGradient,
      glowIntensity: theme.glowIntensity as any,
      glowColor: theme.glowColor,
      glassBlur: theme.glassBlur,
      borderRadius: theme.borderRadius,
    }, newId);

    const updatedCustoms = [...customThemes, customObj];
    setCustomThemes(updatedCustoms);
    setTheme((prev) => ({
      ...prev,
      activePreset: newId,
      customGradientsJson: JSON.stringify(updatedCustoms),
    }));

    // Persist
    fetch("/api/admin/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...theme,
        activePreset: newId,
        customGradientsJson: JSON.stringify(updatedCustoms),
      }),
    });

    setNewCustomThemeName("");
    setShowSaveCustomModal(false);
    setHasUnsavedChanges(false);
    setSavedMessage(`Saved custom theme "${customObj.name}"!`);
    setTimeout(() => setSavedMessage(""), 4000);
  };

  // Delete a custom theme
  const handleDeleteCustomTheme = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this custom theme?")) return;
    const filtered = customThemes.filter((t) => t.id !== id);
    setCustomThemes(filtered);

    // If active was deleted, fallback to default
    const nextActive = theme.activePreset === id ? "luminous-purple" : theme.activePreset;
    const defaultTheme = READY_MADE_THEMES[0];

    const updated = {
      ...theme,
      activePreset: nextActive,
      customGradientsJson: JSON.stringify(filtered),
      ...(nextActive === "luminous-purple" ? defaultTheme : {}),
    };

    setTheme(updated);
    fetch("/api/admin/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  };

  // Manual save for advanced modifications
  const handleSaveAdvanced = async () => {
    try {
      setSaving(true);
      setErrorMessage("");

      const res = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      setHasUnsavedChanges(false);
      setSavedMessage("Advanced customization saved and published!");
      setTimeout(() => setSavedMessage(""), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Active theme details (always normalized)
  const currentActiveTheme = useMemo(() => {
    const found = allAvailableThemes.find((t) => t.id === theme.activePreset) || READY_MADE_THEMES[0];
    return normalizeTheme(found, theme.activePreset || "active-theme");
  }, [allAvailableThemes, theme.activePreset]);

  return (
    <AdminLayout title="Theme & Appearance">
      <div className="space-y-8 max-w-7xl">
        {/* Alerts */}
        {savedMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{savedMessage}</span>
            </span>
            <button
              onClick={() => setSavedMessage("")}
              className="text-emerald-400 hover:text-white text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage("")}
              className="text-red-400 hover:text-white text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Unsaved changes banner */}
        {hasUnsavedChanges && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>You have unsaved changes in Advanced Customization. Remember to save or save as a custom theme.</span>
            </span>
            <button
              onClick={handleSaveAdvanced}
              disabled={saving}
              className="px-3 py-1 rounded-lg bg-amber-500 text-dark-950 font-extrabold hover:bg-amber-400 text-xs"
            >
              Save Now
            </button>
          </div>
        )}

        {/* Top Active Theme Hero Bar */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-96 h-96 opacity-25 blur-3xl rounded-full pointer-events-none"
            style={{ background: theme.buttonBg }}
          />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Currently Live Theme
                </span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {currentActiveTheme.category}
                </span>
              </div>

              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
                {currentActiveTheme.name}
              </h2>

              <p className="text-xs text-gray-300 max-w-xl leading-relaxed">
                {currentActiveTheme.description}
              </p>

              {/* Swatches preview */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mr-1">
                  Active Palette:
                </span>
                {(currentActiveTheme.swatches && Array.isArray(currentActiveTheme.swatches) && currentActiveTheme.swatches.length > 0
                  ? currentActiveTheme.swatches
                  : [
                      currentActiveTheme.primaryColor || "#7547F5",
                      currentActiveTheme.secondaryColor || "#9B7BFF",
                      currentActiveTheme.accentColor || "#C9B9FF",
                      currentActiveTheme.backgroundColor || "#05030a",
                      currentActiveTheme.headingColor || "#ffffff",
                    ]
                ).map((color, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full border border-white/20 shadow-md transition-transform hover:scale-125"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                type="button"
                onClick={handleRestoreDefault}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-300 glass-panel hover:text-white hover:border-primary/50 transition-colors"
                title="Restore default Luminous Violet logo theme"
              >
                <RotateCcw className="w-3.5 h-3.5 text-primary" />
                <span>Restore Default Theme</span>
              </button>

              <button
                type="button"
                onClick={handleDuplicateAsCustom}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-300 glass-panel hover:text-white hover:border-primary/50 transition-colors"
                title="Create an editable copy of this theme"
              >
                <Copy className="w-3.5 h-3.5 text-accent" />
                <span>Duplicate as Custom</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewTheme(currentActiveTheme)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-white/10 hover:bg-white/20 border border-white/20 shadow-md transition-all hover:scale-105"
              >
                <Eye className="w-4 h-4 text-primary" />
                <span>Preview Mockup</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: Ready-Made Theme Library */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-black text-xl text-white">
                  Theme Library ({allAvailableThemes.length} Ready-Made Themes)
                </h3>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Pick any professionally designed palette below. Click &ldquo;Apply Theme&rdquo; to update your entire website in one click.
              </p>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search 30+ themes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs placeholder-gray-500 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="name">Name (A-Z)</option>
                <option value="recent">Recently Used</option>
              </select>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-dark-950 font-black shadow-md shadow-primary/20 scale-105"
                    : "glass-panel text-gray-400 hover:text-white hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredThemes.map((t) => {
              const isActive = theme.activePreset === t.id;
              const isCustom = t.id.startsWith("custom-");

              return (
                <div
                  key={t.id}
                  className={`glass-card rounded-3xl p-5 border-2 transition-all duration-300 flex flex-col justify-between group hover:translate-y-[-4px] ${
                    isActive
                      ? "border-primary ring-2 ring-primary/40 shadow-2xl shadow-primary/20"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Name & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-black text-base text-white group-hover:text-primary transition-colors">
                            {t.name}
                          </h4>
                          {isCustom && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-accent/20 text-accent border border-accent/30">
                              Custom
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                          {t.category}
                        </span>
                      </div>

                      {isActive ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Active</span>
                        </span>
                      ) : t.isFeatured ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-primary/20 text-accent border border-primary/30 flex items-center gap-1 shrink-0">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>Featured</span>
                        </span>
                      ) : null}
                    </div>

                    {/* Gradient Preview Bar */}
                    <div
                      className="w-full h-12 rounded-2xl shadow-inner border border-white/15 relative overflow-hidden"
                      style={{ background: t.previewGradient }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>

                    {/* 5 Circular Color Swatches */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-1.5">
                        {(t.swatches && Array.isArray(t.swatches) && t.swatches.length > 0
                          ? t.swatches
                          : [
                              t.primaryColor || "#7547F5",
                              t.secondaryColor || "#9B7BFF",
                              t.accentColor || "#C9B9FF",
                              t.backgroundColor || "#05030a",
                              t.headingColor || "#ffffff",
                            ]
                        ).map((swatch, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full border border-white/25 shadow-sm transition-transform hover:scale-125"
                            style={{ backgroundColor: swatch }}
                            title={swatch}
                          />
                        ))}
                      </div>

                      {isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomTheme(t.id, e)}
                          className="p-1 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete custom theme"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTheme(t)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-gray-300 glass-panel hover:text-white hover:border-white/30 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-primary" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      disabled={saving || isActive}
                      onClick={() => applyTheme(t)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                        isActive
                          ? "bg-white/10 text-gray-400 border border-white/10 cursor-default"
                          : "text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isActive ? "Applied" : "Apply Theme"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredThemes.length === 0 && (
            <div className="p-12 text-center glass-card rounded-3xl border border-white/10 space-y-3">
              <p className="text-sm font-bold text-gray-300">No themes found matching your filter</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-primary underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Collapsible Advanced Customization */}
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
          <button
            type="button"
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="w-full p-6 sm:p-8 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl text-white">
                  Advanced Customization
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Fine-tune individual colors, gradients, background blur, and glow. Save modifications as custom themes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <span>{advancedOpen ? "Collapse Controls" : "Expand Controls"}</span>
              {advancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {advancedOpen && (
            <div className="p-6 sm:p-8 pt-0 border-t border-white/10 space-y-8 animate-in fade-in duration-200">
              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Editing active theme:</span>
                  <span className="text-xs font-bold text-white bg-dark-900 px-3 py-1 rounded-lg border border-white/10">
                    {currentActiveTheme.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSaveCustomModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-accent glass-panel hover:bg-primary/20 hover:border-primary/50 transition-colors"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Save as Custom Theme</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAdvanced}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/25 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? "Saving..." : "Save & Publish Changes"}</span>
                  </button>
                </div>
              </div>

              {/* Color Controls Grid */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary mb-4">
                  1. Core Brand Colors
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Primary Color */}
                  <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Primary Accent</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) => {
                          setTheme({ ...theme, primaryColor: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.primaryColor}
                        onChange={(e) => {
                          setTheme({ ...theme, primaryColor: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-dark-950 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Secondary Accent</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.secondaryColor}
                        onChange={(e) => {
                          setTheme({ ...theme, secondaryColor: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.secondaryColor}
                        onChange={(e) => {
                          setTheme({ ...theme, secondaryColor: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-dark-950 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Highlight Color */}
                  <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Highlight / Accent</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.accentColor}
                        onChange={(e) => {
                          setTheme({ ...theme, accentColor: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.accentColor}
                        onChange={(e) => {
                          setTheme({ ...theme, accentColor: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-dark-950 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Main Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.backgroundColor}
                        onChange={(e) => {
                          setTheme({ ...theme, backgroundColor: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.backgroundColor}
                        onChange={(e) => {
                          setTheme({ ...theme, backgroundColor: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-dark-950 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Surface & Text Tokens */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary mb-4">
                  2. Cards, Navigation & Text
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Card Background (RGBA)</label>
                    <input
                      type="text"
                      value={theme.cardBackground}
                      onChange={(e) => {
                        setTheme({ ...theme, cardBackground: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Card Border (RGBA)</label>
                    <input
                      type="text"
                      value={theme.cardBorderColor}
                      onChange={(e) => {
                        setTheme({ ...theme, cardBorderColor: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Nav Background</label>
                    <input
                      type="text"
                      value={theme.navBackground}
                      onChange={(e) => {
                        setTheme({ ...theme, navBackground: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Footer Background</label>
                    <input
                      type="text"
                      value={theme.footerBackground}
                      onChange={(e) => {
                        setTheme({ ...theme, footerBackground: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Gradient Customizer */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary mb-4">
                  3. Button & Primary Gradient
                </h4>
                <div className="p-5 rounded-2xl bg-dark-900 border border-white/10 space-y-4">
                  <div
                    className="w-full h-14 rounded-xl border border-white/15 shadow-inner"
                    style={{ background: theme.buttonBg }}
                  />

                  {/* Angle and Direction Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-300">Gradient Angle</span>
                        <span className="font-mono text-accent">{gradientAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={360}
                        value={gradientAngle}
                        onChange={(e) => {
                          const safeDeg = clampAngle(Number(e.target.value));
                          setGradientAngle(safeDeg);
                          const newGrad = `linear-gradient(${safeDeg}deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 50%, ${theme.accentColor} 100%)`;
                          setTheme({ ...theme, buttonBg: newGrad });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-bold text-gray-300 text-xs block">Angle Value (0-360°)</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={360}
                          value={gradientAngle}
                          onChange={(e) => {
                            const safeDeg = clampAngle(Number(e.target.value));
                            setGradientAngle(safeDeg);
                            const newGrad = `linear-gradient(${safeDeg}deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 50%, ${theme.accentColor} 100%)`;
                            setTheme({ ...theme, buttonBg: newGrad });
                            setHasUnsavedChanges(true);
                          }}
                          className="w-24 px-3 py-1.5 rounded-xl bg-dark-950 border border-white/10 text-white text-xs font-mono focus:border-primary focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const safeDeg = clampAngle(gradientAngle + 45);
                            setGradientAngle(safeDeg);
                            const newGrad = `linear-gradient(${safeDeg}deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 50%, ${theme.accentColor} 100%)`;
                            setTheme({ ...theme, buttonBg: newGrad });
                            setHasUnsavedChanges(true);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold glass-panel text-gray-300 hover:text-white"
                        >
                          +45°
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGradientAngle(135);
                            const newGrad = `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 50%, ${theme.accentColor} 100%)`;
                            setTheme({ ...theme, buttonBg: newGrad });
                            setHasUnsavedChanges(true);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold glass-panel text-gray-300 hover:text-white"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <input
                      type="text"
                      value={theme.buttonBg}
                      onChange={(e) => {
                        setTheme({
                          ...theme,
                          buttonBg: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="flex-1 px-4 py-2 rounded-xl bg-dark-950 border border-white/10 text-white text-xs font-mono focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const safeDeg = clampAngle(gradientAngle);
                        const newGrad = `linear-gradient(${safeDeg}deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 50%, ${theme.accentColor} 100%)`;
                        setTheme({ ...theme, buttonBg: newGrad });
                        setHasUnsavedChanges(true);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary/20 border border-primary/40 hover:bg-primary/30 text-accent transition-colors shrink-0"
                    >
                      Re-generate from Accents
                    </button>
                  </div>
                </div>
              </div>

              {/* Atmosphere Controls (Glow, Blur, Radius) */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary mb-4">
                  4. Glow Intensity & Glass Blur
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Glow Intensity</label>
                    <select
                      value={theme.glowIntensity}
                      onChange={(e) => {
                        setTheme({ ...theme, glowIntensity: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                    >
                      <option value="subtle">Subtle Glow</option>
                      <option value="medium">Medium Glow (Recommended)</option>
                      <option value="high">High Voltage Glow</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gray-300">Glass Blur</label>
                      <span className="text-xs font-mono text-accent">{theme.glassBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={32}
                      value={theme.glassBlur}
                      onChange={(e) => {
                        setTheme({ ...theme, glassBlur: Number(e.target.value) });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Corner Radius</label>
                    <select
                      value={theme.borderRadius}
                      onChange={(e) => {
                        setTheme({ ...theme, borderRadius: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-dark-950 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                    >
                      <option value="0.5rem">Sharp (8px)</option>
                      <option value="0.75rem">Modern (12px)</option>
                      <option value="1rem">Smooth Rounded (16px - Default)</option>
                      <option value="1.25rem">Pill / Ultra Curved (20px)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Custom Theme Modal */}
      {showSaveCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-xl text-white">
                Save as Custom Theme
              </h3>
              <button
                onClick={() => setShowSaveCustomModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Save your current color and gradient modifications as a permanent custom theme in your library.
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Custom Theme Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Boyka Competition Gold"
                value={newCustomThemeName}
                onChange={(e) => setNewCustomThemeName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 glass-panel hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAsCustomTheme}
                disabled={!newCustomThemeName.trim()}
                className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary disabled:opacity-50 shadow-lg"
              >
                Save Theme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Interactive Preview Mockup Modal */}
      {previewTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-4xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-dark-950/80">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-xl text-white">
                    Preview: {previewTheme.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-accent border border-primary/30">
                    {previewTheme.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{previewTheme.description}</p>
              </div>

              <button
                onClick={() => setPreviewTheme(null)}
                className="p-2 rounded-full glass-panel text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Mockup Body */}
            <div
              className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8"
              style={{ backgroundColor: previewTheme.backgroundColor }}
            >
              {/* Mini Navbar Mockup */}
              <div
                className="p-4 rounded-2xl flex items-center justify-between border"
                style={{
                  background: previewTheme.navBackground,
                  borderColor: previewTheme.cardBorderColor,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full border flex items-center justify-center font-black text-xs"
                    style={{
                      background: previewTheme.buttonBg,
                      borderColor: previewTheme.accentColor,
                      color: previewTheme.buttonText,
                    }}
                  >
                    B
                  </div>
                  <span className="font-heading font-black text-sm text-white">BUILT BY BOYKA</span>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-gray-300">
                  <span>About</span>
                  <span>Transformations</span>
                  <span>Packages</span>
                  <span>Contact</span>
                </div>

                <div
                  className="px-4 py-1.5 rounded-full text-xs font-bold shadow-md"
                  style={{
                    background: previewTheme.buttonBg,
                    color: previewTheme.buttonText,
                  }}
                >
                  WhatsApp VIP
                </div>
              </div>

              {/* Hero Banner Mockup */}
              <div
                className="p-8 sm:p-12 rounded-3xl border relative overflow-hidden text-center space-y-4"
                style={{
                  background: previewTheme.heroGradient,
                  borderColor: previewTheme.cardBorderColor,
                }}
              >
                <span
                  className="inline-block px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                  style={{
                    backgroundColor: `${previewTheme.primaryColor}25`,
                    borderColor: previewTheme.primaryColor,
                    color: previewTheme.accentColor,
                  }}
                >
                  ELITE 1-ON-1 ONLINE COACHING
                </span>

                <h1
                  className="font-heading font-black text-3xl sm:text-5xl tracking-tight"
                  style={{ color: previewTheme.headingColor }}
                >
                  FORGE YOUR ULTIMATE PHYSIQUE
                </h1>

                <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: previewTheme.textMutedColor }}>
                  Uncompromising elite online fitness mentorship with Coach Boyka. Custom periodized training & metabolic programming.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <div
                    className="px-7 py-3.5 rounded-xl text-xs font-black shadow-lg"
                    style={{
                      background: previewTheme.buttonBg,
                      color: previewTheme.buttonText,
                    }}
                  >
                    Claim Your VIP Spot
                  </div>
                  <div
                    className="px-6 py-3.5 rounded-xl text-xs font-bold text-gray-200 border"
                    style={{
                      backgroundColor: previewTheme.cardBackground,
                      borderColor: previewTheme.cardBorderColor,
                    }}
                  >
                    View Transformations
                  </div>
                </div>
              </div>

              {/* Cards Mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["Fat Loss Protocol", "Hypertrophy Program", "VIP Inner Circle"].map((title, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border space-y-3"
                    style={{
                      background: previewTheme.cardBackground,
                      borderColor: previewTheme.cardBorderColor,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                      style={{
                        backgroundColor: `${previewTheme.primaryColor}30`,
                        color: previewTheme.accentColor,
                      }}
                    >
                      0{i + 1}
                    </div>
                    <h4 className="font-heading font-black text-base text-white">{title}</h4>
                    <p className="text-[11px]" style={{ color: previewTheme.textMutedColor }}>
                      Tailored weekly check-ins, WhatsApp accountability, and progressive biomechanics.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-white/10 bg-dark-950/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPreviewTheme(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-300 glass-panel hover:text-white"
              >
                Close Preview
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => applyTheme(previewTheme)}
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/25 hover:scale-105 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Apply This Theme Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
