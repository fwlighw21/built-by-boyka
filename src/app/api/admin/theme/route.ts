import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeThemeList } from "@/lib/themeLibrary";

export async function GET(req: NextRequest) {
  try {
    const theme = await prisma.themeSettings.findUnique({
      where: { id: "default" },
    });
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
    return NextResponse.json(theme || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch theme" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Sanitize and normalize any custom themes stored in customGradientsJson
    let customGradientsJson = body.customGradientsJson;
    if (customGradientsJson !== undefined && customGradientsJson !== null) {
      try {
        const parsed = typeof customGradientsJson === "string" ? JSON.parse(customGradientsJson) : customGradientsJson;
        if (Array.isArray(parsed)) {
          customGradientsJson = JSON.stringify(normalizeThemeList(parsed));
        }
      } catch {
        // ignore
      }
    }

    // Check if saving a draft or publishing
    const isDraftOnly = body._isDraft === true;

    if (isDraftOnly) {
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

    const updated = await prisma.themeSettings.upsert({
      where: { id: "default" },
      update: {
        activePreset: body.activePreset,
        primaryColor: body.primaryColor,
        primaryHover: body.primaryHover,
        secondaryColor: body.secondaryColor,
        secondaryHover: body.secondaryHover,
        accentColor: body.accentColor,
        backgroundColor: body.backgroundColor,
        cardBackground: body.cardBackground,
        cardBorderColor: body.cardBorderColor,
        textColor: body.textColor,
        textMutedColor: body.textMutedColor,
        headingColor: body.headingColor,
        buttonBg: body.buttonBg,
        buttonText: body.buttonText,
        navBackground: body.navBackground,
        footerBackground: body.footerBackground,
        heroGradient: body.heroGradient,
        cardGradient: body.cardGradient,
        borderGradient: body.borderGradient,
        glowIntensity: body.glowIntensity || "medium",
        glowColor: body.glowColor,
        sectionOverridesJson: body.sectionOverridesJson,
        draftThemeJson: null, // Clear draft when publishing
        glassBlur: body.glassBlur !== undefined ? Number(body.glassBlur) : undefined,
        borderRadius: body.borderRadius,
        customGradientsJson: customGradientsJson,
      },
      create: {
        id: "default",
        activePreset: body.activePreset || "luminous-purple",
        primaryColor: body.primaryColor || "#7547F5",
        secondaryColor: body.secondaryColor || "#9B7BFF",
        accentColor: body.accentColor || "#C9B9FF",
        backgroundColor: body.backgroundColor || "#05030a",
        cardBackground: body.cardBackground || "rgba(14, 9, 28, 0.75)",
        cardBorderColor: body.cardBorderColor || "rgba(155, 123, 255, 0.2)",
        textColor: body.textColor || "#ffffff",
        textMutedColor: body.textMutedColor || "#9d8ec2",
        headingColor: body.headingColor || "#ffffff",
        buttonBg: body.buttonBg || "linear-gradient(135deg, #5424D8 0%, #7547F5 50%, #9B7BFF 100%)",
        heroGradient: body.heroGradient || "linear-gradient(135deg, rgba(84, 36, 216, 0.25) 0%, rgba(117, 71, 245, 0.18) 50%, transparent 100%)",
        borderGradient: body.borderGradient || "linear-gradient(135deg, rgba(155, 123, 255, 0.3) 0%, rgba(117, 71, 245, 0.1) 100%)",
        glowIntensity: body.glowIntensity || "medium",
        glowColor: body.glowColor || "rgba(117, 71, 245, 0.45)",
        sectionOverridesJson: body.sectionOverridesJson,
        customGradientsJson: customGradientsJson,
      },
    });

    return NextResponse.json({ success: true, theme: updated });
  } catch (error) {
    console.error("Save theme error:", error);
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
  }
}
