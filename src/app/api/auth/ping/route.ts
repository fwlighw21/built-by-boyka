import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, getSessionRemainingSeconds } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession(req);
  if (!session) {
    return NextResponse.json(
      { authenticated: false, error: "Session expired due to inactivity", reason: "expired" },
      { status: 401 }
    );
  }

  const remainingSeconds = getSessionRemainingSeconds(session.sessionId);

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.id,
      username: session.username,
    },
    lastActivity: session.lastActivity,
    remainingSeconds,
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
