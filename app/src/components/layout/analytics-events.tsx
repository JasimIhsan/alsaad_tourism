"use client";

import { trackEvent } from "@/lib/analytics";
import { useEffect } from "react";

/**
 * Tracks WhatsApp, call and language-switch clicks with one listener, so every link to
 * wa.me, every tel: link and the language switcher is covered without touching each one.
 * Form submissions are tracked by the form itself.
 */
export function AnalyticsEvents() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a");
      const href = link?.getAttribute("href");
      if (!link || !href) return;

      const page = window.location.pathname;
      if (href.startsWith("tel:")) {
        trackEvent("call_click", { page });
      } else if (/^https:\/\/wa\.me\//.test(href)) {
        trackEvent("whatsapp_click", { page });
      } else if (link.hasAttribute("hreflang")) {
        // Only the language switcher sets hreflang on an in-page link.
        trackEvent("language_switch", { page, to: link.getAttribute("hreflang") ?? "" });
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
