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
    const packages = await prisma.coachingPackage.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const body = await req.json();
    const { name, slug, badge, shortDescription, fullDescription, price, originalPrice, currency, billingPeriod, duration, sessionsCount, featuresJson, benefitsJson, isFeatured, isPublished, ctaText, order } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const cleanSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");

    const pkg = await prisma.coachingPackage.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        badge: badge || null,
        shortDescription: shortDescription || "",
        fullDescription: fullDescription || null,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        currency: currency || "EGP",
        billingPeriod: billingPeriod || "month",
        duration: duration || "Monthly",
        sessionsCount: sessionsCount || null,
        featuresJson: featuresJson || "[]",
        benefitsJson: benefitsJson || null,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        ctaText: ctaText || "Join VIP Program",
        order: order !== undefined ? Number(order) : 0,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/packages");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, package: pkg }, { status: 201 });
  } catch (error) {
    console.error("Create package error:", error);
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "Package ID is required" }, { status: 400 });

    const updated = await prisma.coachingPackage.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        badge: body.badge,
        shortDescription: body.shortDescription,
        fullDescription: body.fullDescription,
        price: body.price !== undefined ? Number(body.price) : undefined,
        originalPrice: body.originalPrice !== undefined ? (body.originalPrice ? Number(body.originalPrice) : null) : undefined,
        currency: body.currency,
        billingPeriod: body.billingPeriod,
        duration: body.duration,
        sessionsCount: body.sessionsCount,
        featuresJson: body.featuresJson,
        benefitsJson: body.benefitsJson,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        ctaText: body.ctaText,
        order: body.order !== undefined ? Number(body.order) : undefined,
      },
    });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/packages");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, package: updated });
  } catch (error) {
    console.error("Update package error:", error);
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDatabaseSynced();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Package ID required" }, { status: 400 });

    await prisma.coachingPackage.delete({ where: { id } });

    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/packages");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, message: "Package deleted" });
  } catch (error) {
    console.error("Delete package error:", error);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
