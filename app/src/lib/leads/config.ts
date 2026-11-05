import "server-only";

/** Pipeline credentials (see .env.example). Never exposed to the browser. */
export type LeadsConfig = {
  google: { serviceAccountEmail: string; privateKey: string };
  sheetId: string;
  /** Null when the Resend variables are not set: leads then go to the sheet only. */
  email: { apiKey: string; from: string; to: string[] } | null;
};

/** Returns null when a Google or sheet variable is missing, so callers can fall back instead of crashing. Email alerts are optional. */
export function getLeadsConfig(): LeadsConfig | null {
  const env = process.env;
  const values = {
    serviceAccountEmail: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: env.GOOGLE_PRIVATE_KEY,
    sheetId: env.LEADS_SHEET_ID,
  };
  if (Object.values(values).some((value) => !value)) return null;

  const to = (env.LEADS_EMAIL_TO ?? "").split(",").map((address) => address.trim()).filter(Boolean);
  const hasEmail = env.RESEND_API_KEY && env.LEADS_EMAIL_FROM && to.length > 0;

  return {
    google: {
      serviceAccountEmail: values.serviceAccountEmail!,
      // Env UIs store the PEM key on one line with literal "\n" sequences.
      privateKey: values.privateKey!.replace(/\\n/g, "\n"),
    },
    sheetId: values.sheetId!,
    email: hasEmail ? { apiKey: env.RESEND_API_KEY!, from: env.LEADS_EMAIL_FROM!, to } : null,
  };
}

/** Without credentials, local development logs submissions instead of failing them. */
export const isDevFallback = () => process.env.NODE_ENV === "development";
