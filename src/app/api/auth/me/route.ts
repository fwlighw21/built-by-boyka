import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await verifyAdminSession(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, reason: "expired" }, { status: 401 });
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.id },
    select: { id: true, username: true, name: true, email: true, lastLogin: true },
  });

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user });
}
