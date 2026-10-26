/** Visa application rules shared by the form (before uploading) and the Server Action. */

import type { FileErrorCode } from "./upload-rules";

/** Option values posted by the form; labels come from the dictionary. */
export const visaTypes = ["30", "60"] as const;

export type VisaErrorCode = "required" | "phone" | "email" | FileErrorCode;
export type VisaField = "name" | "phone" | "email" | "nationality" | "visaType" | "passport" | "photo";
export type VisaFieldErrors = Partial<Record<VisaField, VisaErrorCode>>;

const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Text fields only; each side checks the documents in its own way. */
export function validateVisa(formData: FormData): VisaFieldErrors {
  const text = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };
  const phone = text("phone");
  const email = text("email");

  const errors: VisaFieldErrors = {};
  if (!text("name")) errors.name = "required";
  if (!phone) errors.phone = "required";
  else if (!PHONE_PATTERN.test(phone)) errors.phone = "phone";
  if (email && !EMAIL_PATTERN.test(email)) errors.email = "email";
  if (!text("nationality")) errors.nationality = "required";
  if (!(visaTypes as readonly string[]).includes(text("visaType"))) errors.visaType = "required";
  return errors;
}
