import { contact } from "@/content/data/site";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

type FormFailureProps = {
  /** "failed" shows the retry message, "limited" the too-many-attempts one. */
  status: "failed" | "limited" | null;
  messages: { failed: string; limited: string; whatsapp: string };
  className?: string;
};

/**
 * Live region for submission errors with a WhatsApp fallback (S4.4), so a
 * visitor whose form can't be saved still has a way to reach the team.
 */
export function FormFailure({ status, messages, className }: FormFailureProps) {
  return (
    <div role="alert" className={cn(!status && "sr-only", className)}>
      {status ? (
        <div className="grid gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="text-destructive">{status === "limited" ? messages.limited : messages.failed}</p>
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 justify-self-start rounded-full bg-whatsapp px-5 font-semibold text-whatsapp-foreground"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            {messages.whatsapp}
          </a>
        </div>
      ) : null}
    </div>
  );
}
