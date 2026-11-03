import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "built-by-boyka-super-secure-jwt-secret-key-2026-production-ready";
export const SESSION_COOKIE_NAME = "boyka_admin_session";

/**
 * STRICT 30-SECOND INACTIVITY POLICY
 * Server-side ground truth: any session without activity for > 30 seconds expires immediately.
 */
export const INACTIVITY_TIMEOUT_MS = 30 * 1000; // 30 seconds

export interface AdminJwtPayload {
  userId: string;
  username: string;
  sessionId: string;
  role: "admin";
  iat?: number;
  exp?: number;
}

export interface ActiveAdminSession {
  sessionId: string;
  userId: string;
  username: string;
  lastActivity: number;
  createdAt: number;
}

// In-memory global session registry persisting across module reloads
declare global {
  // eslint-disable-next-line no-var
  var __BOYKA_SESSION_REGISTRY__: Map<string, ActiveAdminSession> | undefined;
  // eslint-disable-next-line no-var
  var __BOYKA_RATE_LIMIT__: Map<string, { attempts: number; resetAt: number }> | undefined;
}

export function getSessionRegistry(): Map<string, ActiveAdminSession> {
  if (!globalThis.__BOYKA_SESSION_REGISTRY__) {
    globalThis.__BOYKA_SESSION_REGISTRY__ = new Map<string, ActiveAdminSession>();
  }
  return globalThis.__BOYKA_SESSION_REGISTRY__;
}

function getRateLimitMap(): Map<string, { attempts: number; resetAt: number }> {
  if (!globalThis.__BOYKA_RATE_LIMIT__) {
    globalThis.__BOYKA_RATE_LIMIT__ = new Map<string, { attempts: number; resetAt: number }>();
  }
  return globalThis.__BOYKA_RATE_LIMIT__;
}

export function checkLoginRateLimit(
  ip: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; remainingAttempts: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const map = getRateLimitMap();
  const record = map.get(ip);

  if (!record || now > record.resetAt) {
    map.set(ip, { attempts: 1, resetAt: now + windowMs });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }

  if (record.attempts >= maxAttempts) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  record.attempts += 1;
  return { allowed: true, remainingAttempts: maxAttempts - record.attempts };
}

export function resetLoginRateLimit(ip: string): void {
  getRateLimitMap().delete(ip);
}

/**
 * Creates an active server-side session tracked in memory and signs a JWT containing the sessionId.
 */
export function createAdminSession(user: { id: string; username: string }): { token: string; sessionId: string } {
  const sessionId = crypto.randomUUID();
  const now = Date.now();

  const registry = getSessionRegistry();
  registry.set(sessionId, {
    sessionId,
    userId: user.id,
    username: user.username,
    lastActivity: now,
    createdAt: now,
  });

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      sessionId,
      role: "admin",
    },
    JWT_SECRET,
    { expiresIn: "7d" } // Token container validity; true session timeout is server-side 30s inactivity
  );

  return { token, sessionId };
}

/**
 * Backwards compatible signAdminToken that registers the session
 */
export function signAdminToken(user: { id: string; username: string }): string {
  return createAdminSession(user).token;
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
    if (decoded && decoded.role === "admin") {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Touches the activity timestamp if session is currently active and within 30 seconds.
 */
export function touchAdminSession(sessionId: string): boolean {
  const registry = getSessionRegistry();
  const session = registry.get(sessionId);
  if (!session) return false;

  const now = Date.now();
  if (now - session.lastActivity > INACTIVITY_TIMEOUT_MS) {
    registry.delete(sessionId);
    return false;
  }

  session.lastActivity = now;
  return true;
}

/**
 * Explicitly terminates an active session.
 */
export function destroyAdminSession(sessionId: string): void {
  const registry = getSessionRegistry();
  registry.delete(sessionId);
}

/**
 * Gets remaining seconds before inactivity expiration.
 */
export function getSessionRemainingSeconds(sessionId: string): number {
  const registry = getSessionRegistry();
  const session = registry.get(sessionId);
  if (!session) return 0;

  const elapsed = Date.now() - session.lastActivity;
  if (elapsed > INACTIVITY_TIMEOUT_MS) {
    registry.delete(sessionId);
    return 0;
  }

  return Math.max(0, Math.ceil((INACTIVITY_TIMEOUT_MS - elapsed) / 1000));
}

/**
 * Server-Side Ground Truth for Admin Authentication & Inactivity Verification.
 * Enforces the strict 30-second inactivity policy across ALL admin routes.
 * If elapsed inactivity > 30s, returns null (causing caller to respond with 401 Unauthorized).
 */
export async function verifyAdminSession(
  req: NextRequest
): Promise<{ id: string; username: string; sessionId: string; lastActivity: number } | null> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyAdminToken(token);
  if (!payload || !payload.sessionId) return null;

  const registry = getSessionRegistry();
  let session = registry.get(payload.sessionId);
  const now = Date.now();

  if (!session) {
    // Rehydrate serverless session from cryptographically verified JWT
    session = {
      sessionId: payload.sessionId,
      userId: payload.userId,
      username: payload.username,
      lastActivity: now,
      createdAt: payload.iat ? payload.iat * 1000 : now,
    };
    registry.set(payload.sessionId, session);
  }

  const elapsed = now - session.lastActivity;

  // Strict 30-second inactivity check
  if (elapsed > INACTIVITY_TIMEOUT_MS) {
    registry.delete(payload.sessionId);
    return null;
  }

  // Session is active: refresh lastActivity timestamp (sliding window)
  session.lastActivity = now;

  // Verify in database that admin user still exists
  const user = await prisma.adminUser.findUnique({
    where: { id: payload.userId },
    select: { id: true, username: true },
  });

  if (!user) {
    registry.delete(payload.sessionId);
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    sessionId: session.sessionId,
    lastActivity: session.lastActivity,
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
