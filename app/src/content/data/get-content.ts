import "server-only";

import type { Locale } from "@/lib/i18n/config";
import { ar } from "./ar";
import { en } from "./en";
import type { SiteContent } from "./types";

const content: Record<Locale, SiteContent> = { en, ar };

export function getContent(locale: Locale): SiteContent {
  return content[locale];
}
