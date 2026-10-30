import "server-only";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { format } from "@/lib/i18n/format";
import { after } from "next/server";
import { leadColumns, type LeadTab } from "./columns";
import { getLeadsConfig, isDevFallback, type LeadsConfig } from "./config";
import { sendAlert } from "./email";
import { appendRow, sheetUrl } from "./google";
import { allowRequest } from "./rate-limit";

const MAX_FIELD_LENGTH = 5000;

/** Trimmed string field, capped so one submission can't flood a sheet cell. */
export function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD_LENGTH) : "";
}

/** Columns every tab shares: where and how the visitor arrived. */
export function contextColumns(formData: FormData): Record<string, string> {
  return {
    Locale: field(formData, "locale"),
    Page: field(formData, "source"),
    "UTM source": field(formData, "utm_source"),
    "UTM medium": field(formData, "utm_medium"),
    "UTM campaign": field(formData, "utm_campaign"),
  };
}

/** Real users never fill the hidden "company" field. */
export function isSpam(formData: FormData): boolean {
  return Boolean(field(formData, "company"));
}

/**
 * Per-IP limit of 5 submissions per 10 minutes for each form. Call it only once the
 * input has passed validation, so a visitor correcting typos is never locked out.
 */
export function withinRateLimit(bucket: string): Promise<boolean> {
  return allowRequest(bucket, 5, 10 * 60 * 1000);
}

type LeadRecord = {
  tab: LeadTab;
  /** Form name for the email subject, e.g. "Visa application". */
  form: string;
  name: string;
  columns: Record<string, string>;
};

async function alertText(config: LeadsConfig, lead: LeadRecord, row: string[], sheetFailed: boolean) {
  const t = (await getDictionary("en")).leads.email;
  const lines = leadColumns.map((column, index) => `${column}: ${row[index] || "-"}`);
  const intro = sheetFailed ? [t.sheetFailed, ""] : [];
  return [...intro, ...lines, "", format(t.sheetLink, { url: sheetUrl(config) })].join("\n");
}

/**
 * Appends the lead to its Sheet tab, then emails the team. If the sheet write
 * fails, the email carries the full submission instead so nothing is lost;
 * only when both fail does the visitor see the retry / WhatsApp message.
 */
export async function recordLead(lead: LeadRecord): Promise<boolean> {
  const columns: Record<string, string> = { ...lead.columns, Timestamp: new Date().toISOString() };
  const row = leadColumns.map((column) => columns[column] ?? "");
  const config = getLeadsConfig();

  if (!config) {
    if (isDevFallback()) {
      console.info(`[leads] ${lead.tab} (dev, pipeline not configured)\n${JSON.stringify(columns, null, 2)}`);
      return true;
    }
    console.error("[leads] Pipeline env vars are missing; submission not stored.");
    return false;
  }

  const subject = format((await getDictionary("en")).leads.email.subject, { form: lead.form, name: lead.name });

  try {
    await appendRow(config, lead.tab, row);
  } catch (error) {
    console.error("[leads] Sheet append failed, falling back to email", error);
    try {
      await sendAlert(config, subject, await alertText(config, lead, row, true));
      return true;
    } catch (emailError) {
      console.error("[leads] Fallback email failed too; submission lost", emailError);
      return false;
    }
  }

  // The row is safe; the alert doesn't need to hold up the visitor's response.
  after(async () => {
    try {
      await sendAlert(config, subject, await alertText(config, lead, row, false));
    } catch (error) {
      console.error("[leads] Alert email failed (row was saved)", error);
    }
  });
  return true;
}
