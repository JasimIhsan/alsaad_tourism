import "server-only";

import { headers } from "next/headers";

// Best-effort, in-memory sliding window. Each serverless instance keeps its own
// counts, so the real limit is looser than configured. If spam gets through,
// move this to a shared store (e.g. Upstash Redis) or add Turnstile / BotID.

const hits = new Map<string, number[]>();
const MAX_KEYS = 5000;

export async function clientIp(): Promise<string> {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
}

/** Records an attempt and returns false once `limit` attempts happened inside `windowMs`. */
export async function allowRequest(bucket: string, limit: number, windowMs: number): Promise<boolean> {
  const key = `${bucket}:${await clientIp()}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  // Keep memory bounded on long-lived instances.
  if (hits.size > MAX_KEYS) {
    const oldest = hits.keys().next().value;
    if (oldest) hits.delete(oldest);
  }
  return true;
}
