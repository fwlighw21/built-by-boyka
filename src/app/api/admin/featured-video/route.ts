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
    const video = await prisma.featuredVideoSettings.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json(video || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch featured video settings" }, { status: 500 });
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

    const updated = await prisma.featuredVideoSettings.upsert({
      where: { id: "default" },
      update: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        videoType: body.videoType || "youtube",
        videoUrl: body.videoUrl,
        thumbnailUrl: body.thumbnailUrl,
        ctaLabel: body.ctaLabel,
        ctaUrl: body.ctaUrl,
        showHeadline: body.showHeadline !== undefined ? Boolean(body.showHeadline) : true,
        showDescription: body.showDescription !== undefined ? Boolean(body.showDescription) : true,
        showCta: body.showCta !== undefined ? Boolean(body.showCta) : true,
        playMode: body.playMode || "inline",
        autoplay: body.autoplay !== undefined ? Boolean(body.autoplay) : false,
        videoWidth: body.videoWidth || "max-w-5xl",
        maxHeight: body.maxHeight || "aspect-video",
        backgroundGradient: body.backgroundGradient,
        order: body.order !== undefined ? Number(body.order) : 1,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : true,
      },
      create: {
        id: "default",
        title: body.title || "THE BUILT BY BOYKA METHOD",
        subtitle: body.subtitle,
        description: body.description,
        videoType: body.videoType || "youtube",
        videoUrl: body.videoUrl || "https://www.youtube.com/watch?v=4Y2ZdHCOXok",
        thumbnailUrl: body.thumbnailUrl,
        ctaLabel: body.ctaLabel || "Claim Your Free VIP Assessment",
        ctaUrl: body.ctaUrl || "https://wa.me/201140108262",
        showHeadline: body.showHeadline !== undefined ? Boolean(body.showHeadline) : true,
        showDescription: body.showDescription !== undefined ? Boolean(body.showDescription) : true,
        showCta: body.showCta !== undefined ? Boolean(body.showCta) : true,
        playMode: body.playMode || "inline",
        autoplay: body.autoplay !== undefined ? Boolean(body.autoplay) : false,
        videoWidth: body.videoWidth || "max-w-5xl",
        maxHeight: body.maxHeight || "aspect-video",
        backgroundGradient: body.backgroundGradient,
        order: body.order !== undefined ? Number(body.order) : 1,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : true,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/featured-video");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, featuredVideo: updated });
  } catch (error) {
    console.error("Save featured video error:", error);
    return NextResponse.json({ error: "Failed to update featured video" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
