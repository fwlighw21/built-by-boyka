"use client";

import React from "react";
import { hexToRgba } from "@/lib/utils";

interface ThemeSettingsProps {
  primaryColor?: string;
  primaryHover?: string;
  secondaryColor?: string;
  secondaryHover?: string;
  accentColor?: string;
  backgroundColor?: string;
  cardBackground?: string;
  cardBorderColor?: string;
  textColor?: string;
  textMutedColor?: string;
  headingColor?: string;
  buttonBg?: string;
  buttonText?: string;
  navBackground?: string;
  footerBackground?: string;
  heroGradient?: string | null;
  cardGradient?: string | null;
  borderGradient?: string | null;
  glowIntensity?: string;
  glowColor?: string;
  sectionOverridesJson?: string | null;
  glassBlur?: number;
  borderRadius?: string;
  activePreset?: string;
}

export default function ThemeInjector({ theme }: { theme?: ThemeSettingsProps | null }) {
  // Luminous Purple Logo Identity Defaults
  const primary = theme?.primaryColor || "#7547F5";
  const primaryHover = theme?.primaryHover || "#6532eb";
  const secondary = theme?.secondaryColor || "#9B7BFF";
  const secondaryHover = theme?.secondaryHover || "#8963ff";
  const accent = theme?.accentColor || "#C9B9FF";
  const bg = theme?.backgroundColor || "#05030a";
  const cardBg = theme?.cardBackground || "rgba(14, 9, 28, 0.75)";
  const cardBorder = theme?.cardBorderColor || "rgba(155, 123, 255, 0.2)";
  const text = theme?.textColor || "#ffffff";
  const textMuted = theme?.textMutedColor || "#9d8ec2";
  const heading = theme?.headingColor || "#ffffff";
  const buttonBg = theme?.buttonBg || "linear-gradient(135deg, #5424D8 0%, #7547F5 50%, #9B7BFF 100%)";
  const buttonText = theme?.buttonText || "#ffffff";
  const navBg = theme?.navBackground || "rgba(5, 3, 10, 0.85)";
  const footerBg = theme?.footerBackground || "#05030a";
  const heroGradient = theme?.heroGradient || "linear-gradient(135deg, rgba(84, 36, 216, 0.25) 0%, rgba(117, 71, 245, 0.18) 50%, transparent 100%)";
  const borderGradient = theme?.borderGradient || "linear-gradient(135deg, rgba(155, 123, 255, 0.3) 0%, rgba(117, 71, 245, 0.1) 100%)";
  const glassBlur = theme?.glassBlur ? `${theme.glassBlur}px` : "16px";
  const borderRadius = theme?.borderRadius || "1rem";

  const glowAlpha = theme?.glowIntensity === "high" ? 0.65 : theme?.glowIntensity === "subtle" ? 0.25 : 0.45;
  const primaryGlow = theme?.glowColor || hexToRgba(primary, glowAlpha);
  const secondaryGlow = hexToRgba(secondary, glowAlpha * 0.8);
  const accentGlow = hexToRgba(accent, glowAlpha * 0.7);

  // Parse any section overrides if present
  let sectionOverridesCss = "";
  if (theme?.sectionOverridesJson) {
    try {
      const overrides = JSON.parse(theme.sectionOverridesJson);
      if (typeof overrides === "object" && overrides !== null) {
        Object.entries(overrides).forEach(([sectionId, rules]: [string, any]) => {
          if (rules && typeof rules === "object") {
            const ruleEntries = Object.entries(rules)
              .map(([prop, val]) => `${prop}: ${val};`)
              .join(" ");
            sectionOverridesCss += `#${sectionId} { ${ruleEntries} }\n`;
          }
        });
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  const css = `
    :root {
      --color-primary: ${primary};
      --color-primary-hover: ${primaryHover};
      --color-primary-glow: ${primaryGlow};
      --color-secondary: ${secondary};
      --color-secondary-hover: ${secondaryHover};
      --color-secondary-glow: ${secondaryGlow};
      --color-accent: ${accent};
      --color-accent-glow: ${accentGlow};
      --color-highlight: ${accent};
      --color-brand-deep: ${primary};
      --color-bg-base: ${bg};
      --color-card-bg: ${cardBg};
      --color-card-border: ${cardBorder};
      --color-text: ${text};
      --color-text-muted: ${textMuted};
      --color-heading: ${heading};
      --gradient-primary: ${buttonBg};
      --gradient-button: ${buttonBg};
      --gradient-hero: ${heroGradient};
      --gradient-border: ${borderGradient};
      --nav-background: ${navBg};
      --footer-background: ${footerBg};
      --button-text: ${buttonText};
      --glass-blur: ${glassBlur};
      --border-radius: ${borderRadius};
    }
    ${sectionOverridesCss}
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
