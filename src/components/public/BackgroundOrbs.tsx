"use client";

import React from "react";

interface AnimationProps {
  animationsEnabled?: boolean;
  reducedMotion?: boolean;
  orbCount?: number;
  animationSpeed?: string;
  animationIntensity?: string;
  blurAmount?: number;
  backgroundEffect?: string;
}

export default function BackgroundOrbs({ settings }: { settings?: AnimationProps | null }) {
  const enabled = settings?.animationsEnabled !== false;
  const reduced = settings?.reducedMotion === true;
  const blur = settings?.blurAmount ? `${settings.blurAmount}px` : "90px";
  const orbCount = Math.min(Math.max(settings?.orbCount || 3, 1), 5);
  const speed = settings?.animationSpeed || "normal";

  if (!enabled || reduced) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle static gradient glow when animations are disabled */}
        <div
          className="ambient-orb w-[600px] h-[600px] -top-40 -left-40 opacity-20"
          style={{
            background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
            filter: `blur(${blur})`,
          }}
        />
        <div
          className="ambient-orb w-[500px] h-[500px] top-1/2 -right-40 opacity-15"
          style={{
            background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)",
            filter: `blur(${blur})`,
          }}
        />
      </div>
    );
  }

  // Animation durations based on speed
  const durationClass1 = speed === "fast" ? "animate-float-slow duration-[5s]" : speed === "slow" ? "animate-float-slow duration-[14s]" : "animate-float-slow";
  const durationClass2 = speed === "fast" ? "animate-float-reverse duration-[6s]" : speed === "slow" ? "animate-float-reverse duration-[16s]" : "animate-float-reverse";

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Orb 1: Primary Cyan / Custom glow top-left */}
      <div
        className={`ambient-orb w-[550px] h-[550px] -top-24 -left-28 opacity-30 ${durationClass1}`}
        style={{
          background: "radial-gradient(circle, var(--color-primary) 0%, transparent 68%)",
          filter: `blur(${blur})`,
        }}
      />

      {/* Orb 2: Secondary Violet mid-right */}
      {orbCount >= 2 && (
        <div
          className={`ambient-orb w-[600px] h-[600px] top-1/3 -right-36 opacity-25 ${durationClass2}`}
          style={{
            background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)",
            filter: `blur(${blur})`,
          }}
        />
      )}

      {/* Orb 3: Accent Green or Cyan deep center */}
      {orbCount >= 3 && (
        <div
          className={`ambient-orb w-[480px] h-[480px] top-2/3 left-1/4 opacity-20 ${durationClass1}`}
          style={{
            background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
            filter: `blur(${blur})`,
          }}
        />
      )}

      {/* Orb 4: Bottom right subtle glow */}
      {orbCount >= 4 && (
        <div
          className={`ambient-orb w-[520px] h-[520px] bottom-0 right-1/4 opacity-20 ${durationClass2}`}
          style={{
            background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
            filter: `blur(${blur})`,
          }}
        />
      )}

      {/* Subtle grid mesh overlay for high-tech premium feel */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
