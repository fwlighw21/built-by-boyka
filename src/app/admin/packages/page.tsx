"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageFieldPicker from "@/components/admin/ImageFieldPicker";
import { Plus, Edit2, Trash2, Copy, Check, X, Tag, Sparkles, AlertCircle } from "lucide-react";
import { formatPrice, parseJsonSafe } from "@/lib/utils";

interface PackageData {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string | null;
  price: number;
  originalPrice?: number | null;
  currency: string;
  billingPeriod: string;
  duration: string;
  sessionsCount?: string | null;
  featuresJson: string;
  badge?: string | null;
  coverImage?: string | null;
  ctaText?: string;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
}

export default function PackagesAdminPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPkg, setEditingPkg] = useState<Partial<PackageData> | null>(null);
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openEdit = (pkg: PackageData) => {
    setEditingPkg(pkg);
    setFeaturesList(parseJsonSafe<string[]>(pkg.featuresJson, []));
  };

  const openNew = () => {
    setEditingPkg({
      name: "",
      shortDescription: "",
      price: 2000,
      currency: "EGP",
      billingPeriod: "Month",
      duration: "4 Weeks Full Access",
      sessionsCount: "Weekly check-ins",
      badge: "",
      ctaText: "Enroll in Program",
      isFeatured: false,
      isPublished: true,
    });
    setFeaturesList([
      "Custom Macro & Nutrition Protocol",
      "Tailored Progressive Workout Routine",
      "Direct WhatsApp Priority Line",
    ]);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeaturesList([...featuresList, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    setSaving(true);

    const payload = {
      ...editingPkg,
      featuresJson: JSON.stringify(featuresList),
    };

    try {
      const isNew = !editingPkg.id;
      const res = await fetch("/api/admin/packages", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save package");

      setEditingPkg(null);
      fetchPackages();
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`/api/admin/packages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      alert("Failed to delete package");
    }
  };

  const handleDuplicate = async (pkg: PackageData) => {
    try {
      const payload = {
        ...pkg,
        name: `${pkg.name} (Copy)`,
        slug: `${pkg.slug}-copy-${Date.now().toString().slice(-4)}`,
        id: undefined,
      };
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) fetchPackages();
    } catch (e) {
      alert("Duplicate failed");
    }
  };

  return (
    <AdminLayout title="Packages & Pricing Management">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-black text-xl text-white">
              Coaching Packages & Pricing Tiers
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Create, edit, duplicate, and publish pricing packages. Each card triggers pre-filled WhatsApp enrollment.
            </p>
          </div>

          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Package</span>
          </button>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading Packages...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const features = parseJsonSafe<string[]>(pkg.featuresJson, []);

              return (
                <div
                  key={pkg.id}
                  className={`glass-card rounded-3xl p-6 border flex flex-col justify-between relative ${
                    pkg.isFeatured ? "border-primary bg-dark-850" : "border-white/10 bg-dark-900/60"
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    {pkg.badge ? (
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary text-dark-950">
                        {pkg.badge}
                      </span>
                    ) : <span />}

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        pkg.isPublished
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {pkg.isPublished ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-black text-2xl text-white">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-primary font-semibold mt-0.5">
                      {pkg.duration}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {pkg.shortDescription}
                    </p>

                    <div className="py-4 my-4 border-t border-b border-white/10">
                      <span className="font-heading font-black text-3xl text-white">
                        {formatPrice(pkg.price, pkg.currency)}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">/ {pkg.billingPeriod}</span>

                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <p className="text-xs text-gray-500 line-through mt-0.5">
                          {formatPrice(pkg.originalPrice, pkg.currency)}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-2 mb-6">
                      {features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                      {features.length > 4 && (
                        <li className="text-[11px] text-gray-500 font-medium">
                          + {features.length - 4} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEdit(pkg)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-gray-200 glass-panel hover:text-white hover:border-primary/50 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDuplicate(pkg)}
                      className="p-2 rounded-xl glass-panel text-gray-400 hover:text-white transition-colors"
                      title="Duplicate Package"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-2 rounded-xl glass-panel text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete Package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Edit/Create Modal */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-white/20 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingPkg(null)}
              className="absolute top-5 right-5 p-2 rounded-full glass-panel text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-black text-2xl text-white mb-6">
              {editingPkg.id ? "Edit Coaching Package" : "Create New Coaching Package"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPkg.name || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                    placeholder="e.g. Gold Dominance"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingPkg.badge || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, badge: e.target.value })}
                    placeholder="e.g. MOST POPULAR"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Price (EGP) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingPkg.price || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={editingPkg.originalPrice || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, originalPrice: e.target.value ? Number(e.target.value) : null })}
                    placeholder="e.g. 5500"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Billing Period
                  </label>
                  <input
                    type="text"
                    value={editingPkg.billingPeriod || "month"}
                    onChange={(e) => setEditingPkg({ ...editingPkg, billingPeriod: e.target.value })}
                    placeholder="e.g. 3 Months"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Duration Label
                  </label>
                  <input
                    type="text"
                    value={editingPkg.duration || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, duration: e.target.value })}
                    placeholder="e.g. 12 Weeks Full Access"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={editingPkg.ctaText || "Join VIP Program"}
                    onChange={(e) => setEditingPkg({ ...editingPkg, ctaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingPkg.shortDescription || ""}
                  onChange={(e) => setEditingPkg({ ...editingPkg, shortDescription: e.target.value })}
                  placeholder="Target audience and quick summary..."
                  className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <ImageFieldPicker
                label="Package Cover Banner (Optional)"
                value={editingPkg.coverImage || ""}
                onChange={(url) => setEditingPkg({ ...editingPkg, coverImage: url })}
                category="packages"
                aspectRatio="aspect-video"
                helperText="Upload package hero card image or select from Media Library."
              />

              {/* Features Builder */}
              <div className="border-t border-white/10 pt-4">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Package Features Checklist
                </label>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add feature item..."
                    className="flex-1 px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-dark-950 hover:opacity-90"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {featuresList.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg glass-panel text-xs text-gray-200">
                      <span>✓ {f}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(i)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-3 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPkg.isFeatured}
                    onChange={(e) => setEditingPkg({ ...editingPkg, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <span>Featured / Recommended Card</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPkg.isPublished}
                    onChange={(e) => setEditingPkg({ ...editingPkg, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <span>Published on Website</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPkg(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Package"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
