"use server";

export type InquiryErrorCode = "required" | "phone" | "email";
export type InquiryField = "name" | "phone" | "email";

export type InquiryState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; fieldErrors: Partial<Record<InquiryField, InquiryErrorCode>> }
  | { status: "failed" };

const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates an inquiry. Returns error *codes*; the form maps them to
 * dictionary strings so no user-facing text lives here.
 * TODO(epic-4): send to Google Sheets / Drive and email the sales team.
 */
export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Honeypot: real users never fill this hidden field.
  if (field(formData, "company")) return { status: "success" };

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

  return { status: "success" };
}
