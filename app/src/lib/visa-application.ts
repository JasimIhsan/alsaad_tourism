"use server";

import { contextColumns, field, fileIds, recordLead, resolveUploads, screen } from "./leads/record";
import { validateVisa, type VisaFieldErrors } from "./visa-rules";

export type VisaState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; fieldErrors: VisaFieldErrors }
  | { status: "limited" }
  | { status: "failed" };

/**
 * UAE tourist visa application (S4.3). The passport and photo were uploaded to
 * Drive by the browser; their IDs are verified here before the row is written
 * to the "Visa" tab.
 */
export async function submitVisaApplication(_prev: VisaState, formData: FormData): Promise<VisaState> {
  const screening = await screen(formData, "visa");
  if (screening === "spam") return { status: "success" };
  if (screening === "limited") return { status: "limited" };

  const passportIds = fileIds(formData, "passportIds");
  const photoIds = fileIds(formData, "photoIds");
  const fieldErrors = validateVisa(formData);
  if (passportIds.length === 0) fieldErrors.passport = "required";
  if (photoIds.length === 0) fieldErrors.photo = "required";
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  let files: string[];
  try {
    const [passport, photo] = await Promise.all([
      resolveUploads("passport", passportIds),
      resolveUploads("visaPhoto", photoIds),
    ]);
    files = [...passport.map((link) => `Passport: ${link}`), ...photo.map((link) => `Photo: ${link}`)];
  } catch (error) {
    console.error("[visa] Upload verification failed", error);
    return { status: "failed" };
  }

  const name = field(formData, "name");
  const saved = await recordLead({
    tab: "Visa",
    form: "Visa application",
    name,
    columns: {
      ...contextColumns(formData),
      Form: "Visa application",
      Name: name,
      Phone: field(formData, "phone"),
      Email: field(formData, "email"),
      Service: "uae-tourist-visa",
      "Travel date": field(formData, "travelDate"),
      Message: field(formData, "message"),
      Nationality: field(formData, "nationality"),
      "Visa type": `${field(formData, "visaType")} days`,
      Files: files.join("\n"),
    },
  });

  return saved ? { status: "success" } : { status: "failed" };
}
