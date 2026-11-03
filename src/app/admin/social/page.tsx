"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit2, Trash2, Share2, ExternalLink, X } from "lucide-react";

interface SocialLinkData {
  id: string;
  platform: string;
  url: string;
  icon: string;
  isVisible: boolean;
  order: number;
}

export default function SocialLinksAdminPage() {
  const [links, setLinks] = useState<SocialLinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<Partial<SocialLinkData> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/social");
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const openNew = () => {
    setEditingLink({
      platform: "Instagram",
      url: "https://instagram.com/builtbyboyka",
      icon: "Instagram",
      isVisible: true,
      order: links.length,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    setSaving(true);

    try {
      const isNew = !editingLink.id;
      const res = await fetch("/api/admin/social", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingLink),
      });

      if (!res.ok) throw new Error("Failed to save social link");

      setEditingLink(null);
      fetchLinks();
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this social link?")) return;
    try {
      const res = await fetch(`/api/admin/social?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <AdminLayout title="Social Media Channels">
      <div className="space-y-8 max-w-4xl">
        
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-black text-xl text-white">
              Official Social Profiles
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Add links to Instagram, YouTube, TikTok, Facebook to display in the website footer.
            </p>
          </div>

          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Social Profile</span>
          </button>
        </div>

        {/* Links List */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading Social Links...
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="glass-card rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-sm text-white">
                      {link.platform}
                    </h4>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary font-mono hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>{link.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingLink(link)}
                    className="p-2 rounded-xl glass-panel text-gray-300 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 rounded-xl glass-panel text-gray-400 hover:text-red-400"
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
      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/20 relative">
            <button
              onClick={() => setEditingLink(null)}
              className="absolute top-5 right-5 p-2 rounded-full glass-panel text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-black text-xl text-white mb-6">
              {editingLink.id ? "Edit Social Profile" : "Add Social Profile"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Platform Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingLink.platform || ""}
                  onChange={(e) => setEditingLink({ ...editingLink, platform: e.target.value })}
                  placeholder="e.g. Instagram"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Profile URL *
                </label>
                <input
                  type="text"
                  required
                  value={editingLink.url || ""}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  placeholder="https://instagram.com/builtbyboyka"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Link"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
