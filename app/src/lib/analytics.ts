import { track } from "@vercel/analytics";

/** Custom events sent to Vercel Web Analytics (S6.3). Event names are not user-facing text. */
export type AnalyticsEvent = "whatsapp_click" | "call_click" | "form_submit" | "language_switch";

export function trackEvent(name: AnalyticsEvent, properties?: Record<string, string>) {
  track(name, properties);
}
