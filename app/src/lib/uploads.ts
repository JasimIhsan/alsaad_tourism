"use server";

import { headers } from "next/headers";
import { getLeadsConfig, isDevFallback } from "./leads/config";
import { createUploadSession } from "./leads/drive";
import { allowRequest } from "./leads/rate-limit";
import { checkFiles, isUploadKind, type FileMeta, type UploadKind } from "./upload-rules";

export type UploadSessions =
  | { status: "ok"; urls: string[] }
  /** Local development without credentials: the form skips the upload step. */
  | { status: "skip" }
  | { status: "invalid" | "limited" | "failed" };

/** The browser's origin, accepted only when it matches the host serving this site. */
async function sameOrigin(): Promise<string | null> {
  const list = await headers();
  const origin = list.get("origin");
  const host = list.get("x-forwarded-host") ?? list.get("host");
  if (!origin || !host) return null;
  try {
    return new URL(origin).host === host ? origin : null;
  } catch {
    return null;
  }
}

/** Opens one Drive resumable upload session per file (see lib/leads/drive.ts). */
export async function startUploads(kind: UploadKind, files: FileMeta[]): Promise<UploadSessions> {
  if (!isUploadKind(kind) || !Array.isArray(files) || files.length === 0) return { status: "invalid" };
  const meta = files.map(({ name, type, size }) => ({ name: String(name), type: String(type), size: Number(size) }));
  if (checkFiles(kind, meta)) return { status: "invalid" };
  if (!(await allowRequest("uploads", 12, 10 * 60 * 1000))) return { status: "limited" };

  const config = getLeadsConfig();
  if (!config) return isDevFallback() ? { status: "skip" } : { status: "failed" };

  const origin = await sameOrigin();
  if (!origin) return { status: "failed" };

  try {
    const urls = await Promise.all(meta.map((file) => createUploadSession(config, kind, file, origin)));
    return { status: "ok", urls };
  } catch (error) {
    console.error("[uploads] Could not open Drive upload sessions", error);
    return { status: "failed" };
  }
}
