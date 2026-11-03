"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageFieldPicker from "@/components/admin/ImageFieldPicker";
import { Plus, Edit2, Trash2, Star, MessageSquareQuote, X } from "lucide-react";

interface TestimonialData {
  id: string;
  clientName: string;
  clientTitle?: string | null;
  avatarUrl?: string | null;
  rating: number;
  program?: string | null;
  content: string;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
}

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<TestimonialData> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/testimonials");
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
      clientTitle: "Athlete & Entrepreneur",
      avatarUrl: "",
      rating: 5,
      program: "Gold Dominance (12 Weeks)",
      content: "",
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
      const res = await fetch("/api/admin/testimonials", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (!res.ok) throw new Error("Failed to save testimonial");

      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <AdminLayout title="Testimonials & Reviews Management">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-black text-xl text-white">
              Athlete Testimonials & Reviews
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Manage client feedback, ratings, and program endorsements.
            </p>
          </div>

          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading Testimonials...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((t) => (
              <div
                key={t.id}
                className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>

                    {t.program && (
                      <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                        {t.program}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-300 italic leading-relaxed line-clamp-3">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary/20 shrink-0">
                      {t.avatarUrl ? (
                        <Image
                          src={t.avatarUrl}
                          alt={t.clientName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs">
                          {t.clientName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-heading font-black text-xs text-white">
                        {t.clientName}
                      </p>
                      {t.clientTitle && (
                        <p className="text-[10px] text-gray-400 truncate max-w-[120px]">
                          {t.clientTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem(t)}
                      className="p-1.5 rounded-lg glass-panel text-gray-300 hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 rounded-lg glass-panel text-gray-400 hover:text-red-400"
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
          <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-white/20 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full glass-panel text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-black text-2xl text-white mb-6">
              {editingItem.id ? "Edit Testimonial" : "Add Athlete Testimonial"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.clientName || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                    placeholder="e.g. Mostafa El-Sayed"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Client Title / Profession
                  </label>
                  <input
                    type="text"
                    value={editingItem.clientTitle || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, clientTitle: e.target.value })}
                    placeholder="e.g. Powerlifter & Engineer"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Star Rating (1-5)
                  </label>
                  <select
                    value={editingItem.rating || 5}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Program Completed
                  </label>
                  <input
                    type="text"
                    value={editingItem.program || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, program: e.target.value })}
                    placeholder="e.g. Gold Dominance (12 Weeks)"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <ImageFieldPicker
                label="Client Avatar Photo"
                value={editingItem.avatarUrl || ""}
                onChange={(url) => setEditingItem({ ...editingItem, avatarUrl: url })}
                category="avatars"
                aspectRatio="aspect-square"
                helperText="Upload client avatar photo or select from Media Library."
              />

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Review Statement *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.content || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="The coaching experience, results achieved, WhatsApp support..."
                  className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-3 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isFeatured}
                    onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <span>Featured Testimonial</span>
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
                  {saving ? "Saving..." : "Save Testimonial"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
