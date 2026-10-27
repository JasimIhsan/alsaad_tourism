import "server-only";

/** Pipeline credentials (see .env.example). Never exposed to the browser. */
export type LeadsConfig = {
  google: { serviceAccountEmail: string; privateKey: string };
  sheetId: string;
  email: { apiKey: string; from: string; to: string[] };
};

/** Returns null when any variable is missing, so callers can fall back instead of crashing. */
export function getLeadsConfig(): LeadsConfig | null {
  const env = process.env;
  const values = {
    serviceAccountEmail: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: env.GOOGLE_PRIVATE_KEY,
    sheetId: env.LEADS_SHEET_ID,
    apiKey: env.RESEND_API_KEY,
    from: env.LEADS_EMAIL_FROM,
    to: env.LEADS_EMAIL_TO,
  };
  if (Object.values(values).some((value) => !value)) return null;

  return {
    google: {
      serviceAccountEmail: values.serviceAccountEmail!,
      // Env UIs store the PEM key on one line with literal "\n" sequences.
      privateKey: values.privateKey!.replace(/\\n/g, "\n"),
    },
    sheetId: values.sheetId!,
    email: {
      apiKey: values.apiKey!,
      from: values.from!,
      to: values.to!.split(",").map((address) => address.trim()).filter(Boolean),
    },
  };
}

/** Without credentials, local development logs submissions instead of failing them. */
export const isDevFallback = () => process.env.NODE_ENV === "development";
