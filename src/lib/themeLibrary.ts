export interface ReadyMadeTheme {
  id: string;
  name: string;
  category:
    | "Purple"
    | "Blue"
    | "Green"
    | "Red & Orange"
    | "Pink"
    | "Luxury"
    | "Dark"
    | "Light"
    | "Multicolor";
  description: string;
  previewGradient: string;
  swatches: [string, string, string, string, string]; // [primary, secondary, accent, bg, highlight]
  isFeatured?: boolean;

  // Full Coordinated Palette
  primaryColor: string;
  primaryHover: string;
  secondaryColor: string;
  secondaryHover: string;
  accentColor: string;
  backgroundColor: string;
  cardBackground: string;
  cardBorderColor: string;
  textColor: string;
  textMutedColor: string;
  headingColor: string;
  buttonBg: string;
  buttonText: string;
  navBackground: string;
  footerBackground: string;
  heroGradient: string;
  cardGradient?: string;
  borderGradient: string;
  glowIntensity: "subtle" | "medium" | "high";
  glowColor: string;
  glassBlur: number;
  borderRadius: string;
}

export const READY_MADE_THEMES: ReadyMadeTheme[] = [
  // 1. Brand Logo Official Theme
  {
    id: "luminous-purple",
    name: "Luminous Violet (Logo Identity)",
    category: "Purple",
    description: "Official Built By Boyka signature theme matching the luminous purple logo badge.",
    previewGradient: "linear-gradient(135deg, #5424D8 0%, #7547F5 50%, #9B7BFF 100%)",
    swatches: ["#7547F5", "#9B7BFF", "#C9B9FF", "#05030a", "#F0EAFF"],
    isFeatured: true,
    primaryColor: "#7547F5",
    primaryHover: "#6532eb",
    secondaryColor: "#9B7BFF",
    secondaryHover: "#8963ff",
    accentColor: "#C9B9FF",
    backgroundColor: "#05030a",
    cardBackground: "rgba(14, 9, 28, 0.75)",
    cardBorderColor: "rgba(155, 123, 255, 0.22)",
    textColor: "#ffffff",
    textMutedColor: "#9d8ec2",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #5424D8 0%, #7547F5 50%, #9B7BFF 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(5, 3, 10, 0.85)",
    footerBackground: "#05030a",
    heroGradient: "linear-gradient(135deg, rgba(84, 36, 216, 0.28) 0%, rgba(117, 71, 245, 0.18) 50%, transparent 100%)",
    borderGradient: "linear-gradient(135deg, rgba(155, 123, 255, 0.35) 0%, rgba(117, 71, 245, 0.1) 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(117, 71, 245, 0.45)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 2. Purple Neon
  {
    id: "purple-neon",
    name: "Purple Neon",
    category: "Purple",
    description: "Ultra-vibrant high voltage electric purple with neon cyan highlights.",
    previewGradient: "linear-gradient(135deg, #7928CA 0%, #B800FF 50%, #00DFD8 100%)",
    swatches: ["#B800FF", "#7928CA", "#00DFD8", "#070210", "#F2C94C"],
    isFeatured: true,
    primaryColor: "#B800FF",
    primaryHover: "#a000e0",
    secondaryColor: "#7928CA",
    secondaryHover: "#6620b0",
    accentColor: "#00DFD8",
    backgroundColor: "#070210",
    cardBackground: "rgba(18, 6, 34, 0.8)",
    cardBorderColor: "rgba(184, 0, 255, 0.3)",
    textColor: "#ffffff",
    textMutedColor: "#a78bfa",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #7928CA 0%, #B800FF 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(7, 2, 16, 0.88)",
    footerBackground: "#05010b",
    heroGradient: "linear-gradient(135deg, rgba(184, 0, 255, 0.25) 0%, rgba(0, 223, 216, 0.15) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(184, 0, 255, 0.4) 0%, rgba(0, 223, 216, 0.2) 100%)",
    glowIntensity: "high",
    glowColor: "rgba(184, 0, 255, 0.6)",
    glassBlur: 18,
    borderRadius: "1rem",
  },

  // 3. Midnight Violet
  {
    id: "midnight-violet",
    name: "Midnight Violet",
    category: "Purple",
    description: "Deep obsidian velvet background with regal amethyst and violet illumination.",
    previewGradient: "linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #a855f7 100%)",
    swatches: ["#8b5cf6", "#a855f7", "#c084fc", "#040208", "#f3e8ff"],
    primaryColor: "#8b5cf6",
    primaryHover: "#7c3aed",
    secondaryColor: "#a855f7",
    secondaryHover: "#9333ea",
    accentColor: "#c084fc",
    backgroundColor: "#040208",
    cardBackground: "rgba(13, 6, 24, 0.85)",
    cardBorderColor: "rgba(139, 92, 246, 0.22)",
    textColor: "#ffffff",
    textMutedColor: "#a191c2",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #6b21a8 0%, #8b5cf6 50%, #a855f7 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(4, 2, 8, 0.9)",
    footerBackground: "#030106",
    heroGradient: "linear-gradient(135deg, rgba(107, 33, 168, 0.3) 0%, rgba(139, 92, 246, 0.15) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, transparent 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(139, 92, 246, 0.4)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 4. Lavender Glass
  {
    id: "lavender-glass",
    name: "Lavender Glass",
    category: "Purple",
    description: "Smooth frosted glass with pastel lavender radiance and soft lilac borders.",
    previewGradient: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #e9d5ff 100%)",
    swatches: ["#a78bfa", "#c4b5fd", "#e9d5ff", "#08060f", "#ffffff"],
    primaryColor: "#a78bfa",
    primaryHover: "#8b5cf6",
    secondaryColor: "#c4b5fd",
    secondaryHover: "#a78bfa",
    accentColor: "#e9d5ff",
    backgroundColor: "#08060f",
    cardBackground: "rgba(22, 17, 36, 0.65)",
    cardBorderColor: "rgba(196, 181, 253, 0.25)",
    textColor: "#ffffff",
    textMutedColor: "#b8acc9",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(8, 6, 15, 0.8)",
    footerBackground: "#07050d",
    heroGradient: "linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(167, 139, 250, 0.15) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(196, 181, 253, 0.35) 0%, rgba(124, 58, 237, 0.1) 100%)",
    glowIntensity: "subtle",
    glowColor: "rgba(167, 139, 250, 0.35)",
    glassBlur: 22,
    borderRadius: "1.25rem",
  },

  // 5. Electric Blue
  {
    id: "electric-blue",
    name: "Electric Blue",
    category: "Blue",
    description: "High-contrast cobalt and royal sapphire with electric cyan lightning accents.",
    previewGradient: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #38bdf8 100%)",
    swatches: ["#2563eb", "#38bdf8", "#60a5fa", "#030816", "#ffffff"],
    isFeatured: true,
    primaryColor: "#2563eb",
    primaryHover: "#1d4ed8",
    secondaryColor: "#38bdf8",
    secondaryHover: "#0ea5e9",
    accentColor: "#60a5fa",
    backgroundColor: "#030816",
    cardBackground: "rgba(7, 18, 42, 0.8)",
    cardBorderColor: "rgba(56, 189, 248, 0.22)",
    textColor: "#ffffff",
    textMutedColor: "#93c5fd",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #38bdf8 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(3, 8, 22, 0.9)",
    footerBackground: "#020510",
    heroGradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(56, 189, 248, 0.15) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.4) 0%, rgba(37, 99, 235, 0.1) 100%)",
    glowIntensity: "high",
    glowColor: "rgba(37, 99, 235, 0.55)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 6. Ocean Blue
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    category: "Blue",
    description: "Abyssal marine depth blended with tropical azure waves and turquoise sheen.",
    previewGradient: "linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #38bdf8 100%)",
    swatches: ["#0284c7", "#38bdf8", "#7dd3fc", "#020c18", "#e0f2fe"],
    primaryColor: "#0284c7",
    primaryHover: "#0369a1",
    secondaryColor: "#38bdf8",
    secondaryHover: "#0ea5e9",
    accentColor: "#7dd3fc",
    backgroundColor: "#020c18",
    cardBackground: "rgba(4, 25, 46, 0.78)",
    cardBorderColor: "rgba(56, 189, 248, 0.2)",
    textColor: "#ffffff",
    textMutedColor: "#a5d8f7",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #38bdf8 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(2, 12, 24, 0.88)",
    footerBackground: "#010810",
    heroGradient: "linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(56, 189, 248, 0.12) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.3) 0%, transparent 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(2, 132, 199, 0.45)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 7. Cyan Glow
  {
    id: "cyan-glow",
    name: "Cyan Glow",
    category: "Blue",
    description: "Futuristic neon cyan with bioluminescent aquamarine clarity and dark obsidian glass.",
    previewGradient: "linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #67e8f9 100%)",
    swatches: ["#06b6d4", "#22d3ee", "#67e8f9", "#020d13", "#cffafe"],
    primaryColor: "#06b6d4",
    primaryHover: "#0891b2",
    secondaryColor: "#22d3ee",
    secondaryHover: "#06b6d4",
    accentColor: "#67e8f9",
    backgroundColor: "#020d13",
    cardBackground: "rgba(4, 28, 38, 0.8)",
    cardBorderColor: "rgba(6, 182, 212, 0.25)",
    textColor: "#ffffff",
    textMutedColor: "#8be0ed",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
    buttonText: "#020d13",
    navBackground: "rgba(2, 13, 19, 0.9)",
    footerBackground: "#01070a",
    heroGradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(34, 211, 238, 0.12) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(103, 232, 249, 0.35) 0%, rgba(6, 182, 212, 0.1) 100%)",
    glowIntensity: "high",
    glowColor: "rgba(6, 182, 212, 0.55)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 8. Emerald Green
  {
    id: "emerald-green",
    name: "Emerald Green",
    category: "Green",
    description: "Precious jewel-toned emerald with deep forest undertones and radiant mint brilliance.",
    previewGradient: "linear-gradient(135deg, #047857 0%, #10b981 50%, #34d399 100%)",
    swatches: ["#10b981", "#34d399", "#6ee7b7", "#020f09", "#d1fae5"],
    isFeatured: true,
    primaryColor: "#10b981",
    primaryHover: "#059669",
    secondaryColor: "#34d399",
    secondaryHover: "#10b981",
    accentColor: "#6ee7b7",
    backgroundColor: "#020f09",
    cardBackground: "rgba(4, 31, 19, 0.8)",
    cardBorderColor: "rgba(16, 185, 129, 0.24)",
    textColor: "#ffffff",
    textMutedColor: "#86efac",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(2, 15, 9, 0.9)",
    footerBackground: "#010905",
    heroGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.28) 0%, rgba(52, 211, 153, 0.14) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(52, 211, 153, 0.35) 0%, transparent 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(16, 185, 129, 0.5)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 9. Neon Green
  {
    id: "neon-green",
    name: "Neon Green",
    category: "Green",
    description: "High-octane cyber lime green radiating energy, adrenaline, and power.",
    previewGradient: "linear-gradient(135deg, #15803d 0%, #22c55e 50%, #86efac 100%)",
    swatches: ["#22c55e", "#4ade80", "#86efac", "#030a04", "#dcfce7"],
    primaryColor: "#22c55e",
    primaryHover: "#16a34a",
    secondaryColor: "#4ade80",
    secondaryHover: "#22c55e",
    accentColor: "#86efac",
    backgroundColor: "#030a04",
    cardBackground: "rgba(5, 26, 9, 0.82)",
    cardBorderColor: "rgba(34, 197, 94, 0.28)",
    textColor: "#ffffff",
    textMutedColor: "#86efac",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
    buttonText: "#030a04",
    navBackground: "rgba(3, 10, 4, 0.9)",
    footerBackground: "#010502",
    heroGradient: "linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(74, 222, 128, 0.15) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(74, 222, 128, 0.4) 0%, rgba(34, 197, 94, 0.1) 100%)",
    glowIntensity: "high",
    glowColor: "rgba(34, 197, 94, 0.6)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 10. Forest Green
  {
    id: "forest-green",
    name: "Forest Green",
    category: "Green",
    description: "Deep alpine pine and moss paired with warm earthy accents for a grounded luxury feel.",
    previewGradient: "linear-gradient(135deg, #14532d 0%, #15803d 50%, #84cc16 100%)",
    swatches: ["#16a34a", "#84cc16", "#bef264", "#040b06", "#f7fee7"],
    primaryColor: "#16a34a",
    primaryHover: "#15803d",
    secondaryColor: "#84cc16",
    secondaryHover: "#65a30d",
    accentColor: "#bef264",
    backgroundColor: "#040b06",
    cardBackground: "rgba(8, 22, 12, 0.8)",
    cardBorderColor: "rgba(132, 204, 22, 0.2)",
    textColor: "#ffffff",
    textMutedColor: "#93a38f",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #15803d 0%, #84cc16 100%)",
    buttonText: "#040b06",
    navBackground: "rgba(4, 11, 6, 0.88)",
    footerBackground: "#020703",
    heroGradient: "linear-gradient(135deg, rgba(21, 128, 61, 0.25) 0%, rgba(132, 204, 22, 0.12) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(132, 204, 22, 0.3) 0%, transparent 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(22, 163, 74, 0.4)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 11. Black and Gold
  {
    id: "black-and-gold",
    name: "Black and Gold",
    category: "Luxury",
    description: "Ultra-prestigious VIP aesthetic combining deep obsidian with luminous 24K bullion gold.",
    previewGradient: "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #fef08a 100%)",
    swatches: ["#f59e0b", "#fbbf24", "#fef08a", "#060503", "#ffffff"],
    isFeatured: true,
    primaryColor: "#f59e0b",
    primaryHover: "#d97706",
    secondaryColor: "#fbbf24",
    secondaryHover: "#f59e0b",
    accentColor: "#fef08a",
    backgroundColor: "#060503",
    cardBackground: "rgba(20, 16, 8, 0.85)",
    cardBorderColor: "rgba(245, 158, 11, 0.26)",
    textColor: "#ffffff",
    textMutedColor: "#d1b47e",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #fbbf24 100%)",
    buttonText: "#000000",
    navBackground: "rgba(6, 5, 3, 0.9)",
    footerBackground: "#030201",
    heroGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(251, 191, 36, 0.12) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(251, 191, 36, 0.4) 0%, rgba(180, 83, 9, 0.1) 100%)",
    glowIntensity: "high",
    glowColor: "rgba(245, 158, 11, 0.55)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 12. Luxury Gold
  {
    id: "luxury-gold",
    name: "Luxury Gold",
    category: "Luxury",
    description: "Warm champagne, amber, and imperial gold polished to royal perfection.",
    previewGradient: "linear-gradient(135deg, #92400e 0%, #d97706 50%, #fde68a 100%)",
    swatches: ["#d97706", "#f59e0b", "#fde68a", "#080603", "#fffbeb"],
    primaryColor: "#d97706",
    primaryHover: "#b45309",
    secondaryColor: "#f59e0b",
    secondaryHover: "#d97706",
    accentColor: "#fde68a",
    backgroundColor: "#080603",
    cardBackground: "rgba(24, 18, 9, 0.8)",
    cardBorderColor: "rgba(217, 119, 6, 0.25)",
    textColor: "#ffffff",
    textMutedColor: "#d4b88b",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #92400e 0%, #d97706 50%, #f59e0b 100%)",
    buttonText: "#000000",
    navBackground: "rgba(8, 6, 3, 0.9)",
    footerBackground: "#040301",
    heroGradient: "linear-gradient(135deg, rgba(217, 119, 6, 0.24) 0%, rgba(245, 158, 11, 0.12) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(253, 230, 138, 0.35) 0%, transparent 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(217, 119, 6, 0.45)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 13. Crimson Red
  {
    id: "crimson-red",
    name: "Crimson Red",
    category: "Red & Orange",
    description: "Aggressive, high-intensity competition crimson and scarlet built for athletic dominance.",
    previewGradient: "linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #fda4af 100%)",
    swatches: ["#e11d48", "#f43f5e", "#fda4af", "#0a0204", "#fff1f2"],
    isFeatured: true,
    primaryColor: "#e11d48",
    primaryHover: "#be123c",
    secondaryColor: "#f43f5e",
    secondaryHover: "#e11d48",
    accentColor: "#fda4af",
    backgroundColor: "#0a0204",
    cardBackground: "rgba(26, 6, 12, 0.82)",
    cardBorderColor: "rgba(225, 29, 72, 0.25)",
    textColor: "#ffffff",
    textMutedColor: "#e29fad",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #f43f5e 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(10, 2, 4, 0.9)",
    footerBackground: "#050102",
    heroGradient: "linear-gradient(135deg, rgba(225, 29, 72, 0.3) 0%, rgba(244, 63, 94, 0.15) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.38) 0%, rgba(159, 18, 57, 0.1) 100%)",
    glowIntensity: "high",
    glowColor: "rgba(225, 29, 72, 0.55)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 14. Ruby Red
  {
    id: "ruby-red",
    name: "Ruby Red",
    category: "Red & Orange",
    description: "Deep velvet noir with radiant ruby gemstone highlights and garnet sheen.",
    previewGradient: "linear-gradient(135deg, #881337 0%, #be123c 50%, #fb7185 100%)",
    swatches: ["#be123c", "#e11d48", "#fb7185", "#080204", "#ffffff"],
    primaryColor: "#be123c",
    primaryHover: "#9f1239",
    secondaryColor: "#e11d48",
    secondaryHover: "#be123c",
    accentColor: "#fb7185",
    backgroundColor: "#080204",
    cardBackground: "rgba(22, 5, 10, 0.8)",
    cardBorderColor: "rgba(190, 18, 60, 0.22)",
    textColor: "#ffffff",
    textMutedColor: "#dca0ad",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #881337 0%, #be123c 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(8, 2, 4, 0.88)",
    footerBackground: "#040102",
    heroGradient: "linear-gradient(135deg, rgba(190, 18, 60, 0.26) 0%, rgba(225, 29, 72, 0.12) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(251, 113, 133, 0.3) 0%, transparent 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(190, 18, 60, 0.45)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 15. Orange Flame
  {
    id: "orange-flame",
    name: "Orange Flame",
    category: "Red & Orange",
    description: "Fiery molten ember, volcanic orange, and bright amber sparks of energy.",
    previewGradient: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #fdba74 100%)",
    swatches: ["#ea580c", "#f97316", "#fdba74", "#0a0402", "#fff7ed"],
    primaryColor: "#ea580c",
    primaryHover: "#c2410c",
    secondaryColor: "#f97316",
    secondaryHover: "#ea580c",
    accentColor: "#fdba74",
    backgroundColor: "#0a0402",
    cardBackground: "rgba(26, 11, 5, 0.8)",
    cardBorderColor: "rgba(234, 88, 12, 0.26)",
    textColor: "#ffffff",
    textMutedColor: "#e6b092",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(10, 4, 2, 0.9)",
    footerBackground: "#050201",
    heroGradient: "linear-gradient(135deg, rgba(234, 88, 12, 0.3) 0%, rgba(249, 115, 22, 0.15) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(249, 115, 22, 0.4) 0%, rgba(194, 65, 12, 0.1) 100%)",
    glowIntensity: "high",
    glowColor: "rgba(234, 88, 12, 0.55)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 16. Sunset
  {
    id: "sunset",
    name: "Sunset",
    category: "Red & Orange",
    description: "Golden hour twilight fusing warm solar orange into radiant magenta and violet.",
    previewGradient: "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)",
    swatches: ["#f97316", "#ec4899", "#8b5cf6", "#08040a", "#fef08a"],
    primaryColor: "#f97316",
    primaryHover: "#ea580c",
    secondaryColor: "#ec4899",
    secondaryHover: "#db2777",
    accentColor: "#fef08a",
    backgroundColor: "#08040a",
    cardBackground: "rgba(22, 10, 26, 0.8)",
    cardBorderColor: "rgba(236, 72, 153, 0.24)",
    textColor: "#ffffff",
    textMutedColor: "#d39fc7",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(8, 4, 10, 0.9)",
    footerBackground: "#040205",
    heroGradient: "linear-gradient(135deg, rgba(249, 115, 22, 0.28) 0%, rgba(236, 72, 153, 0.2) 50%, rgba(139, 92, 246, 0.1) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.35) 0%, rgba(249, 115, 22, 0.15) 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(236, 72, 153, 0.5)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 17. Pink Neon
  {
    id: "pink-neon",
    name: "Pink Neon",
    category: "Pink",
    description: "Electrifying synthwave pink neon with punchy magenta brilliance.",
    previewGradient: "linear-gradient(135deg, #db2777 0%, #ec4899 50%, #f472b6 100%)",
    swatches: ["#ec4899", "#f472b6", "#fbcfe8", "#0b0207", "#ffffff"],
    primaryColor: "#ec4899",
    primaryHover: "#db2777",
    secondaryColor: "#f472b6",
    secondaryHover: "#ec4899",
    accentColor: "#fbcfe8",
    backgroundColor: "#0b0207",
    cardBackground: "rgba(26, 6, 18, 0.82)",
    cardBorderColor: "rgba(236, 72, 153, 0.28)",
    textColor: "#ffffff",
    textMutedColor: "#e69ebf",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #db2777 0%, #ec4899 50%, #f472b6 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(11, 2, 7, 0.9)",
    footerBackground: "#050103",
    heroGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.32) 0%, rgba(244, 114, 182, 0.15) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(244, 114, 182, 0.4) 0%, rgba(219, 39, 119, 0.1) 100%)",
    glowIntensity: "high",
    glowColor: "rgba(236, 72, 153, 0.6)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 18. Rose Gold
  {
    id: "rose-gold",
    name: "Rose Gold",
    category: "Pink",
    description: "Refined luxury rose gold metallic sheen with subtle blush and champagne undertones.",
    previewGradient: "linear-gradient(135deg, #be185d 0%, #fb7185 50%, #fecdd3 100%)",
    swatches: ["#fb7185", "#fda4af", "#fed7aa", "#090406", "#ffffff"],
    primaryColor: "#fb7185",
    primaryHover: "#f43f5e",
    secondaryColor: "#fda4af",
    secondaryHover: "#fb7185",
    accentColor: "#fed7aa",
    backgroundColor: "#090406",
    cardBackground: "rgba(24, 10, 16, 0.78)",
    cardBorderColor: "rgba(251, 113, 133, 0.24)",
    textColor: "#ffffff",
    textMutedColor: "#d5aab4",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #be185d 0%, #fb7185 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(9, 4, 6, 0.88)",
    footerBackground: "#040203",
    heroGradient: "linear-gradient(135deg, rgba(251, 113, 133, 0.24) 0%, rgba(254, 215, 170, 0.12) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(251, 113, 133, 0.35) 0%, transparent 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(251, 113, 133, 0.42)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 19. Magenta Glow
  {
    id: "magenta-glow",
    name: "Magenta Glow",
    category: "Pink",
    description: "Deep cosmic magenta and vivid fuchsia with glowing night-city luminescence.",
    previewGradient: "linear-gradient(135deg, #a21caf 0%, #d946ef 50%, #f0abfc 100%)",
    swatches: ["#d946ef", "#e879f9", "#f0abfc", "#080209", "#ffffff"],
    primaryColor: "#d946ef",
    primaryHover: "#c026d3",
    secondaryColor: "#e879f9",
    secondaryHover: "#d946ef",
    accentColor: "#f0abfc",
    backgroundColor: "#080209",
    cardBackground: "rgba(22, 6, 25, 0.8)",
    cardBorderColor: "rgba(217, 70, 239, 0.25)",
    textColor: "#ffffff",
    textMutedColor: "#d598e0",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #a21caf 0%, #d946ef 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(8, 2, 9, 0.9)",
    footerBackground: "#040105",
    heroGradient: "linear-gradient(135deg, rgba(217, 70, 239, 0.28) 0%, rgba(232, 121, 249, 0.14) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(232, 121, 249, 0.35) 0%, transparent 100%)",
    glowIntensity: "high",
    glowColor: "rgba(217, 70, 239, 0.55)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 20. Cyberpunk
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    category: "Multicolor",
    description: "Dystopian high-contrast electric yellow, hot pink, and neon cyan against pitch obsidian.",
    previewGradient: "linear-gradient(135deg, #facc15 0%, #ec4899 50%, #06b6d4 100%)",
    swatches: ["#facc15", "#ec4899", "#06b6d4", "#050508", "#ffffff"],
    isFeatured: true,
    primaryColor: "#facc15",
    primaryHover: "#eab308",
    secondaryColor: "#ec4899",
    secondaryHover: "#db2777",
    accentColor: "#06b6d4",
    backgroundColor: "#050508",
    cardBackground: "rgba(16, 16, 24, 0.85)",
    cardBorderColor: "rgba(250, 204, 21, 0.3)",
    textColor: "#ffffff",
    textMutedColor: "#d4d4d8",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #facc15 0%, #ec4899 100%)",
    buttonText: "#000000",
    navBackground: "rgba(5, 5, 8, 0.92)",
    footerBackground: "#020204",
    heroGradient: "linear-gradient(135deg, rgba(250, 204, 21, 0.25) 0%, rgba(236, 72, 153, 0.18) 50%, rgba(6, 182, 212, 0.12) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(250, 204, 21, 0.4) 0%, rgba(6, 182, 212, 0.2) 100%)",
    glowIntensity: "high",
    glowColor: "rgba(250, 204, 21, 0.55)",
    glassBlur: 16,
    borderRadius: "0.75rem",
  },

  // 21. Dark Silver
  {
    id: "dark-silver",
    name: "Dark Silver",
    category: "Dark",
    description: "Industrial brushed titanium, dark slate, and polished platinum accents.",
    previewGradient: "linear-gradient(135deg, #475569 0%, #94a3b8 50%, #e2e8f0 100%)",
    swatches: ["#94a3b8", "#cbd5e1", "#e2e8f0", "#09090b", "#ffffff"],
    primaryColor: "#94a3b8",
    primaryHover: "#64748b",
    secondaryColor: "#cbd5e1",
    secondaryHover: "#94a3b8",
    accentColor: "#e2e8f0",
    backgroundColor: "#09090b",
    cardBackground: "rgba(20, 20, 24, 0.8)",
    cardBorderColor: "rgba(148, 163, 184, 0.22)",
    textColor: "#ffffff",
    textMutedColor: "#a1a1aa",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #475569 0%, #94a3b8 50%, #cbd5e1 100%)",
    buttonText: "#09090b",
    navBackground: "rgba(9, 9, 11, 0.9)",
    footerBackground: "#050506",
    heroGradient: "linear-gradient(135deg, rgba(148, 163, 184, 0.2) 0%, rgba(203, 213, 225, 0.1) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(203, 213, 225, 0.3) 0%, transparent 100%)",
    glowIntensity: "subtle",
    glowColor: "rgba(148, 163, 184, 0.35)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 22. Arctic Ice
  {
    id: "arctic-ice",
    name: "Arctic Ice",
    category: "Blue",
    description: "Crystalline glacier frost, pale polar blue, and cold white diamond sheen.",
    previewGradient: "linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #e0f2fe 100%)",
    swatches: ["#38bdf8", "#7dd3fc", "#e0f2fe", "#030a12", "#ffffff"],
    primaryColor: "#38bdf8",
    primaryHover: "#0284c7",
    secondaryColor: "#7dd3fc",
    secondaryHover: "#38bdf8",
    accentColor: "#e0f2fe",
    backgroundColor: "#030a12",
    cardBackground: "rgba(8, 22, 38, 0.75)",
    cardBorderColor: "rgba(56, 189, 248, 0.24)",
    textColor: "#ffffff",
    textMutedColor: "#bae6fd",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
    buttonText: "#030a12",
    navBackground: "rgba(3, 10, 18, 0.88)",
    footerBackground: "#01050a",
    heroGradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.28) 0%, rgba(224, 242, 254, 0.12) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(125, 211, 252, 0.35) 0%, transparent 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(56, 189, 248, 0.5)",
    glassBlur: 18,
    borderRadius: "1.25rem",
  },

  // 23. Deep Ocean
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    category: "Blue",
    description: "Abyssal Mariana Trench depths with bioluminescent teal and cyan flares.",
    previewGradient: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #2dd4bf 100%)",
    swatches: ["#0d9488", "#14b8a6", "#2dd4bf", "#01090d", "#ccfbf1"],
    primaryColor: "#0d9488",
    primaryHover: "#0f766e",
    secondaryColor: "#14b8a6",
    secondaryHover: "#0d9488",
    accentColor: "#2dd4bf",
    backgroundColor: "#01090d",
    cardBackground: "rgba(4, 24, 29, 0.8)",
    cardBorderColor: "rgba(20, 184, 166, 0.22)",
    textColor: "#ffffff",
    textMutedColor: "#99f6e4",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(1, 9, 13, 0.9)",
    footerBackground: "#010507",
    heroGradient: "linear-gradient(135deg, rgba(13, 148, 136, 0.26) 0%, rgba(45, 212, 191, 0.12) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(45, 212, 191, 0.3) 0%, transparent 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(13, 148, 136, 0.45)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 24. Aurora
  {
    id: "aurora",
    name: "Aurora",
    category: "Multicolor",
    description: "Boreal magnetic lights sweeping from emerald green to cosmic violet across dark skies.",
    previewGradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)",
    swatches: ["#10b981", "#06b6d4", "#8b5cf6", "#03080c", "#ffffff"],
    isFeatured: true,
    primaryColor: "#10b981",
    primaryHover: "#059669",
    secondaryColor: "#8b5cf6",
    secondaryHover: "#7c3aed",
    accentColor: "#06b6d4",
    backgroundColor: "#03080c",
    cardBackground: "rgba(6, 20, 26, 0.82)",
    cardBorderColor: "rgba(16, 185, 129, 0.24)",
    textColor: "#ffffff",
    textMutedColor: "#a7f3d0",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(3, 8, 12, 0.9)",
    footerBackground: "#010406",
    heroGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.26) 0%, rgba(6, 182, 212, 0.16) 50%, rgba(139, 92, 246, 0.12) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.35) 0%, rgba(139, 92, 246, 0.2) 100%)",
    glowIntensity: "high",
    glowColor: "rgba(16, 185, 129, 0.5)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 25. Galaxy
  {
    id: "galaxy",
    name: "Galaxy",
    category: "Multicolor",
    description: "Deep space interstellar nebula with cosmic indigo, violet clouds, and starry lilac.",
    previewGradient: "linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #c084fc 100%)",
    swatches: ["#7c3aed", "#4338ca", "#c084fc", "#04020a", "#e0e7ff"],
    primaryColor: "#7c3aed",
    primaryHover: "#6d28d9",
    secondaryColor: "#4338ca",
    secondaryHover: "#3730a3",
    accentColor: "#c084fc",
    backgroundColor: "#04020a",
    cardBackground: "rgba(14, 8, 32, 0.85)",
    cardBorderColor: "rgba(124, 58, 237, 0.25)",
    textColor: "#ffffff",
    textMutedColor: "#c7d2fe",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(4, 2, 10, 0.9)",
    footerBackground: "#020106",
    heroGradient: "linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(67, 56, 202, 0.18) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(192, 132, 252, 0.35) 0%, transparent 100%)",
    glowIntensity: "high",
    glowColor: "rgba(124, 58, 237, 0.55)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 26. Midnight Black
  {
    id: "midnight-black",
    name: "Midnight Black",
    category: "Dark",
    description: "Pure stealth minimal darkness with razor-sharp neutral gray contours.",
    previewGradient: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #52525b 100%)",
    swatches: ["#3f3f46", "#71717a", "#a1a1aa", "#000000", "#fafafa"],
    primaryColor: "#71717a",
    primaryHover: "#52525b",
    secondaryColor: "#a1a1aa",
    secondaryHover: "#71717a",
    accentColor: "#e4e4e7",
    backgroundColor: "#000000",
    cardBackground: "rgba(18, 18, 20, 0.85)",
    cardBorderColor: "rgba(255, 255, 255, 0.12)",
    textColor: "#fafafa",
    textMutedColor: "#a1a1aa",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #27272a 0%, #3f3f46 50%, #52525b 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(0, 0, 0, 0.92)",
    footerBackground: "#000000",
    heroGradient: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%)",
    borderGradient: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%)",
    glowIntensity: "subtle",
    glowColor: "rgba(113, 113, 122, 0.3)",
    glassBlur: 14,
    borderRadius: "0.75rem",
  },

  // 27. Minimal Monochrome
  {
    id: "minimal-monochrome",
    name: "Minimal Monochrome",
    category: "Dark",
    description: "High-fashion stark black & white with editorial elegance and timeless typography.",
    previewGradient: "linear-gradient(135deg, #000000 0%, #52525b 50%, #ffffff 100%)",
    swatches: ["#ffffff", "#d4d4d8", "#a1a1aa", "#080808", "#ffffff"],
    primaryColor: "#ffffff",
    primaryHover: "#e4e4e7",
    secondaryColor: "#a1a1aa",
    secondaryHover: "#71717a",
    accentColor: "#d4d4d8",
    backgroundColor: "#080808",
    cardBackground: "rgba(18, 18, 18, 0.8)",
    cardBorderColor: "rgba(255, 255, 255, 0.15)",
    textColor: "#ffffff",
    textMutedColor: "#a1a1aa",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #ffffff 0%, #e4e4e7 100%)",
    buttonText: "#000000",
    navBackground: "rgba(8, 8, 8, 0.9)",
    footerBackground: "#040404",
    heroGradient: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%)",
    borderGradient: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, transparent 100%)",
    glowIntensity: "subtle",
    glowColor: "rgba(255, 255, 255, 0.2)",
    glassBlur: 16,
    borderRadius: "0.5rem",
  },

  // 28. White and Silver
  {
    id: "white-and-silver",
    name: "White and Silver",
    category: "Light",
    description: "Modern frosted silver slate with luminous platinum glow and bright crystal clarity.",
    previewGradient: "linear-gradient(135deg, #64748b 0%, #cbd5e1 50%, #f8fafc 100%)",
    swatches: ["#cbd5e1", "#e2e8f0", "#f8fafc", "#0b0e14", "#ffffff"],
    primaryColor: "#cbd5e1",
    primaryHover: "#94a3b8",
    secondaryColor: "#e2e8f0",
    secondaryHover: "#cbd5e1",
    accentColor: "#f8fafc",
    backgroundColor: "#0b0e14",
    cardBackground: "rgba(24, 30, 42, 0.75)",
    cardBorderColor: "rgba(203, 213, 225, 0.22)",
    textColor: "#ffffff",
    textMutedColor: "#94a3b8",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #cbd5e1 0%, #f8fafc 100%)",
    buttonText: "#0b0e14",
    navBackground: "rgba(11, 14, 20, 0.9)",
    footerBackground: "#07090d",
    heroGradient: "linear-gradient(135deg, rgba(203, 213, 225, 0.2) 0%, transparent 100%)",
    borderGradient: "linear-gradient(135deg, rgba(226, 232, 240, 0.35) 0%, transparent 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(203, 213, 225, 0.4)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 29. Desert Sand
  {
    id: "desert-sand",
    name: "Desert Sand",
    category: "Luxury",
    description: "Warm Saharan dunes, golden topaz, and rich terracotta sunset tones.",
    previewGradient: "linear-gradient(135deg, #b45309 0%, #d97706 50%, #fde68a 100%)",
    swatches: ["#d97706", "#f59e0b", "#fde68a", "#0b0704", "#ffffff"],
    primaryColor: "#d97706",
    primaryHover: "#b45309",
    secondaryColor: "#f59e0b",
    secondaryHover: "#d97706",
    accentColor: "#fde68a",
    backgroundColor: "#0b0704",
    cardBackground: "rgba(28, 18, 10, 0.8)",
    cardBorderColor: "rgba(217, 119, 6, 0.24)",
    textColor: "#ffffff",
    textMutedColor: "#d5b48e",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(11, 7, 4, 0.9)",
    footerBackground: "#050302",
    heroGradient: "linear-gradient(135deg, rgba(217, 119, 6, 0.25) 0%, rgba(253, 230, 138, 0.1) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(253, 230, 138, 0.3) 0%, transparent 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(217, 119, 6, 0.45)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 30. Copper
  {
    id: "copper",
    name: "Copper",
    category: "Luxury",
    description: "Burnished industrial copper, antique metallic bronze, and warm fiery rose.",
    previewGradient: "linear-gradient(135deg, #9a3412 0%, #c2410c 50%, #fed7aa 100%)",
    swatches: ["#c2410c", "#ea580c", "#fed7aa", "#0c0604", "#ffffff"],
    primaryColor: "#c2410c",
    primaryHover: "#9a3412",
    secondaryColor: "#ea580c",
    secondaryHover: "#c2410c",
    accentColor: "#fed7aa",
    backgroundColor: "#0c0604",
    cardBackground: "rgba(28, 14, 9, 0.82)",
    cardBorderColor: "rgba(194, 65, 12, 0.25)",
    textColor: "#ffffff",
    textMutedColor: "#d5a089",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #9a3412 0%, #c2410c 50%, #ea580c 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(12, 6, 4, 0.9)",
    footerBackground: "#060302",
    heroGradient: "linear-gradient(135deg, rgba(194, 65, 12, 0.26) 0%, rgba(254, 215, 170, 0.12) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(254, 215, 170, 0.35) 0%, transparent 100%)",
    glowIntensity: "medium",
    glowColor: "rgba(194, 65, 12, 0.48)",
    glassBlur: 16,
    borderRadius: "1rem",
  },

  // 31. Custom Rainbow Gradient
  {
    id: "custom-rainbow",
    name: "Custom Rainbow Gradient",
    category: "Multicolor",
    description: "Dynamic full-spectrum gradient spanning electric pink, violet, cyan, and emerald.",
    previewGradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 33%, #06b6d4 66%, #10b981 100%)",
    swatches: ["#ec4899", "#8b5cf6", "#06b6d4", "#06050b", "#10b981"],
    isFeatured: true,
    primaryColor: "#8b5cf6",
    primaryHover: "#7c3aed",
    secondaryColor: "#06b6d4",
    secondaryHover: "#0891b2",
    accentColor: "#ec4899",
    backgroundColor: "#06050b",
    cardBackground: "rgba(16, 12, 28, 0.82)",
    cardBorderColor: "rgba(139, 92, 246, 0.25)",
    textColor: "#ffffff",
    textMutedColor: "#c4b5fd",
    headingColor: "#ffffff",
    buttonBg: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)",
    buttonText: "#ffffff",
    navBackground: "rgba(6, 5, 11, 0.9)",
    footerBackground: "#030206",
    heroGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.22) 0%, rgba(139, 92, 246, 0.2) 33%, rgba(6, 182, 212, 0.15) 66%, rgba(16, 185, 129, 0.1) 100%)",
    borderGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.35) 0%, rgba(6, 182, 212, 0.3) 100%)",
    glowIntensity: "high",
    glowColor: "rgba(139, 92, 246, 0.55)",
    glassBlur: 16,
    borderRadius: "1rem",
  },
];

/**
 * Standard Theme Normalization Layer
 * Converts any theme object (built-in, custom, or legacy DB record) into a strictly valid ReadyMadeTheme.
 * Guarantees that swatches is an array of 5 valid color strings and all 23 properties are defined.
 */
export function normalizeTheme(raw: any, fallbackId = "custom"): ReadyMadeTheme {
  if (!raw || typeof raw !== "object") {
    const base = READY_MADE_THEMES[0];
    return {
      ...base,
      id: fallbackId,
      name: "Custom Theme",
    };
  }

  const id = String(raw.id || fallbackId).trim();
  const name = String(raw.name || "Custom Palette").trim();
  
  const validCategories = [
    "Purple",
    "Blue",
    "Green",
    "Red & Orange",
    "Pink",
    "Luxury",
    "Dark",
    "Light",
    "Multicolor",
  ] as const;

  const category = (validCategories.includes(raw.category) ? raw.category : "Multicolor") as ReadyMadeTheme["category"];
  const description = String(raw.description || "Customized color palette for Built By Boyka.").trim();

  // Primary colors (supports legacy 'primary')
  const primaryColor = String(raw.primaryColor || raw.primary || "#7547F5").trim();
  const primaryHover = String(raw.primaryHover || raw.primaryColor || raw.primary || "#6532eb").trim();

  // Secondary colors (supports legacy 'secondary')
  const secondaryColor = String(raw.secondaryColor || raw.secondary || "#9B7BFF").trim();
  const secondaryHover = String(raw.secondaryHover || raw.secondaryColor || raw.secondary || "#8963ff").trim();

  // Accent colors (supports legacy 'accent')
  const accentColor = String(raw.accentColor || raw.accent || "#C9B9FF").trim();

  // Background colors (supports legacy 'background')
  const backgroundColor = String(raw.backgroundColor || raw.background || "#05030a").trim();
  const cardBackground = String(raw.cardBackground || "rgba(14, 9, 28, 0.75)").trim();
  const cardBorderColor = String(raw.cardBorderColor || "rgba(155, 123, 255, 0.22)").trim();
  const textColor = String(raw.textColor || "#ffffff").trim();
  const textMutedColor = String(raw.textMutedColor || "#9d8ec2").trim();
  const headingColor = String(raw.headingColor || "#ffffff").trim();

  // Gradients (supports legacy 'gradient')
  const buttonBg = String(
    raw.buttonBg || raw.gradient || `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
  ).trim();
  const previewGradient = String(
    raw.previewGradient || raw.gradient || raw.buttonBg || `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
  ).trim();
  const buttonText = String(raw.buttonText || "#ffffff").trim();
  const navBackground = String(raw.navBackground || "rgba(5, 3, 10, 0.85)").trim();
  const footerBackground = String(raw.footerBackground || backgroundColor || "#05030a").trim();

  const heroGradient = String(
    raw.heroGradient || `linear-gradient(135deg, ${primaryColor}33 0%, ${secondaryColor}22 50%, transparent 100%)`
  ).trim();
  const cardGradient = String(raw.cardGradient || "").trim();
  const borderGradient = String(
    raw.borderGradient || `linear-gradient(135deg, ${secondaryColor}44 0%, ${primaryColor}1a 100%)`
  ).trim();

  const glowIntensity = (
    ["subtle", "medium", "high"].includes(raw.glowIntensity) ? raw.glowIntensity : "medium"
  ) as "subtle" | "medium" | "high";
  const glowColor = String(raw.glowColor || raw.glow || primaryColor || "rgba(117, 71, 245, 0.45)").trim();
  const glassBlur = typeof raw.glassBlur === "number" && !isNaN(raw.glassBlur) ? raw.glassBlur : 16;
  const borderRadius = String(raw.borderRadius || "1rem").trim();
  const isFeatured = Boolean(raw.isFeatured);

  // Guarantee valid 5-swatch palette [primary, secondary, accent, bg, highlight]
  let swatches: [string, string, string, string, string];
  if (Array.isArray(raw.swatches) && raw.swatches.length >= 5 && raw.swatches.every((s: any) => typeof s === "string" && s.trim().length > 0)) {
    swatches = [
      String(raw.swatches[0]).trim(),
      String(raw.swatches[1]).trim(),
      String(raw.swatches[2]).trim(),
      String(raw.swatches[3]).trim(),
      String(raw.swatches[4]).trim(),
    ];
  } else if (Array.isArray(raw.swatches) && raw.swatches.length > 0) {
    const pool = [
      ...raw.swatches.map((s: any) => String(s || "").trim()).filter(Boolean),
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      headingColor,
    ];
    swatches = [
      pool[0] || primaryColor,
      pool[1] || secondaryColor,
      pool[2] || accentColor,
      pool[3] || backgroundColor,
      pool[4] || headingColor,
    ];
  } else {
    // Derive directly from the theme's colors
    swatches = [primaryColor, secondaryColor, accentColor, backgroundColor, headingColor];
  }

  return {
    id,
    name,
    category,
    description,
    previewGradient,
    swatches,
    isFeatured,
    primaryColor,
    primaryHover,
    secondaryColor,
    secondaryHover,
    accentColor,
    backgroundColor,
    cardBackground,
    cardBorderColor,
    textColor,
    textMutedColor,
    headingColor,
    buttonBg,
    buttonText,
    navBackground,
    footerBackground,
    heroGradient,
    cardGradient,
    borderGradient,
    glowIntensity,
    glowColor,
    glassBlur,
    borderRadius,
  };
}

/**
 * Normalizes an array of themes, filtering out invalid records and normalizing legacy items.
 */
export function normalizeThemeList(list: any[] | null | undefined): ReadyMadeTheme[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item !== null && typeof item === "object")
    .map((item, idx) => normalizeTheme(item, `custom-${idx + 1}`));
}

