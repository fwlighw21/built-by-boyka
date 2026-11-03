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
    const items = await prisma.clientTransformation.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transformations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const body = await req.json();
    const { clientName, category, beforeImage, afterImage, durationWeeks, weightLossKg, muscleGainKg, description, clientQuote, isFeatured, hasConsent, isPublished, order } = body;

    if (!clientName || !beforeImage || !afterImage) {
      return NextResponse.json({ error: "Client name, before image, and after image are required" }, { status: 400 });
    }

    const item = await prisma.clientTransformation.create({
      data: {
        clientName: clientName.trim(),
        category: category || "Fat Loss",
        beforeImage,
        afterImage,
        durationWeeks: durationWeeks ? Number(durationWeeks) : null,
        weightLossKg: weightLossKg ? Number(weightLossKg) : null,
        muscleGainKg: muscleGainKg ? Number(muscleGainKg) : null,
        description: description || null,
        clientQuote: clientQuote || null,
        isFeatured: Boolean(isFeatured),
        hasConsent: hasConsent !== undefined ? Boolean(hasConsent) : true,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        order: order !== undefined ? Number(order) : 0,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/transformations");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, transformation: item }, { status: 201 });
  } catch (error) {
    console.error("Create transformation error:", error);
    return NextResponse.json({ error: "Failed to create transformation" }, { status: 500 });
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

    const updated = await prisma.clientTransformation.update({
      where: { id },
      data: {
        clientName: body.clientName,
        category: body.category,
        beforeImage: body.beforeImage,
        afterImage: body.afterImage,
        durationWeeks: body.durationWeeks !== undefined ? (body.durationWeeks ? Number(body.durationWeeks) : null) : undefined,
        weightLossKg: body.weightLossKg !== undefined ? (body.weightLossKg ? Number(body.weightLossKg) : null) : undefined,
        muscleGainKg: body.muscleGainKg !== undefined ? (body.muscleGainKg ? Number(body.muscleGainKg) : null) : undefined,
        description: body.description,
        clientQuote: body.clientQuote,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        hasConsent: body.hasConsent !== undefined ? Boolean(body.hasConsent) : undefined,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        order: body.order !== undefined ? Number(body.order) : undefined,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/transformations");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, transformation: updated });
  } catch (error) {
    console.error("Update transformation error:", error);
    return NextResponse.json({ error: "Failed to update transformation" }, { status: 500 });
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

    await prisma.clientTransformation.delete({ where: { id } });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/transformations");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Delete transformation error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
