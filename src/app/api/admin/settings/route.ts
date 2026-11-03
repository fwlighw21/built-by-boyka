import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDatabaseSynced, persistDatabaseToBlob } from "@/lib/syncDb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseSynced();
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
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

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        brandName: body.brandName,
        siteTitle: body.siteTitle,
        tagline: body.tagline,
        logoUrl: body.logoUrl,
        logoText: body.logoText,
        faviconUrl: body.faviconUrl,
        bioShort: body.bioShort,
        whatsappLocal: body.whatsappLocal,
        whatsappInternational: body.whatsappInternational,
        whatsappDefaultMessage: body.whatsappDefaultMessage,
        whatsappPackageTemplate: body.whatsappPackageTemplate,
        whatsappServiceTemplate: body.whatsappServiceTemplate,
        whatsappFloatingEnabled: body.whatsappFloatingEnabled !== undefined ? Boolean(body.whatsappFloatingEnabled) : true,
        whatsappFloatingPosition: body.whatsappFloatingPosition || "bottom-right",
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        location: body.location,
        workingHours: body.workingHours,
      },
      create: {
        id: "default",
        brandName: body.brandName || "Built By Boyka",
        siteTitle: body.siteTitle || "Built By Boyka | Premium Coaching",
        tagline: body.tagline || "Forge Your Physique. Master Your Discipline.",
        logoUrl: body.logoUrl,
        logoText: body.logoText || "BUILT BY BOYKA",
        faviconUrl: body.faviconUrl,
        whatsappLocal: body.whatsappLocal || "01140108262",
        whatsappInternational: body.whatsappInternational || "+201140108262",
        whatsappDefaultMessage: body.whatsappDefaultMessage || "Hello Built By Boyka, I would like to know more about your coaching services.",
        whatsappPackageTemplate: body.whatsappPackageTemplate || "Hello Built By Boyka, I'm interested in the [Package Name] package. Please send me more details.",
        whatsappServiceTemplate: body.whatsappServiceTemplate || "Hello Built By Boyka, I'm interested in [Service Name]. Could you provide more information?",
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/settings");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Save settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
