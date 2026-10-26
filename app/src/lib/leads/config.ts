import "server-only";

/** Pipeline credentials (see .env.example). Never exposed to the browser. */
export type LeadsConfig = {
  google: { clientId: string; clientSecret: string; refreshToken: string };
  sheetId: string;
  driveFolderId: string;
  email: { apiKey: string; from: string; to: string[] };
};

/** Returns null when any variable is missing, so callers can fall back instead of crashing. */
export function getLeadsConfig(): LeadsConfig | null {
  const env = process.env;
  const values = {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    refreshToken: env.GOOGLE_REFRESH_TOKEN,
    sheetId: env.LEADS_SHEET_ID,
    driveFolderId: env.LEADS_DRIVE_FOLDER_ID,
    apiKey: env.RESEND_API_KEY,
    from: env.LEADS_EMAIL_FROM,
    to: env.LEADS_EMAIL_TO,
  };
  if (Object.values(values).some((value) => !value)) return null;

  return {
    google: { clientId: values.clientId!, clientSecret: values.clientSecret!, refreshToken: values.refreshToken! },
    sheetId: values.sheetId!,
    driveFolderId: values.driveFolderId!,
    email: {
      apiKey: values.apiKey!,
      from: values.from!,
      to: values.to!.split(",").map((address) => address.trim()).filter(Boolean),
    },
  };
}

/** Without credentials, local development logs submissions instead of failing them. */
export const isDevFallback = () => process.env.NODE_ENV === "development";
