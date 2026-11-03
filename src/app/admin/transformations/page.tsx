"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageFieldPicker from "@/components/admin/ImageFieldPicker";
import { Plus, Edit2, Trash2, Trophy, Star, X, Check, AlertCircle } from "lucide-react";

interface TransformationData {
  id: string;
  clientName: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  durationWeeks?: number | null;
  weightLossKg?: number | null;
  muscleGainKg?: number | null;
  description?: string | null;
  clientQuote?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
}

export default function TransformationsAdminPage() {
  const [items, setItems] = useState<TransformationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<TransformationData> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/transformations");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openNew = () => {
    setEditingItem({
      clientName: "",
      category: "Fat Loss & Shred",
      beforeImage: "",
      afterImage: "",
      durationWeeks: 12,
      weightLossKg: 10,
      muscleGainKg: 2,
      description: "",
      clientQuote: "",
      isFeatured: false,
      isPublished: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);

    try {
      const isNew = !editingItem.id;
      const res = await fetch("/api/admin/transformations", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (!res.ok) throw new Error("Failed to save transformation");

      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client result?")) return;
    try {
      const res = await fetch(`/api/admin/transformations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <AdminLayout title="Client Transformations Management">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-black text-xl text-white">
              Client Transformations & Success Stories
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Add Before & After photo comparisons, duration stats, and testimonials.
            </p>
          </div>

          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Result</span>
          </button>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading Transformations...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((t) => (
              <div
                key={t.id}
                className="glass-card rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between"
              >
                {/* Images side-by-side */}
                <div className="relative aspect-[16/10] w-full grid grid-cols-2 overflow-hidden bg-dark-950">
                  <div className="relative h-full border-r border-dark-950">
                    <Image
                      src={t.beforeImage}
                      alt={`${t.clientName} Before`}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-black bg-dark-950/80 text-gray-300">
                      BEFORE
                    </span>
                  </div>
                  <div className="relative h-full">
                    <Image
                      src={t.afterImage}
                      alt={`${t.clientName} After`}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500 text-white">
                      AFTER
                    </span>
                  </div>

                  {t.isFeatured && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-primary text-dark-950 shadow-md">
                      FEATURED
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-heading font-black text-lg text-white">
                        {t.clientName}
                      </h4>
                      <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                        {t.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-2 font-medium">
                      {t.durationWeeks && <span>{t.durationWeeks} Wks</span>}
                      {t.weightLossKg && t.weightLossKg > 0 && <span className="text-emerald-400">-{t.weightLossKg} kg</span>}
                      {t.muscleGainKg && t.muscleGainKg > 0 && <span className="text-primary">+{t.muscleGainKg} kg</span>}
                    </div>

                    {t.clientQuote && (
                      <p className="text-xs text-gray-300 mt-2 line-clamp-2 italic">
                        &ldquo;{t.clientQuote}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setEditingItem(t)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-gray-200 glass-panel hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-2 rounded-xl glass-panel text-gray-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Edit/Create Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-white/20 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full glass-panel text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-black text-2xl text-white mb-6">
              {editingItem.id ? "Edit Client Result" : "Add New Client Transformation"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Client Name / Initials *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.clientName || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                    placeholder="e.g. Omar H."
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={editingItem.category || "Fat Loss"}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  >
                    <option value="Fat Loss & Shred">Fat Loss & Shred</option>
                    <option value="Muscle Hypertrophy">Muscle Hypertrophy</option>
                    <option value="Total Body Recomp">Total Body Recomp</option>
                    <option value="Contest Prep">Contest Prep</option>
                  </select>
                </div>
              </div>

              {/* Before and After Image Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl glass-panel border border-white/5">
                <ImageFieldPicker
                  label="Before Image"
                  value={editingItem.beforeImage || ""}
                  onChange={(url) => setEditingItem({ ...editingItem, beforeImage: url })}
                  required
                  category="transformations"
                  aspectRatio="aspect-[3/4]"
                  helperText="Select from Media Library or upload a baseline photo."
                />

                <ImageFieldPicker
                  label="After Image"
                  value={editingItem.afterImage || ""}
                  onChange={(url) => setEditingItem({ ...editingItem, afterImage: url })}
                  required
                  category="transformations"
                  aspectRatio="aspect-[3/4]"
                  helperText="Select from Media Library or upload a transformed photo."
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Weeks
                  </label>
                  <input
                    type="number"
                    value={editingItem.durationWeeks || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, durationWeeks: Number(e.target.value) })}
                    placeholder="12"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Fat Lost (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingItem.weightLossKg || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, weightLossKg: Number(e.target.value) })}
                    placeholder="14.5"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Muscle Gain (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingItem.muscleGainKg || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, muscleGainKg: Number(e.target.value) })}
                    placeholder="2.5"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Client Quote / Testimonial Snippet
                </label>
                <textarea
                  rows={2}
                  value={editingItem.clientQuote || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, clientQuote: e.target.value })}
                  placeholder="In just 12 weeks, I saw my abs for the first time..."
                  className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Transformation Story & Background
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Background notes, challenges solved, diet protocol..."
                  className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-3 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isFeatured}
                    onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <span>Featured Hero Wipe Slider</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isPublished}
                    onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <span>Published on Website</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Transformation"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
