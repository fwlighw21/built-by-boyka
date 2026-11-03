import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

if (isServerless) {
  const tmpDbPath = path.join("/tmp", "dev.db");
  const candidateSourcePaths = [
    path.join(process.cwd(), "prisma", "dev.db"),
    path.join(process.cwd(), "dev.db"),
    path.join(__dirname, "..", "..", "prisma", "dev.db"),
    path.join(__dirname, "dev.db"),
  ];

  if (!fs.existsSync(tmpDbPath)) {
    for (const src of candidateSourcePaths) {
      if (fs.existsSync(src)) {
        try {
          fs.copyFileSync(src, tmpDbPath);
          console.log(`[Prisma] Copied SQLite database from ${src} to ${tmpDbPath}`);
          break;
        } catch (e: any) {
          console.error(`[Prisma] Failed to copy ${src} to /tmp:`, e.message);
        }
      }
    }
  }
  process.env.DATABASE_URL = `file:${tmpDbPath}`;
}

const globalForPrisma = global as unknown as { prismaInstance: PrismaClient | null };

function createClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prismaInstance) {
    globalForPrisma.prismaInstance = createClient();
  }
  return globalForPrisma.prismaInstance;
}

export function resetPrismaClient(): void {
  if (globalForPrisma.prismaInstance) {
    try {
      globalForPrisma.prismaInstance.$disconnect().catch(() => {});
    } catch {
      // ignore
    }
  }
  globalForPrisma.prismaInstance = createClient();
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient() as any;
    const value = client[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export default prisma;
