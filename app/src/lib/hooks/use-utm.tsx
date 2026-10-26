"use client";

import { useMemo, useSyncExternalStore } from "react";

const KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;
const STORAGE_KEY = "alsaadh-utm";

export type Utm = Partial<Record<(typeof KEYS)[number], string>>;

function fromUrl(): string {
  const params = new URLSearchParams(window.location.search);
  const utm: Utm = {};
  for (const key of KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 200);
  }
  return Object.keys(utm).length > 0 ? JSON.stringify(utm) : "";
}

/** First touch wins: the landing URL's UTM is stored once per session. Returns a stable string. */
function getSnapshot(): string {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    const landing = fromUrl();
    if (landing) sessionStorage.setItem(STORAGE_KEY, landing);
    return landing;
  } catch {
    // Storage blocked (private mode): fall back to the current URL.
    return fromUrl();
  }
}

const subscribe = () => () => {};
const getServerSnapshot = () => "";

/**
 * First-touch UTM parameters for the session, so a form opened pages after
 * landing still reports the campaign. Mount it in the layout too, to capture.
 */
export function useUtm(): Utm {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    try {
      return raw ? (JSON.parse(raw) as Utm) : {};
    } catch {
      return {};
    }
  }, [raw]);
}

/** Hidden inputs that carry UTM data to the Server Action. */
export function UtmFields() {
  const utm = useUtm();
  return KEYS.map((key) => (utm[key] ? <input key={key} type="hidden" name={key} value={utm[key]} /> : null));
}
