import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, comparePassword, hashPassword, signAdminToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newUsername, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json({ error: "Current password is required to make security changes" }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: session.id },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    const isMatch = await comparePassword(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }

    const updates: { username?: string; passwordHash?: string } = {};

    if (newUsername && newUsername.trim() !== admin.username) {
      // Check if username already taken
      const existing = await prisma.adminUser.findUnique({
        where: { username: newUsername.trim() },
      });
      if (existing && existing.id !== admin.id) {
        return NextResponse.json({ error: "This username is already in use" }, { status: 400 });
      }
      updates.username = newUsername.trim();
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 });
      }
      updates.passwordHash = await hashPassword(newPassword);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: "No changes provided" });
    }

    const updatedAdmin = await prisma.adminUser.update({
      where: { id: admin.id },
      data: updates,
    });

    const response = NextResponse.json({
      success: true,
      message: "Credentials updated successfully",
      username: updatedAdmin.username,
    });

    // Re-issue updated token if username changed
    const newToken = signAdminToken({ id: updatedAdmin.id, username: updatedAdmin.username });
    response.cookies.set(SESSION_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Update credentials error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
