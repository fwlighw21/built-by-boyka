"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageFieldPicker from "@/components/admin/ImageFieldPicker";
import { Plus, Edit2, Trash2, Eye, EyeOff, Layers, ExternalLink, X, Check, Save } from "lucide-react";
import { parseJsonSafe } from "@/lib/utils";

interface CustomPageData {
  id: string;
  title: string;
  slug: string;
  seoTitle?: string | null;
  metaDescription?: string | null;
  isPublished: boolean;
  showInNav: boolean;
  blocksJson: string;
  updatedAt: string;
}

export default function PagesAdminPage() {
  const [pages, setPages] = useState<CustomPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Partial<CustomPageData> | null>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pages");
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openNew = () => {
    setEditingPage({
      title: "",
      slug: "",
      seoTitle: "",
      metaDescription: "",
      isPublished: true,
      showInNav: false,
    });
    setBlocks([
      { type: "heading", content: "Welcome to Our Custom Program" },
      { type: "rich_text", content: "Here is an in-depth breakdown of what you can expect..." },
      { type: "cta_banner", title: "Join Coach Boyka", description: "Take the first step today.", buttonText: "Inquire on WhatsApp" },
    ]);
  };

  const openEdit = (p: CustomPageData) => {
    setEditingPage(p);
    setBlocks(parseJsonSafe<any[]>(p.blocksJson, []));
  };

  const addBlock = (type: string) => {
    switch (type) {
      case "heading":
        setBlocks([...blocks, { type: "heading", content: "New Heading" }]);
        break;
      case "rich_text":
        setBlocks([...blocks, { type: "rich_text", content: "Add detailed paragraph text here..." }]);
        break;
      case "image":
        setBlocks([...blocks, { type: "image", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470", caption: "Training photo" }]);
        break;
      case "video":
        setBlocks([...blocks, { type: "video", videoUrl: "https://www.youtube.com/watch?v=4Y2ZdHCOXok", title: "Masterclass" }]);
        break;
      case "cta_banner":
        setBlocks([...blocks, { type: "cta_banner", title: "Ready for Elite Coaching?", description: "Get started on WhatsApp.", buttonText: "Apply Now" }]);
        break;
    }
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const updateBlock = (index: number, key: string, value: any) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], [key]: value };
    setBlocks(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    setSaving(true);

    const payload = {
      ...editingPage,
      blocksJson: JSON.stringify(blocks),
    };

    try {
      const isNew = !editingPage.id;
      const res = await fetch("/api/admin/pages", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save page");

      setEditingPage(null);
      fetchPages();
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this custom page?")) return;
    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <AdminLayout title="Custom Pages & Page Builder">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-black text-xl text-white">
              Dynamic Pages & Content Blocks
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Create unlimited custom pages composed of reusable blocks (headings, videos, rich text, CTAs).
            </p>
          </div>

          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </button>
        </div>

        {/* Pages Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading Pages...
          </div>
        ) : pages.length === 0 ? (
          <div className="p-12 rounded-3xl glass-panel text-center border border-white/5 space-y-3">
            <Layers className="w-12 h-12 text-gray-600 mx-auto" />
            <h4 className="font-heading font-bold text-lg text-white">No Custom Pages Created</h4>
            <p className="text-xs text-gray-400">Create a new page to build custom landing pages.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((p) => {
              const blkCount = parseJsonSafe<any[]>(p.blocksJson, []).length;

              return (
                <div
                  key={p.id}
                  className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.isPublished ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {p.isPublished ? "PUBLISHED" : "DRAFT"}
                      </span>
                      <span className="text-[10px] text-gray-400">{blkCount} Blocks</span>
                    </div>

                    <h3 className="font-heading font-black text-xl text-white">
                      {p.title}
                    </h3>

                    <p className="text-xs text-primary font-mono mt-1">
                      /pages/{p.slug}
                    </p>

                    {p.metaDescription && (
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                        {p.metaDescription}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    {p.isPublished && (
                      <Link
                        href={`/pages/${p.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl glass-panel text-gray-400 hover:text-white"
                        title="View live page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    <button
                      onClick={() => openEdit(p)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-gray-200 glass-panel hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Page</span>
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-xl glass-panel text-gray-400 hover:text-red-400"
                      title="Delete"
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

      {/* Page Builder Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-4xl rounded-3xl p-6 sm:p-8 border border-white/20 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setEditingPage(null)}
              className="absolute top-5 right-5 p-2 rounded-full glass-panel text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-black text-2xl text-white mb-6">
              {editingPage.id ? "Page Builder: Edit Page" : "Page Builder: New Page"}
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPage.title || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    placeholder="e.g. VIP Concierge Guidelines"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingPage.slug || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                    placeholder="vip-guidelines"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-mono focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Meta Description (SEO)
                </label>
                <textarea
                  rows={2}
                  value={editingPage.metaDescription || ""}
                  onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                  placeholder="Summary for search engines..."
                  className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none resize-none"
                />
              </div>

              {/* Block Composer Zone */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-heading font-black text-base text-white">
                      Page Blocks Composition
                    </h4>
                    <p className="text-xs text-gray-400">Add and customize reusable sections for this page.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => addBlock("heading")}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white"
                    >
                      + Heading
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock("rich_text")}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white"
                    >
                      + Text
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock("image")}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white"
                    >
                      + Image
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock("video")}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white"
                    >
                      + Video
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock("cta_banner")}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-dark-950 font-black"
                    >
                      + CTA Banner
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {blocks.map((block, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                          Block {idx + 1}: {block.type}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeBlock(idx)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {block.type === "heading" && (
                        <input
                          type="text"
                          value={block.content || ""}
                          onChange={(e) => updateBlock(idx, "content", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
                        />
                      )}

                      {block.type === "rich_text" && (
                        <textarea
                          rows={3}
                          value={block.content || ""}
                          onChange={(e) => updateBlock(idx, "content", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none resize-none"
                        />
                      )}

                      {block.type === "image" && (
                        <div className="space-y-3">
                          <ImageFieldPicker
                            label="Content Image"
                            value={block.imageUrl || ""}
                            onChange={(url) => updateBlock(idx, "imageUrl", url)}
                            category="general"
                            aspectRatio="aspect-video"
                            helperText="Upload image from computer or choose from Media Library."
                          />
                          <input
                            type="text"
                            placeholder="Caption (optional)"
                            value={block.caption || ""}
                            onChange={(e) => updateBlock(idx, "caption", e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                          />
                        </div>
                      )}

                      {block.type === "video" && (
                        <input
                          type="text"
                          placeholder="YouTube or Vimeo URL"
                          value={block.videoUrl || ""}
                          onChange={(e) => updateBlock(idx, "videoUrl", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                        />
                      )}

                      {block.type === "cta_banner" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Banner Title"
                            value={block.title || ""}
                            onChange={(e) => updateBlock(idx, "title", e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Button Text"
                            value={block.buttonText || ""}
                            onChange={(e) => updateBlock(idx, "buttonText", e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6 pt-3 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPage.isPublished}
                    onChange={(e) => setEditingPage({ ...editingPage, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <span>Publish to Public Visitors (Uncheck for Draft)</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {saving ? "Saving Page..." : "Save & Publish"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
