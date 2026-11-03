"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  ImageIcon,
  RefreshCw,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import MediaPickerModal from "./MediaPickerModal";

interface ImageFieldPickerProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  category?: string;
  aspectRatio?: string;
  helperText?: string;
}

export default function ImageFieldPicker({
  label,
  value,
  onChange,
  required = false,
  category = "transformations",
  aspectRatio = "aspect-[3/4]",
  helperText,
}: ImageFieldPickerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadingDirect, setUploadingDirect] = useState(false);
  const directInputRef = useRef<HTMLInputElement>(null);

  const handleDirectUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingDirect(true);

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      formData.append("altText", file.name);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      onChange(data.asset.url);
    } catch (err: any) {
      alert(err.message || "Failed to upload image");
    } finally {
      setUploadingDirect(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
          {label} {required && <span className="text-primary">*</span>}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-gray-400 hover:text-accent flex items-center gap-1 transition-colors"
          >
            <span>{showUrlInput ? "Hide Raw URL" : "Edit URL"}</span>
            {showUrlInput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Hidden File Input for Direct Upload */}
      <input
        ref={directInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleDirectUpload(e.target.files)}
      />

      {/* Visual Image Preview / Dropzone */}
      {value ? (
        <div className="glass-card rounded-2xl p-3 border border-white/10 flex flex-col sm:flex-row items-center gap-4 group">
          {/* Thumbnail Container */}
          <div className={`relative w-28 sm:w-32 ${aspectRatio} rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0`}>
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
            />
          </div>

          {/* Controls & Details */}
          <div className="flex-1 w-full space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Image Selected
              </span>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1"
                title="Open in new tab"
              >
                <span>View Full</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-gray-300 font-mono truncate max-w-xs sm:max-w-md">
              {value}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-200 glass-panel hover:text-white hover:border-primary/50 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-primary" />
                <span>Replace from Library</span>
              </button>

              <button
                type="button"
                disabled={uploadingDirect}
                onClick={() => directInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-200 glass-panel hover:text-white hover:border-primary/50 transition-colors"
              >
                {uploadingDirect ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5 text-accent" />
                )}
                <span>Upload New</span>
              </button>

              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 glass-panel hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Dropzone */
        <div className="rounded-2xl border-2 border-dashed border-white/15 hover:border-primary/40 bg-dark-900/60 p-5 text-center transition-all flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <ImageIcon className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs font-bold text-white">No image selected</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {helperText || "Choose from your media library or upload directly."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-primary/20 border border-primary/40 hover:bg-primary/30 text-accent transition-all"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Select from Library</span>
            </button>

            <button
              type="button"
              disabled={uploadingDirect}
              onClick={() => directInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-200 glass-panel hover:text-white hover:border-white/30 transition-all"
            >
              {uploadingDirect ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              <span>Upload New</span>
            </button>
          </div>
        </div>
      )}

      {/* Fallback Manual URL Input (Collapsible) */}
      {(showUrlInput || (!value && showUrlInput)) && (
        <div className="pt-2 animate-in fade-in">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or /uploads/..."
            className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-white/10 text-white text-xs font-mono focus:border-primary focus:outline-none"
          />
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(url) => onChange(url)}
        title={`Select ${label}`}
        initialCategory={category}
      />
    </div>
  );
}
