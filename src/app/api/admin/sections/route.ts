import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDatabaseSynced, persistDatabaseToBlob } from "@/lib/syncDb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await ensureDatabaseSynced();
    const sections = await prisma.sectionContent.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const body = await req.json();
    const { sectionKey } = body;

    if (!sectionKey) {
      return NextResponse.json({ error: "Section key is required" }, { status: 400 });
    }

    const updated = await prisma.sectionContent.upsert({
      where: { sectionKey },
      update: {
        title: body.title,
        subtitle: body.subtitle,
        badge: body.badge,
        body: body.body,
        primaryButtonText: body.primaryButtonText,
        primaryButtonLink: body.primaryButtonLink,
        secondaryButtonText: body.secondaryButtonText,
        secondaryButtonLink: body.secondaryButtonLink,
        imageUrl: body.imageUrl,
        secondaryImageUrl: body.secondaryImageUrl,
        videoUrl: body.videoUrl,
        statsJson: body.statsJson,
        order: body.order !== undefined ? Number(body.order) : undefined,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : undefined,
        customGradient: body.customGradient,
      },
      create: {
        sectionKey,
        title: body.title || "Section Title",
        subtitle: body.subtitle,
        badge: body.badge,
        body: body.body,
        primaryButtonText: body.primaryButtonText,
        primaryButtonLink: body.primaryButtonLink,
        imageUrl: body.imageUrl,
        statsJson: body.statsJson,
        order: body.order !== undefined ? Number(body.order) : 0,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : true,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/content");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, section: updated });
  } catch (error) {
    console.error("Save section error:", error);
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
