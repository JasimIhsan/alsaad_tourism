import "server-only";

import { cache } from "react";
import type en from "@/content/locales/en.json";
import type { Locale } from "./config";

export type Dictionary = typeof en;

// Typing both loaders as Dictionary makes a key missing from ar.json a build error.
const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/content/locales/en.json").then((m) => m.default),
  ar: () => import("@/content/locales/ar.json").then((m) => m.default),
};

export const getDictionary = cache((locale: Locale) => loaders[locale]());
