import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const page = await prisma.customPage.findUnique({ where: { id } });
      if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
      return NextResponse.json(page);
    }

    const pages = await prisma.customPage.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, slug, seoTitle, metaDescription, ogImage, isPublished, showInNav, blocksJson } = body;

    if (!title) {
      return NextResponse.json({ error: "Page title is required" }, { status: 400 });
    }

    const cleanSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");

    const page = await prisma.customPage.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        seoTitle: seoTitle || null,
        metaDescription: metaDescription || null,
        ogImage: ogImage || null,
        isPublished: Boolean(isPublished),
        showInNav: Boolean(showInNav),
        blocksJson: blocksJson || "[]",
      },
    });

    return NextResponse.json({ success: true, page }, { status: 201 });
  } catch (error) {
    console.error("Create page error:", error);
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "Page ID is required" }, { status: 400 });

    const updated = await prisma.customPage.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        seoTitle: body.seoTitle,
        metaDescription: body.metaDescription,
        ogImage: body.ogImage,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        showInNav: body.showInNav !== undefined ? Boolean(body.showInNav) : undefined,
        blocksJson: body.blocksJson,
      },
    });

    return NextResponse.json({ success: true, page: updated });
  } catch (error) {
    console.error("Update page error:", error);
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Page ID required" }, { status: 400 });

    await prisma.customPage.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Page deleted" });
  } catch (error) {
    console.error("Delete page error:", error);
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
