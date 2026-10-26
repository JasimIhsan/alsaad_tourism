import "server-only";

import { uploadRules, type FileMeta, type UploadKind } from "@/lib/upload-rules";
import type { LeadsConfig } from "./config";
import { googleFetch } from "./google";

// Vercel caps request bodies at 4.5 MB, so files never pass through our functions.
// The server opens a resumable upload session and the browser PUTs the bytes
// straight to Google. Passing the browser's Origin lets Google answer with CORS headers.

const UPLOAD_MAX_AGE_MS = 60 * 60 * 1000;

function safeName(name: string): string {
  return name.normalize("NFKC").replace(/[^\p{L}\p{N}._-]+/gu, "-").slice(-80) || "file";
}

/** Returns the resumable session URL the browser uploads one file to. */
export async function createUploadSession(
  config: LeadsConfig,
  kind: UploadKind,
  file: FileMeta,
  origin: string,
): Promise<string> {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const response = await googleFetch(
    config,
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": file.type,
        // Google rejects uploads larger than the declared size.
        "X-Upload-Content-Length": String(file.size),
        Origin: origin,
      },
      body: JSON.stringify({
        name: `${stamp}-${kind}-${safeName(file.name)}`,
        mimeType: file.type,
        parents: [config.driveFolderId],
      }),
    },
  );
  const location = response.headers.get("location");
  if (!location) throw new Error("Drive did not return an upload session URL");
  return location;
}

type DriveFile = { id: string; mimeType: string; size?: string; parents?: string[]; createdTime: string };

/**
 * Confirms each ID is a recent upload of the right kind in our folder before its
 * link goes into the sheet. `drive.file` scope already limits us to files this
 * site created, so IDs of unrelated Drive files are rejected by Google itself.
 */
export async function verifyUploads(config: LeadsConfig, kind: UploadKind, ids: string[]): Promise<string[]> {
  const rule = uploadRules[kind];
  if (ids.length > rule.maxFiles) throw new Error(`Too many ${kind} files`);

  return Promise.all(
    ids.map(async (id) => {
      if (!/^[\w-]{10,100}$/.test(id)) throw new Error("Malformed Drive file ID");
      const response = await googleFetch(
        config,
        `https://www.googleapis.com/drive/v3/files/${id}?fields=id,mimeType,size,parents,createdTime`,
      );
      const file = (await response.json()) as DriveFile;
      const fresh = Date.now() - Date.parse(file.createdTime) < UPLOAD_MAX_AGE_MS;
      const inFolder = file.parents?.includes(config.driveFolderId) ?? false;
      const sizeOk = Number(file.size ?? 0) <= rule.maxMb * 1024 * 1024;
      if (!fresh || !inFolder || !sizeOk || !rule.types.includes(file.mimeType)) {
        throw new Error(`Drive file ${id} failed verification`);
      }
      return `https://drive.google.com/file/d/${file.id}/view`;
    }),
  );
}
