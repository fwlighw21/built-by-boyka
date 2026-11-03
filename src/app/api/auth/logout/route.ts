import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifyAdminToken, destroyAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    const payload = verifyAdminToken(token);
    if (payload?.sessionId) {
      destroyAdminSession(payload.sessionId);
    }
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
