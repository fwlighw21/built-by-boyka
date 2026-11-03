"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { UploadCloud, Trash2, Copy, Check, Search, Filter, AlertCircle, File, Image as ImageIcon } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface MediaItem {
  id: string;
  fileName: string;
  url: string;
  fileSize: number;
  mimeType: string;
  category: string;
  altText?: string | null;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      let query = "/api/admin/media?";
      if (selectedCategory !== "all") query += `category=${selectedCategory}&`;
      if (search) query += `search=${encodeURIComponent(search)}`;

      const res = await fetch(query);
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (e) {
      console.error("Error fetching media:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedCategory, search]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", selectedCategory !== "all" ? selectedCategory : "general");

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
      } catch (err: any) {
        setError(err.message || "Failed to upload one or more files");
      }
    }

    setUploading(false);
    fetchMedia();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;

    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (e) {
      alert("Failed to delete asset");
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };


  return (
    <AdminLayout title="Media Library">
      <div className="space-y-8">
        
        {/* Upload Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileUpload(e.dataTransfer.files);
          }}
          className="glass-card rounded-3xl p-8 border-2 border-dashed border-white/20 hover:border-primary/50 transition-colors text-center cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            multiple
            accept="image/*,video/mp4,video/webm"
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary group-hover:scale-110 transition-transform mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="font-heading font-black text-lg text-white">
            {uploading ? "Uploading Assets..." : "Drag & Drop Images or Videos Here"}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Or click to browse from your computer. Supports JPEG, PNG, WebP, SVG, MP4 (Max 25MB).
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search filename or alt text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {["all", "general", "hero", "transformations", "services", "packages", "avatars"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-dark-950 font-black"
                    : "glass-panel text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
            Loading Assets...
          </div>
        ) : media.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border border-white/5">
            <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h4 className="font-heading font-bold text-lg text-white">No Media Found</h4>
            <p className="text-xs text-gray-400 mt-1">Upload files using the drag & drop area above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((item) => {
              const isVideo = item.mimeType.includes("video");

              return (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full bg-dark-900 overflow-hidden">
                    {isVideo ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                        <File className="w-8 h-8 text-primary mb-2" />
                        <span className="text-[10px] text-gray-300 font-mono truncate max-w-full">
                          {item.fileName}
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={item.url}
                        alt={item.altText || item.fileName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {/* Overlay Action Buttons */}
                    <div className="absolute inset-0 bg-dark-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        onClick={() => copyUrl(item.id, item.url)}
                        className="p-2 rounded-xl bg-primary text-dark-950 hover:scale-110 transition-transform shadow-lg"
                        title="Copy URL"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-xl bg-red-600 text-white hover:scale-110 transition-transform shadow-lg"
                        title="Delete asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Metadata */}
                  <div className="p-3 space-y-1">
                    <p className="text-[11px] font-bold text-white truncate" title={item.fileName}>
                      {item.fileName}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span>{formatBytes(item.fileSize)}</span>
                      <span className="capitalize">{item.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
