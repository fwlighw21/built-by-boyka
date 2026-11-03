import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDatabaseSynced, persistDatabaseToBlob, uploadMediaToBlob } from "@/lib/syncDb";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureDatabaseSynced();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "general";
    const altText = (formData.get("altText") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Allowed mime types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "video/mp4",
      "video/webm",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP, SVG, GIF, MP4, WebM.` },
        { status: 400 }
      );
    }

    // Max 25MB
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds maximum size limit (25MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let publicUrl: string;
    const ext = path.extname(file.name) || (file.type.includes("webp") ? ".webp" : ".jpg");
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 40);
    const uniqueFileName = `${Date.now()}-${baseName}${ext}`;

    // Upload to Vercel Blob (production / serverless / connected store)
    try {
      publicUrl = await uploadMediaToBlob(buffer, uniqueFileName, file.type);
    } catch (blobErr: any) {
      console.warn("[Upload] Blob upload fallback to local:", blobErr.message);
      // Local development fallback
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, uniqueFileName);
      await fs.writeFile(filePath, buffer);
      publicUrl = `/uploads/${uniqueFileName}`;
    }

    // Record in database
    const asset = await prisma.mediaAsset.create({
      data: {
        fileName: uniqueFileName,
        url: publicUrl,
        fileSize: file.size,
        mimeType: file.type,
        category: category,
        altText: altText || baseName,
      },
    });

    // Persist updated database
    await persistDatabaseToBlob();

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/media");
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      asset,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
