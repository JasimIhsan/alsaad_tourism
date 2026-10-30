"use server";

import { serviceSlugs, type ServiceSlug } from "@/content/data/types";
import type { LeadTab } from "./leads/columns";
import { contextColumns, field, recordLead, screen } from "./leads/record";

export type InquiryErrorCode = "required" | "phone" | "email";
export type InquiryField = "name" | "phone" | "email";

export type InquiryState =
  | { status: "idle" }
  /** `tab` is the lead's destination, used to count submissions by type; absent for filtered spam. */
  | { status: "success"; tab?: LeadTab }
  | { status: "error"; fieldErrors: Partial<Record<InquiryField, InquiryErrorCode>> }
  | { status: "limited" }
  | { status: "failed" };

const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}

/** Package pages send a subject; otherwise the chosen service decides the tab. */
function tabFor(service: string, subject: string): LeadTab {
  if (subject) return "Packages";
  if (service === "flight-tickets") return "Flights";
  if (isServiceSlug(service)) return "Visa";
  return "Contact";
}

/**
 * Validates an inquiry and records it (S4.4). Returns error *codes*; the form
 * maps them to dictionary strings so no user-facing text lives here.
 */
export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const screening = await screen(formData, "inquiry");
  if (screening === "spam") return { status: "success" };
  if (screening === "limited") return { status: "limited" };

  const name = field(formData, "name");
  const phone = field(formData, "phone");
  const email = field(formData, "email");

  const fieldErrors: Partial<Record<InquiryField, InquiryErrorCode>> = {};
  if (!name) fieldErrors.name = "required";
  if (!phone) fieldErrors.phone = "required";
  else if (!PHONE_PATTERN.test(phone)) fieldErrors.phone = "phone";
  if (email && !EMAIL_PATTERN.test(email)) fieldErrors.email = "email";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  const rawService = field(formData, "service");
  const service = isServiceSlug(rawService) ? rawService : "";
  const subject = field(formData, "subject");

  const tab = tabFor(service, subject);
  const saved = await recordLead({
    tab,
    form: "Inquiry",
    name,
    columns: {
      ...contextColumns(formData),
      Form: "Inquiry",
      Name: name,
      Phone: phone,
      Email: email,
      Service: service,
      Subject: subject,
      "Travel date": field(formData, "travelDate"),
      Travellers: field(formData, "travellers"),
      Branch: field(formData, "branch"),
      Message: field(formData, "message"),
    },
  });

  return saved ? { status: "success", tab } : { status: "failed" };
}
