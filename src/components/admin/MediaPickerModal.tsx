"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Search,
  UploadCloud,
  Check,
  ImageIcon,
  Filter,
  Loader2,
  Trash2,
  AlertCircle,
} from "lucide-react";

interface MediaAssetItem {
  id: string;
  fileName: string;
  url: string;
  fileSize: number;
  mimeType: string;
  category: string;
  altText?: string | null;
  createdAt: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, asset?: MediaAssetItem) => void;
  title?: string;
  initialCategory?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = "Select Image from Media Library",
  initialCategory = "all",
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MediaAssetItem | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { key: "all", label: "All Assets" },
    { key: "transformations", label: "Transformations" },
    { key: "coach", label: "Coach & Team" },
    { key: "branding", label: "Branding & Logos" },
    { key: "services", label: "Services & Programs" },
    { key: "packages", label: "Packages & Pricing" },
    { key: "videos", label: "Videos & Media" },
    { key: "avatars", label: "Client Avatars" },
    { key: "general", label: "General" },
  ];

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError("");
      let query = "/api/admin/media?";
      if (selectedCategory !== "all") query += `category=${selectedCategory}&`;
      if (search) query += `search=${encodeURIComponent(search)}`;

      const res = await fetch(query);
      if (res.ok) {
        const data = await res.json();
        setAssets(data);
      } else {
        throw new Error("Failed to load media assets");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
      setSelectedUrl(null);
      setSelectedAsset(null);
    }
  }, [isOpen, selectedCategory, search]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", selectedCategory === "all" ? "transformations" : selectedCategory);
      formData.append("altText", file.name);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Automatically select the newly uploaded image
      onSelect(data.asset.url, data.asset);
      onClose();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-4xl rounded-3xl border border-white/20 flex flex-col max-h-[88vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">
                {title}
              </h3>
              <p className="text-xs text-gray-400">
                Choose an image from your library or upload a new one directly.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full glass-panel text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Filters */}
        <div className="p-4 sm:p-6 pb-2 border-b border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* View Tabs */}
            <div className="flex items-center gap-2 p-1 bg-dark-900 rounded-xl border border-white/10 self-start">
              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "library"
                    ? "bg-primary text-dark-950 shadow-md font-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Media Library ({assets.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "upload"
                    ? "bg-primary text-dark-950 shadow-md font-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Upload New Image
              </button>
            </div>

            {/* Search Input (Library Tab) */}
            {activeTab === "library" && (
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs placeholder-gray-500 focus:border-primary focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Category Chips (Library Tab) */}
          {activeTab === "library" && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0 font-medium mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.key
                      ? "bg-primary/20 text-accent border border-primary/40"
                      : "glass-panel text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="m-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === "upload" ? (
            /* Upload Tab */
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-primary/40 rounded-3xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer text-center p-6"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />

              <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary mb-4">
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <UploadCloud className="w-8 h-8" />
                )}
              </div>

              <h4 className="font-heading font-black text-lg text-white mb-1">
                {uploading ? "Uploading Image..." : "Click or Drag & Drop to Upload"}
              </h4>
              <p className="text-xs text-gray-400 max-w-sm">
                Supported formats: PNG, JPG, WebP, SVG. File will be automatically added to your Media Library and selected.
              </p>

              <button
                type="button"
                disabled={uploading}
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{uploading ? "Uploading..." : "Select File From Computer"}</span>
              </button>
            </div>
          ) : loading ? (
            /* Loading State */
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                Loading Media Assets...
              </p>
            </div>
          ) : assets.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
                <ImageIcon className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-gray-300">No images found in this category</p>
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-primary/20 border border-primary/40 hover:bg-primary/30 text-accent transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload an Image Now</span>
              </button>
            </div>
          ) : (
            /* Image Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {assets.map((asset) => {
                const isSelected = selectedUrl === asset.url;
                return (
                  <div
                    key={asset.id}
                    onClick={() => {
                      setSelectedUrl(asset.url);
                      setSelectedAsset(asset);
                    }}
                    className={`relative group aspect-square rounded-2xl overflow-hidden glass-card p-1 border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/40 scale-[1.02]"
                        : "border-white/10 hover:border-primary/40"
                    }`}
                  >
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/60">
                      <Image
                        src={asset.url}
                        alt={asset.altText || asset.fileName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Selected checkmark badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary text-dark-950 flex items-center justify-center shadow-lg font-black animate-in zoom-in-75">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}

                      {/* Hover Info Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-left">
                        <p className="text-xs font-bold text-white truncate">
                          {asset.fileName}
                        </p>
                        <p className="text-[10px] text-accent uppercase font-bold tracking-wider">
                          {asset.category}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-dark-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-400 truncate max-w-sm">
            {selectedUrl ? (
              <span className="flex items-center gap-1.5 text-accent font-semibold truncate">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Selected: {selectedAsset?.fileName || selectedUrl}</span>
              </span>
            ) : (
              <span>Click on any image to select it.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-gray-300 glass-panel hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!selectedUrl}
              onClick={() => {
                if (selectedUrl) {
                  onSelect(selectedUrl, selectedAsset || undefined);
                  onClose();
                }
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/25 disabled:opacity-40 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Use Selected Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
