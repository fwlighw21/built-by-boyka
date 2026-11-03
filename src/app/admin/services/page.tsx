"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageFieldPicker from "@/components/admin/ImageFieldPicker";
import { Plus, Edit2, Trash2, Dumbbell, Check, X } from "lucide-react";
import { formatPrice, parseJsonSafe } from "@/lib/utils";

interface ServiceData {
  id: string;
  name: string;
  slug: string;
  badge?: string | null;
  shortDescription: string;
  fullDescription?: string | null;
  coverImage?: string | null;
  featuresJson: string;
  duration?: string | null;
  price?: number | null;
  currency: string;
  ctaText?: string;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<ServiceData> | null>(null);
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openNew = () => {
    setEditingService({
      name: "",
      shortDescription: "",
      fullDescription: "",
      badge: "ELITE PROGRAM",
      duration: "12 Weeks",
      price: 3000,
      currency: "EGP",
      ctaText: "Inquire on WhatsApp",
      isPublished: true,
      isFeatured: false,
    });
    setFeaturesList([
      "Custom Macro & Meal Protocols",
      "Periodized Hypertrophy Program",
      "Direct WhatsApp VIP Access",
    ]);
  };

  const openEdit = (svc: ServiceData) => {
    setEditingService(svc);
    setFeaturesList(parseJsonSafe<string[]>(svc.featuresJson, []));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeaturesList([...featuresList, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (i: number) => {
    setFeaturesList(featuresList.filter((_, idx) => idx !== i));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setSaving(true);

    const payload = {
      ...editingService,
      featuresJson: JSON.stringify(featuresList),
    };

    try {
      const isNew = !editingService.id;
      const res = await fetch("/api/admin/services", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save service");

      setEditingService(null);
      fetchServices();
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coaching service?")) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <AdminLayout title="Coaching Services Management">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-black text-xl text-white">
              Specialized Coaching Programs & Services
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Manage specialized training services, curricula, duration, and WhatsApp inquiries.
            </p>
          </div>

          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Program</span>
          </button>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading Services...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {svc.badge && (
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary text-dark-950">
                        {svc.badge}
                      </span>
                    )}
                    {svc.duration && (
                      <span className="text-xs text-gray-400 font-medium">
                        ⏱ {svc.duration}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-black text-xl text-white">
                    {svc.name}
                  </h3>

                  <p className="text-xs text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                    {svc.shortDescription}
                  </p>

                  {svc.price && (
                    <p className="font-heading font-black text-xl text-white mt-4">
                      {formatPrice(svc.price, svc.currency)}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openEdit(svc)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-gray-200 glass-panel hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Program</span>
                  </button>

                  <button
                    onClick={() => handleDelete(svc.id)}
                    className="p-2 rounded-xl glass-panel text-gray-400 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Edit/Create Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-white/20 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingService(null)}
              className="absolute top-5 right-5 p-2 rounded-full glass-panel text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-black text-2xl text-white mb-6">
              {editingService.id ? "Edit Coaching Program" : "Create New Program"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Program Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.name || ""}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    placeholder="e.g. VIP 1-on-1 Transformation"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Badge Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingService.badge || ""}
                    onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                    placeholder="e.g. SIGNATURE PROGRAM"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingService.duration || ""}
                    onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                    placeholder="e.g. 12 - 24 Weeks"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={editingService.price || ""}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value ? Number(e.target.value) : null })}
                    placeholder="e.g. 3500"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={editingService.currency || "EGP"}
                    onChange={(e) => setEditingService({ ...editingService, currency: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <ImageFieldPicker
                label="Coaching Program Cover Image"
                value={editingService.coverImage || ""}
                onChange={(url) => setEditingService({ ...editingService, coverImage: url })}
                category="services"
                aspectRatio="aspect-video"
                helperText="Upload program cover card banner or select from Media Library."
              />

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDescription || ""}
                  onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  placeholder="Summary displayed on program cards..."
                  className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Detailed Description (Details modal & page)
                </label>
                <textarea
                  rows={4}
                  value={editingService.fullDescription || ""}
                  onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })}
                  placeholder="In-depth explanation of training, nutrition protocol, check-ins..."
                  className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none resize-none"
                />
              </div>

              {/* Features list */}
              <div className="border-t border-white/10 pt-4">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Program Features Included
                </label>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add curriculum item..."
                    className="flex-1 px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-dark-950"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
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

              <div className="flex items-center gap-6 pt-3 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.isPublished}
                    onChange={(e) => setEditingService({ ...editingService, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <span>Published on Website</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Program"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
