"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageFieldPicker from "@/components/admin/ImageFieldPicker";
import { Plus, Edit2, Trash2, Video, Play, X, ExternalLink } from "lucide-react";
import { getYouTubeEmbedUrl } from "@/lib/utils";

interface VideoData {
  id: string;
  title: string;
  description?: string | null;
  videoType: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  category: string;
  duration?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
}

export default function VideosAdminPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<Partial<VideoData> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/videos");
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const openNew = () => {
    setEditingVideo({
      title: "",
      description: "",
      videoType: "youtube",
      videoUrl: "",
      thumbnailUrl: "",
      category: "Training Mechanics",
      duration: "10:00",
      isFeatured: false,
      isPublished: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    setSaving(true);

    try {
      const isNew = !editingVideo.id;
      const res = await fetch("/api/admin/videos", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingVideo),
      });

      if (!res.ok) throw new Error("Failed to save video");

      setEditingVideo(null);
      fetchVideos();
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      const res = await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <AdminLayout title="Video Library Management">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-black text-xl text-white">
              Video Masterclasses & Highlights
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Add YouTube, Vimeo, or direct video masterclasses with custom thumbnails.
            </p>
          </div>

          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Video</span>
          </button>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading Videos...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full bg-dark-950 overflow-hidden">
                  {vid.thumbnailUrl ? (
                    <Image
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <Video className="w-10 h-10" />
                    </div>
                  )}

                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-dark-950/80 text-primary">
                    {vid.category}
                  </div>

                  {vid.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-dark-950/80 text-white">
                      {vid.duration}
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-heading font-black text-base text-white line-clamp-2">
                      {vid.title}
                    </h4>
                    {vid.description && (
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setEditingVideo(vid)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-gray-200 glass-panel hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(vid.id)}
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
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-white/20 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingVideo(null)}
              className="absolute top-5 right-5 p-2 rounded-full glass-panel text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-black text-2xl text-white mb-6">
              {editingVideo.id ? "Edit Video" : "Add Video Masterclass"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingVideo.title || ""}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  placeholder="e.g. Mastering Lat Hypertrophy"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Video URL (YouTube / Vimeo / MP4) *
                </label>
                <input
                  type="text"
                  required
                  value={editingVideo.videoUrl || ""}
                  onChange={(e) => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <ImageFieldPicker
                label="Masterclass Video Thumbnail"
                value={editingVideo.thumbnailUrl || ""}
                onChange={(url) => setEditingVideo({ ...editingVideo, thumbnailUrl: url })}
                category="videos"
                aspectRatio="aspect-video"
                helperText="Upload custom video poster image or select from Media Library."
              />

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={editingVideo.category || "Training Mechanics"}
                  onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                  placeholder="e.g. Training Mechanics"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingVideo.duration || ""}
                    onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    placeholder="e.g. 14:20"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingVideo.isPublished}
                      onChange={(e) => setEditingVideo({ ...editingVideo, isPublished: e.target.checked })}
                      className="w-4 h-4 accent-primary"
                    />
                    <span>Published on Website</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingVideo.description || ""}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  placeholder="Key takeaways and summary..."
                  className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Video"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
