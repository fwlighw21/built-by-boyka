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
    const services = await prisma.coachingService.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const body = await req.json();
    const { name, slug, badge, shortDescription, fullDescription, coverImage, featuresJson, duration, price, currency, ctaText, isPublished, isFeatured, order } = body;

    if (!name || !shortDescription) {
      return NextResponse.json({ error: "Name and short description are required" }, { status: 400 });
    }

    const cleanSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");

    const service = await prisma.coachingService.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        badge: badge || null,
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription || null,
        coverImage: coverImage || null,
        featuresJson: featuresJson || "[]",
        duration: duration || null,
        price: price ? Number(price) : null,
        currency: currency || "EGP",
        ctaText: ctaText || "Inquire on WhatsApp",
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        isFeatured: Boolean(isFeatured),
        order: order !== undefined ? Number(order) : 0,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/services");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "Service ID is required" }, { status: 400 });

    const updated = await prisma.coachingService.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        badge: body.badge,
        shortDescription: body.shortDescription,
        fullDescription: body.fullDescription,
        coverImage: body.coverImage,
        featuresJson: body.featuresJson,
        duration: body.duration,
        price: body.price !== undefined ? (body.price ? Number(body.price) : null) : undefined,
        currency: body.currency,
        ctaText: body.ctaText,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        order: body.order !== undefined ? Number(body.order) : undefined,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/services");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Service ID required" }, { status: 400 });

    await prisma.coachingService.delete({ where: { id } });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/services");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, message: "Service deleted" });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
