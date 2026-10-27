import "server-only";

import { JWT } from "google-auth-library";
import type { LeadsConfig } from "./config";

// A Google service account writes to the leads spreadsheet. The client shares
// that one sheet with the service account's email as an Editor; the account
// has no access to anything else in their Google Drive.

let client: JWT | undefined;

function serviceAccount(config: LeadsConfig): JWT {
  client ??= new JWT({
    email: config.google.serviceAccountEmail,
    key: config.google.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return client;
}

async function googleFetch(config: LeadsConfig, url: string, init: RequestInit = {}): Promise<Response> {
  const { token } = await serviceAccount(config).getAccessToken();
  if (!token) throw new Error("Google did not return an access token");
  const response = await fetch(url, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Google API ${response.status} for ${url.split("?")[0]}: ${await response.text()}`);
  }
  return response;
}

/**
 * Appends one row to a tab. RAW input stops values starting with "=" from being
 * run as formulas (spreadsheet formula injection from form fields).
 */
export async function appendRow(config: LeadsConfig, tab: string, values: string[]): Promise<void> {
  const range = encodeURIComponent(`'${tab}'!A1`);
  await googleFetch(
    config,
    `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: [values] }),
    },
  );
}

export const sheetUrl = (config: LeadsConfig) => `https://docs.google.com/spreadsheets/d/${config.sheetId}`;
