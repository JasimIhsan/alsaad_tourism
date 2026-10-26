import { startUploads } from "./uploads";
import type { UploadKind } from "./upload-rules";

export type UploadResult = { status: "ok"; ids: string[] } | { status: "limited" | "failed" };

/**
 * Uploads files from the browser straight to Drive and returns their file IDs,
 * which the form then sends to its Server Action for verification.
 */
export async function uploadFiles(kind: UploadKind, files: File[]): Promise<UploadResult> {
  if (files.length === 0) return { status: "ok", ids: [] };

  const sessions = await startUploads(
    kind,
    files.map((file) => ({ name: file.name, type: file.type, size: file.size })),
  );
  if (sessions.status === "skip") {
    // Dev without credentials: the server logs the file names instead.
    return { status: "ok", ids: files.map((file) => `dev:${file.name}`) };
  }
  if (sessions.status === "limited") return { status: "limited" };
  if (sessions.status !== "ok") return { status: "failed" };

  try {
    const ids = await Promise.all(
      files.map(async (file, index) => {
        const response = await fetch(sessions.urls[index], {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!response.ok) throw new Error(`Upload failed with ${response.status}`);
        const { id } = (await response.json()) as { id?: string };
        if (!id) throw new Error("Upload response had no file ID");
        return id;
      }),
    );
    return { status: "ok", ids };
  } catch {
    return { status: "failed" };
  }
}
