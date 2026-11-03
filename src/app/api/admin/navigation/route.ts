import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.navigationItem.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch navigation items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { label, url, isExternal, order, isVisible } = body;

    if (!label || !url) {
      return NextResponse.json({ error: "Label and URL are required" }, { status: 400 });
    }

    const count = await prisma.navigationItem.count();

    const item = await prisma.navigationItem.create({
      data: {
        label: label.trim(),
        url: url.trim(),
        isExternal: Boolean(isExternal),
        order: order !== undefined ? Number(order) : count,
        isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("Create nav item error:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // Check if bulk reorder
    if (Array.isArray(body.items)) {
      for (let i = 0; i < body.items.length; i++) {
        const it = body.items[i];
        if (it.id) {
          await prisma.navigationItem.update({
            where: { id: it.id },
            data: { order: i },
          });
        }
      }
      return NextResponse.json({ success: true, message: "Reordered successfully" });
    }

    // Single item update
    const { id, label, url, isExternal, order, isVisible } = body;
    if (!id) return NextResponse.json({ error: "Item ID required" }, { status: 400 });

    const updated = await prisma.navigationItem.update({
      where: { id },
      data: {
        label: label !== undefined ? label.trim() : undefined,
        url: url !== undefined ? url.trim() : undefined,
        isExternal: isExternal !== undefined ? Boolean(isExternal) : undefined,
        order: order !== undefined ? Number(order) : undefined,
        isVisible: isVisible !== undefined ? Boolean(isVisible) : undefined,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Update nav item error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Item ID required" }, { status: 400 });

    await prisma.navigationItem.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Item deleted" });
  } catch (error) {
    console.error("Delete nav item error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
