import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const seo = await prisma.seoSettings.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json(seo || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch SEO settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const updated = await prisma.seoSettings.upsert({
      where: { id: "default" },
      update: {
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        keywords: body.keywords,
        ogImage: body.ogImage,
        twitterHandle: body.twitterHandle,
        canonicalUrl: body.canonicalUrl,
        googleAnalyticsId: body.googleAnalyticsId,
      },
      create: {
        id: "default",
        metaTitle: body.metaTitle || "Built By Boyka | Premium Coaching",
        metaDescription: body.metaDescription || "Elite online fitness coaching by Boyka.",
        keywords: body.keywords || "fitness coaching, online coach, Boyka",
      },
    });

    return NextResponse.json({ success: true, seo: updated });
  } catch (error) {
    console.error("Save SEO error:", error);
    return NextResponse.json({ error: "Failed to update SEO settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
