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
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const body = await req.json();
    const { clientName, clientTitle, avatarUrl, rating, program, content, videoUrl, isFeatured, isPublished, order } = body;

    if (!clientName || !content) {
      return NextResponse.json({ error: "Client name and review content are required" }, { status: 400 });
    }

    const t = await prisma.testimonial.create({
      data: {
        clientName: clientName.trim(),
        clientTitle: clientTitle || null,
        avatarUrl: avatarUrl || null,
        rating: rating !== undefined ? Number(rating) : 5,
        program: program || null,
        content: content.trim(),
        videoUrl: videoUrl || null,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        order: order !== undefined ? Number(order) : 0,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/testimonials");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, testimonial: t }, { status: 201 });
  } catch (error) {
    console.error("Create testimonial error:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        clientName: body.clientName,
        clientTitle: body.clientTitle,
        avatarUrl: body.avatarUrl,
        rating: body.rating !== undefined ? Number(body.rating) : undefined,
        program: body.program,
        content: body.content,
        videoUrl: body.videoUrl,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        order: body.order !== undefined ? Number(body.order) : undefined,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/testimonials");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error) {
    console.error("Update testimonial error:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
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

    await prisma.testimonial.delete({ where: { id } });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/testimonials");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
