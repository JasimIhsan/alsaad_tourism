import "server-only";

import { OAuth2Client } from "google-auth-library";
import type { LeadsConfig } from "./config";

// The client's own Google account authorises the site with the `drive.file`
// scope, which only reaches files the site created (the uploads folder and the
// leads spreadsheet made by google-setup.ts). Sheets accepts that scope too.

let client: OAuth2Client | undefined;

function oauthClient(config: LeadsConfig): OAuth2Client {
  if (!client) {
    client = new OAuth2Client({ clientId: config.google.clientId, clientSecret: config.google.clientSecret });
    client.setCredentials({ refresh_token: config.google.refreshToken });
  }
  return client;
}

export async function accessToken(config: LeadsConfig): Promise<string> {
  const { token } = await oauthClient(config).getAccessToken();
  if (!token) throw new Error("Google did not return an access token");
  return token;
}

export async function googleFetch(config: LeadsConfig, url: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${await accessToken(config)}` },
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
