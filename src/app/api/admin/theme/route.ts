import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDatabaseSynced, persistDatabaseToBlob } from "@/lib/syncDb";
import { normalizeThemeList, READY_MADE_THEMES } from "@/lib/themeLibrary";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_THEME_FALLBACK = READY_MADE_THEMES[0] || {
  id: "luminous-purple",
  name: "Luminous Violet (Logo Identity)",
  category: "Purple",
  description: "Official Built By Boyka signature theme matching the luminous purple logo badge.",
  previewGradient: "linear-gradient(135deg, #5424D8 0%, #7547F5 50%, #9B7BFF 100%)",
  swatches: ["#7547F5", "#9B7BFF", "#C9B9FF", "#05030a", "#F0EAFF"],
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
};

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseSynced();

    let theme = await prisma.themeSettings.findUnique({
      where: { id: "default" },
    });

    if (!theme) {
      theme = await prisma.themeSettings.create({
        data: {
          id: "default",
          activePreset: DEFAULT_THEME_FALLBACK.id,
          primaryColor: DEFAULT_THEME_FALLBACK.primaryColor,
          primaryHover: DEFAULT_THEME_FALLBACK.primaryHover,
          secondaryColor: DEFAULT_THEME_FALLBACK.secondaryColor,
          secondaryHover: DEFAULT_THEME_FALLBACK.secondaryHover,
          accentColor: DEFAULT_THEME_FALLBACK.accentColor,
          backgroundColor: DEFAULT_THEME_FALLBACK.backgroundColor,
          cardBackground: DEFAULT_THEME_FALLBACK.cardBackground,
          cardBorderColor: DEFAULT_THEME_FALLBACK.cardBorderColor,
          textColor: DEFAULT_THEME_FALLBACK.textColor,
          textMutedColor: DEFAULT_THEME_FALLBACK.textMutedColor,
          headingColor: DEFAULT_THEME_FALLBACK.headingColor,
          buttonBg: DEFAULT_THEME_FALLBACK.buttonBg,
          buttonText: DEFAULT_THEME_FALLBACK.buttonText,
          navBackground: DEFAULT_THEME_FALLBACK.navBackground,
          footerBackground: DEFAULT_THEME_FALLBACK.footerBackground,
          heroGradient: DEFAULT_THEME_FALLBACK.heroGradient,
          borderGradient: DEFAULT_THEME_FALLBACK.borderGradient,
          glowIntensity: DEFAULT_THEME_FALLBACK.glowIntensity,
          glowColor: DEFAULT_THEME_FALLBACK.glowColor,
          glassBlur: DEFAULT_THEME_FALLBACK.glassBlur,
          borderRadius: DEFAULT_THEME_FALLBACK.borderRadius,
        },
      });
    }

    if (theme && theme.customGradientsJson) {
      try {
        const parsed = JSON.parse(theme.customGradientsJson);
        if (Array.isArray(parsed)) {
          theme.customGradientsJson = JSON.stringify(normalizeThemeList(parsed));
        }
      } catch {
        // ignore
      }
    }

    return NextResponse.json(theme);
  } catch (error) {
    console.error("GET theme error:", error);
    return NextResponse.json({ error: "Failed to fetch theme" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureDatabaseSynced();

    const body = await req.json();

    // Sanitize customGradientsJson
    let customGradientsJson = body.customGradientsJson;
    if (customGradientsJson !== undefined && customGradientsJson !== null) {
      try {
        const parsed = typeof customGradientsJson === "string" ? JSON.parse(customGradientsJson) : customGradientsJson;
        if (Array.isArray(parsed)) {
          customGradientsJson = JSON.stringify(normalizeThemeList(parsed));
        } else {
          customGradientsJson = JSON.stringify(parsed);
        }
      } catch {
        if (typeof customGradientsJson !== "string") {
          customGradientsJson = JSON.stringify(customGradientsJson);
        }
      }
    } else {
      customGradientsJson = null;
    }

    // Sanitize sectionOverridesJson
    let sectionOverridesJson = body.sectionOverridesJson;
    if (sectionOverridesJson !== undefined && sectionOverridesJson !== null) {
      if (typeof sectionOverridesJson !== "string") {
        try {
          sectionOverridesJson = JSON.stringify(sectionOverridesJson);
        } catch {
          sectionOverridesJson = null;
        }
      }
    } else {
      sectionOverridesJson = null;
    }

    // Draft handling
    if (body._isDraft === true) {
      const updated = await prisma.themeSettings.upsert({
        where: { id: "default" },
        update: {
          draftThemeJson: JSON.stringify(body),
        },
        create: {
          id: "default",
          draftThemeJson: JSON.stringify(body),
        },
      });
      return NextResponse.json({ success: true, isDraft: true, theme: updated });
    }

    // Parse glassBlur safely to an integer
    let glassBlur: number = 16;
    if (body.glassBlur !== undefined && body.glassBlur !== null) {
      const parsedNum = parseInt(String(body.glassBlur).replace(/[^0-9]/g, ""), 10);
      glassBlur = isNaN(parsedNum) ? 16 : parsedNum;
    }

    const updated = await prisma.themeSettings.upsert({
      where: { id: "default" },
      update: {
        activePreset: body.activePreset || "luminous-purple",
        primaryColor: body.primaryColor || "#7547F5",
        primaryHover: body.primaryHover || "#6532eb",
        secondaryColor: body.secondaryColor || "#9B7BFF",
        secondaryHover: body.secondaryHover || "#8963ff",
        accentColor: body.accentColor || "#C9B9FF",
        backgroundColor: body.backgroundColor || "#05030a",
        cardBackground: body.cardBackground || "rgba(14, 9, 28, 0.75)",
        cardBorderColor: body.cardBorderColor || "rgba(155, 123, 255, 0.22)",
        textColor: body.textColor || "#ffffff",
        textMutedColor: body.textMutedColor || "#9d8ec2",
        headingColor: body.headingColor || "#ffffff",
        buttonBg: body.buttonBg || "linear-gradient(135deg, #5424D8 0%, #7547F5 50%, #9B7BFF 100%)",
        buttonText: body.buttonText || "#ffffff",
        navBackground: body.navBackground || "rgba(5, 3, 10, 0.85)",
        footerBackground: body.footerBackground || "#05030a",
        heroGradient: body.heroGradient || "linear-gradient(135deg, rgba(84, 36, 216, 0.28) 0%, rgba(117, 71, 245, 0.18) 50%, transparent 100%)",
        cardGradient: body.cardGradient || "",
        borderGradient: body.borderGradient || "linear-gradient(135deg, rgba(155, 123, 255, 0.35) 0%, rgba(117, 71, 245, 0.1) 100%)",
        glowIntensity: body.glowIntensity || "medium",
        glowColor: body.glowColor || "rgba(117, 71, 245, 0.45)",
        sectionOverridesJson: sectionOverridesJson,
        draftThemeJson: null,
        glassBlur: glassBlur,
        borderRadius: body.borderRadius || "1rem",
        customGradientsJson: customGradientsJson,
      },
      create: {
        id: "default",
        activePreset: body.activePreset || "luminous-purple",
        primaryColor: body.primaryColor || "#7547F5",
        primaryHover: body.primaryHover || "#6532eb",
        secondaryColor: body.secondaryColor || "#9B7BFF",
        secondaryHover: body.secondaryHover || "#8963ff",
        accentColor: body.accentColor || "#C9B9FF",
        backgroundColor: body.backgroundColor || "#05030a",
        cardBackground: body.cardBackground || "rgba(14, 9, 28, 0.75)",
        cardBorderColor: body.cardBorderColor || "rgba(155, 123, 255, 0.22)",
        textColor: body.textColor || "#ffffff",
        textMutedColor: body.textMutedColor || "#9d8ec2",
        headingColor: body.headingColor || "#ffffff",
        buttonBg: body.buttonBg || "linear-gradient(135deg, #5424D8 0%, #7547F5 50%, #9B7BFF 100%)",
        buttonText: body.buttonText || "#ffffff",
        navBackground: body.navBackground || "rgba(5, 3, 10, 0.85)",
        footerBackground: body.footerBackground || "#05030a",
        heroGradient: body.heroGradient || "linear-gradient(135deg, rgba(84, 36, 216, 0.28) 0%, rgba(117, 71, 245, 0.18) 50%, transparent 100%)",
        cardGradient: body.cardGradient || "",
        borderGradient: body.borderGradient || "linear-gradient(135deg, rgba(155, 123, 255, 0.35) 0%, rgba(117, 71, 245, 0.1) 100%)",
        glowIntensity: body.glowIntensity || "medium",
        glowColor: body.glowColor || "rgba(117, 71, 245, 0.45)",
        sectionOverridesJson: sectionOverridesJson,
        glassBlur: glassBlur,
        borderRadius: body.borderRadius || "1rem",
        customGradientsJson: customGradientsJson,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/theme");
    } catch {
      // ignore
    }

    const response = NextResponse.json({ success: true, theme: updated });

    // Store active theme in a persistent cookie for edge/visitor synchronization
    response.cookies.set("boyka_theme_settings", JSON.stringify({
      activePreset: updated.activePreset,
      primaryColor: updated.primaryColor,
      primaryHover: updated.primaryHover,
      secondaryColor: updated.secondaryColor,
      secondaryHover: updated.secondaryHover,
      accentColor: updated.accentColor,
      backgroundColor: updated.backgroundColor,
      cardBackground: updated.cardBackground,
      cardBorderColor: updated.cardBorderColor,
      textColor: updated.textColor,
      textMutedColor: updated.textMutedColor,
      headingColor: updated.headingColor,
      buttonBg: updated.buttonBg,
      buttonText: updated.buttonText,
      navBackground: updated.navBackground,
      footerBackground: updated.footerBackground,
      heroGradient: updated.heroGradient,
      cardGradient: updated.cardGradient,
      borderGradient: updated.borderGradient,
      glowIntensity: updated.glowIntensity,
      glowColor: updated.glowColor,
      glassBlur: updated.glassBlur,
      borderRadius: updated.borderRadius,
    }), {
      path: "/",
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Save theme error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update theme" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
