"use client";

import { cn } from "@/lib/utils";
import { MessageCircle, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** True while a form field has focus, so the buttons never cover inputs or submit buttons. */
function useFormFocused() {
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const update = () => setFocused(Boolean(document.activeElement?.closest("form")));
    // focusout fires before the next element is focused, so re-check on the next tick.
    const onFocusOut = () => setTimeout(update, 0);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);
  return focused;
}

type ContactFabProps = {
  whatsappNumber: string;
  tel: string;
  labels: { group: string; whatsapp: string; call: string };
  defaultMessage: string;
  /** Pathname → pre-filled WhatsApp message for that page. */
  messages: Record<string, string>;
};

/** Floating WhatsApp and call buttons at the reading end of the screen. */
export function ContactFab({ whatsappNumber, tel, labels, defaultMessage, messages }: ContactFabProps) {
  const pathname = usePathname();
  const formFocused = useFormFocused();
  const message = messages[pathname] ?? defaultMessage;
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div
      role="group"
      aria-label={labels.group}
      className={cn(
        "fixed end-4 bottom-4 z-30 flex flex-col items-center gap-3 transition-[opacity,translate] duration-300 ease-brand sm:end-6 sm:bottom-6",
        formFocused && "invisible translate-y-4 opacity-0",
      )}
    >
      <a
        href={`tel:${tel}`}
        aria-label={labels.call}
        className="inline-flex size-12 items-center justify-center rounded-full bg-inverse text-inverse-foreground shadow-float transition-transform duration-300 ease-brand hover:-translate-y-0.5"
      >
        <Phone aria-hidden="true" className="size-5" />
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.whatsapp}
        className="inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-float transition-transform duration-300 ease-brand hover:-translate-y-0.5"
      >
        <MessageCircle aria-hidden="true" className="size-6" />
      </a>
    </div>
  );
}
