import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";

const DB_FILENAME = "dev.db";
const BLOB_PATH = "database/dev.db";

export function getDbPath(): string {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless) {
    return path.join("/tmp", DB_FILENAME);
  }
  return path.join(process.cwd(), "prisma", DB_FILENAME);
}

// Global timestamp to throttle remote sync checks (at most once every 2 seconds per container)
let lastSyncTimestamp = 0;
const SYNC_INTERVAL_MS = 2000;

/**
 * Ensures the SQLite database on this container is up-to-date with the latest
 * persistent database stored in Vercel Blob.
 */
export async function ensureDatabaseSynced(): Promise<void> {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const dbPath = getDbPath();
  const dbExists = fs.existsSync(dbPath);

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

  const now = Date.now();
  if (dbExists && now - lastSyncTimestamp < SYNC_INTERVAL_MS) {
    return;
  }
  lastSyncTimestamp = now;

  try {
    const { blobs } = await list({ prefix: BLOB_PATH });
    const remoteBlob = blobs.find((b) => b.pathname === BLOB_PATH);

    if (remoteBlob) {
      let shouldDownload = !dbExists;
      if (dbExists) {
        const localStats = fs.statSync(dbPath);
        const remoteTime = new Date(remoteBlob.uploadedAt).getTime();
        // If remote version is newer than local container's version
        if (remoteTime > localStats.mtimeMs) {
          shouldDownload = true;
        }
      }

      if (shouldDownload) {
        const res = await fetch(remoteBlob.url, { cache: "no-store" });
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          fs.writeFileSync(dbPath, buffer);
          console.log(`[SyncDb] Synced SQLite database from Blob (${buffer.length} bytes) to ${dbPath}`);
          return;
        }
      }
    } else {
      // Remote blob does not exist yet: seed it from initial bundled database
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
  } catch (err: any) {
    console.error("[SyncDb] Error during database sync check:", err.message);
  }
}

/**
 * Uploads the updated SQLite database to Vercel Blob so all serverless
 * containers and future deployments have immediate access to the latest data.
 */
export async function persistDatabaseToBlob(): Promise<string | null> {
  const dbPath = getDbPath();
  if (!fs.existsSync(dbPath)) return null;

  try {
    const fileBuffer = fs.readFileSync(dbPath);
    const blob = await put(BLOB_PATH, fileBuffer, {
      access: "public",
      addRandomSuffix: false,
      cacheControlMaxAge: 0,
    });
    lastSyncTimestamp = Date.now();
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
  });

  return blob.url;
}
