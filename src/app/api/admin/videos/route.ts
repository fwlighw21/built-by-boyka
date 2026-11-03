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
    const videos = await prisma.videoItem.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const body = await req.json();
    const { title, description, videoType, videoUrl, thumbnailUrl, category, duration, isFeatured, isPublished, order } = body;

    if (!title || !videoUrl) {
      return NextResponse.json({ error: "Title and video URL are required" }, { status: 400 });
    }

    const video = await prisma.videoItem.create({
      data: {
        title: title.trim(),
        description: description || null,
        videoType: videoType || "youtube",
        videoUrl: videoUrl.trim(),
        thumbnailUrl: thumbnailUrl || null,
        category: category || "Training",
        duration: duration || null,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        order: order !== undefined ? Number(order) : 0,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/videos");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, video }, { status: 201 });
  } catch (error) {
    console.error("Create video error:", error);
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "Video ID is required" }, { status: 400 });

    const updated = await prisma.videoItem.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        videoType: body.videoType,
        videoUrl: body.videoUrl,
        thumbnailUrl: body.thumbnailUrl,
        category: body.category,
        duration: body.duration,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        order: body.order !== undefined ? Number(body.order) : undefined,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/videos");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, video: updated });
  } catch (error) {
    console.error("Update video error:", error);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.videoItem.delete({ where: { id } });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/videos");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Delete video error:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
