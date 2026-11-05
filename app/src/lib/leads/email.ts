import "server-only";

import type { LeadsConfig } from "./config";

/** Sends a plain-text alert through Resend. Plain text means form input can't inject markup. */
export async function sendAlert(config: LeadsConfig, subject: string, text: string): Promise<void> {
  if (!config.email) return;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.email.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: config.email.from, to: config.email.to, subject, text }),
  });
  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text()}`);
  }
}
