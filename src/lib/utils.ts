import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | null | undefined, currency = "EGP"): string {
  const safeAmount = (amount == null || isNaN(Number(amount)) || !isFinite(Number(amount))) ? 0 : Number(amount);
  const safeCurrency = (currency || "EGP").trim().toUpperCase();
  try {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: 0,
    }).format(safeAmount);
  } catch {
    return `${safeAmount.toLocaleString()} ${safeCurrency}`;
  }
}

export function calculateDiscount(
  price: number | null | undefined,
  originalPrice: number | null | undefined
): { savings: number; percentage: number } {
  const p = Number(price) || 0;
  const op = Number(originalPrice) || 0;
  if (op > p && op > 0) {
    const savings = Math.max(0, op - p);
    const percentage = Math.min(100, Math.max(0, Math.round((savings / op) * 100)));
    return { savings, percentage };
  }
  return { savings: 0, percentage: 0 };
}

export function formatBytes(bytes: number | null | undefined, decimals = 1): string {
  if (bytes === null || bytes === undefined || isNaN(Number(bytes)) || Number(bytes) <= 0 || !isFinite(Number(bytes))) {
    return "0 B";
  }
  const numBytes = Number(bytes);
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.min(Math.floor(Math.log(numBytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((numBytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function clampAngle(deg: number | string | null | undefined): number {
  const num = Number(deg);
  if (isNaN(num) || !isFinite(num)) return 135;
  return ((Math.round(num) % 360) + 360) % 360;
}

export function clampPercentage(val: number | string | null | undefined): number {
  const num = Number(val);
  if (isNaN(num) || !isFinite(num)) return 0;
  return Math.min(100, Math.max(0, Math.round(num)));
}

export function hexToRgba(hex: string | null | undefined, alpha = 1): string {
  if (!hex) return `rgba(117, 71, 245, ${alpha})`;
  const clampedAlpha = isNaN(alpha) ? 1 : Math.min(1, Math.max(0, alpha));
  const trimmed = hex.trim();

  if (trimmed.startsWith("rgba(") || trimmed.startsWith("rgb(")) {
    return trimmed;
  }

  let clean = trimmed.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }

  if (clean.length === 6 || clean.length === 8) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
    }
  }

  return `rgba(117, 71, 245, ${clampedAlpha})`;
}

export function parseJsonSafe<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}

export function getVideoEmbedUrl(url: string, autoplay = true): string {
  if (!url) return "";
  const autoParam = autoplay ? "1" : "0";

  // If already embed URL
  if (url.includes("/embed/")) {
    return url.includes("?") ? `${url}&autoplay=${autoParam}` : `${url}?autoplay=${autoParam}`;
  }

  // Handle standard YouTube watch?v= format
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=${autoParam}&rel=0`;
  }

  // Handle youtu.be shortlinks
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=${autoParam}&rel=0`;
  }

  // Handle Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${autoParam}`;
  }

  return url;
}

export function getYouTubeEmbedUrl(url: string): string {
  return getVideoEmbedUrl(url, true);
}
