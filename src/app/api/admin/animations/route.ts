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
    const animations = await prisma.animationSettings.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json(animations || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch animation settings" }, { status: 500 });
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

    const updated = await prisma.animationSettings.upsert({
      where: { id: "default" },
      update: {
        animationsEnabled: Boolean(body.animationsEnabled),
        reducedMotion: Boolean(body.reducedMotion),
        orbCount: Number(body.orbCount) || 3,
        animationSpeed: body.animationSpeed || "normal",
        animationIntensity: body.animationIntensity || "medium",
        blurAmount: Number(body.blurAmount) || 90,
        backgroundEffect: body.backgroundEffect || "floating-orbs",
        entranceAnimation: body.entranceAnimation || "fade-up",
        hoverEffects: Boolean(body.hoverEffects),
      },
      create: {
        id: "default",
        animationsEnabled: body.animationsEnabled !== undefined ? Boolean(body.animationsEnabled) : true,
        reducedMotion: Boolean(body.reducedMotion),
        orbCount: Number(body.orbCount) || 3,
        animationSpeed: body.animationSpeed || "normal",
        animationIntensity: body.animationIntensity || "medium",
        blurAmount: Number(body.blurAmount) || 90,
        backgroundEffect: body.backgroundEffect || "floating-orbs",
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/animations");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, animations: updated });
  } catch (error) {
    console.error("Save animations error:", error);
    return NextResponse.json({ error: "Failed to update animations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
