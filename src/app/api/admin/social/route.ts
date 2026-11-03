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
    const links = await prisma.socialLink.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch social links" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const body = await req.json();
    const { platform, url, icon, isVisible, order } = body;

    if (!platform || !url) {
      return NextResponse.json({ error: "Platform and URL are required" }, { status: 400 });
    }

    const link = await prisma.socialLink.create({
      data: {
        platform: platform.trim(),
        url: url.trim(),
        icon: icon || platform,
        isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
        order: order !== undefined ? Number(order) : 0,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/social");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, link }, { status: 201 });
  } catch (error) {
    console.error("Create social link error:", error);
    return NextResponse.json({ error: "Failed to create social link" }, { status: 500 });
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

    const updated = await prisma.socialLink.update({
      where: { id },
      data: {
        platform: body.platform,
        url: body.url,
        icon: body.icon,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : undefined,
        order: body.order !== undefined ? Number(body.order) : undefined,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/social");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, link: updated });
  } catch (error) {
    console.error("Update social link error:", error);
    return NextResponse.json({ error: "Failed to update social link" }, { status: 500 });
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

    await prisma.socialLink.delete({ where: { id } });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/social");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Delete social link error:", error);
    return NextResponse.json({ error: "Failed to delete social link" }, { status: 500 });
  }
}
