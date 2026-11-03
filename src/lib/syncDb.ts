import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";
import { prisma } from "./prisma";

const DB_FILENAME = "dev.db";
const BLOB_PATH = "database/dev.db";
const BLOB_PUBLIC_URL = "https://vyuot0andraftfiy.public.blob.vercel-storage.com/database/dev.db";

export function getDbPath(): string {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless) {
    return path.join("/tmp", DB_FILENAME);
  }
  return path.join(process.cwd(), "prisma", DB_FILENAME);
}

// In-flight synchronization promise mutex to prevent concurrent callers from racing
let inFlightSync: Promise<void> | null = null;
let lastSyncTimestamp = 0;
const SYNC_INTERVAL_MS = 500;

/**
 * Ensures the SQLite database on this container is up-to-date with the latest
 * persistent database stored in Vercel Blob using direct HTTP HEAD cache validation.
 */
export async function ensureDatabaseSynced(): Promise<void> {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const dbPath = getDbPath();
  const dbExists = fs.existsSync(dbPath);
  const syncRecordPath = dbPath + ".synced";

  // If running locally without Vercel Blob configured, ensure local file exists
  if (!process.env.BLOB_STORE_ID && !process.env.VERCEL) {
    if (!dbExists) {
      const srcPath = path.join(process.cwd(), "prisma", "dev.db");
      if (fs.existsSync(srcPath) && srcPath !== dbPath) {
        fs.copyFileSync(srcPath, dbPath);
      }
    }
    return;
  }

  // If a sync is already running on this container, await its completion
  if (inFlightSync) {
    return inFlightSync;
  }

  const now = Date.now();
  if (dbExists && fs.existsSync(syncRecordPath) && now - lastSyncTimestamp < SYNC_INTERVAL_MS) {
    return;
  }

  inFlightSync = (async () => {
    try {
      const headUrl = `${BLOB_PUBLIC_URL}?t=${Date.now()}`;
      const headRes = await fetch(headUrl, { method: "HEAD", cache: "no-store" });

      if (headRes.ok) {
        const etag = headRes.headers.get("etag") || headRes.headers.get("last-modified") || "";
        let shouldDownload = !dbExists;
        if (dbExists) {
          if (!fs.existsSync(syncRecordPath)) {
            shouldDownload = true;
          } else {
            try {
              const localVersion = fs.readFileSync(syncRecordPath, "utf-8").trim();
              if (localVersion !== etag) {
                shouldDownload = true;
              }
            } catch {
              shouldDownload = true;
            }
          }
        }

        if (shouldDownload) {
          const downloadUrl = `${BLOB_PUBLIC_URL}?download=1&t=${Date.now()}`;
          const res = await fetch(downloadUrl, { cache: "no-store" });
          if (res.ok) {
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const dir = path.dirname(dbPath);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(dbPath, buffer);
            try {
              fs.writeFileSync(syncRecordPath, etag);
            } catch {
              // ignore
            }
            try {
              await prisma.$disconnect();
            } catch {
              // ignore
            }
            console.log(`[SyncDb] Synced SQLite database from Blob (${buffer.length} bytes, etag: ${etag}) to ${dbPath}`);
          }
        }
      } else {
        // Blob does not exist yet: seed it from initial bundled database
        if (!dbExists) {
          const candidatePaths = [
            path.join(process.cwd(), "prisma", "dev.db"),
            path.join(process.cwd(), "dev.db"),
            path.join(__dirname, "..", "..", "prisma", "dev.db"),
          ];
          for (const src of candidatePaths) {
            if (fs.existsSync(src)) {
              fs.copyFileSync(src, dbPath);
              break;
            }
          }
        }
        if (fs.existsSync(dbPath)) {
          await persistDatabaseToBlob();
        }
      }
      lastSyncTimestamp = Date.now();
    } catch (err: any) {
      console.error("[SyncDb] Error during database sync check:", err.message);
    } finally {
      inFlightSync = null;
    }
  })();

  return inFlightSync;
}

/**
 * Uploads the updated SQLite database to Vercel Blob so all serverless
 * containers and future deployments have immediate access to the latest data.
 */
export async function persistDatabaseToBlob(): Promise<string | null> {
  const dbPath = getDbPath();
  const syncRecordPath = dbPath + ".synced";
  if (!fs.existsSync(dbPath)) return null;

  try {
    const fileBuffer = fs.readFileSync(dbPath);
    const blob = await put(BLOB_PATH, fileBuffer, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    lastSyncTimestamp = Date.now();
    try {
      if (fs.existsSync(syncRecordPath)) {
        fs.unlinkSync(syncRecordPath);
      }
    } catch {
      // ignore
    }
    console.log(`[SyncDb] Successfully backed up database to Blob: ${blob.url}`);
    return blob.url;
  } catch (err: any) {
    console.error("[SyncDb] Failed to persist database to Blob:", err.message);
    return null;
  }
}

/**
 * Uploads a media file (image, video) to persistent Vercel Blob storage
 * and returns the public CDN URL.
 */
export async function uploadMediaToBlob(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 40);
  const uniqueName = `media/${Date.now()}-${base}${ext}`;

  const blob = await put(uniqueName, fileBuffer, {
    access: "public",
    contentType: contentType,
    allowOverwrite: true,
  });

  return blob.url;
}
