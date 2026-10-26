// One-time setup for the leads pipeline (S4.4). Run from app/:
//
//   node --env-file=.env.local google-setup.mjs
//
// Needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (a "Desktop app" OAuth client)
// in .env.local. Sign in with the client's Google account when the browser opens.
// It then creates the uploads folder and the leads spreadsheet, and prints the
// GOOGLE_REFRESH_TOKEN, LEADS_SHEET_ID and LEADS_DRIVE_FOLDER_ID values.
// The `drive.file` scope means the site can only reach these two items.

import { OAuth2Client } from "google-auth-library";
import { createServer } from "node:http";
import { tabColumns } from "./src/lib/leads/columns.ts";

const PORT = 53682;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const { GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret } = process.env;
if (!clientId || !clientSecret) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

const client = new OAuth2Client({ clientId, clientSecret, redirectUri: REDIRECT_URI });

/** Waits for Google to redirect back with the authorisation code. */
function waitForCode() {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url ?? "/", REDIRECT_URI);
      if (url.pathname !== "/callback") return res.writeHead(404).end();
      const code = url.searchParams.get("code");
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(code ? "Done. You can close this tab and return to the terminal." : "Authorisation failed.");
      server.close();
      if (code) resolve(code);
      else reject(new Error(url.searchParams.get("error") ?? "No code returned"));
    });
    server.listen(PORT, "127.0.0.1");
  });
}

async function api(url, body) {
  const { token } = await client.getAccessToken();
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  return response.json();
}

const authUrl = client.generateAuthUrl({ access_type: "offline", prompt: "consent", scope: SCOPES });
console.log(`\nOpen this URL and sign in with the client's Google account:\n\n${authUrl}\n`);

const { tokens } = await client.getToken(await waitForCode());
if (!tokens.refresh_token) throw new Error("No refresh token returned. Remove the app's access in your Google account and retry.");
client.setCredentials(tokens);

const folder = await api("https://www.googleapis.com/drive/v3/files?fields=id", {
  name: "Al Saadah Tourism · Uploads",
  mimeType: "application/vnd.google-apps.folder",
});

const sheet = await api("https://sheets.googleapis.com/v4/spreadsheets", {
  properties: { title: "Al Saadah Tourism · Leads" },
  sheets: Object.entries(tabColumns).map(([title, columns]) => ({
    properties: { title, gridProperties: { frozenRowCount: 1 } },
    data: [
      {
        rowData: [
          {
            values: columns.map((column) => ({
              userEnteredValue: { stringValue: column },
              userEnteredFormat: { textFormat: { bold: true } },
            })),
          },
        ],
      },
    ],
  })),
});

console.log("\nAdd these to .env.local and to the Vercel project:\n");
console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
console.log(`LEADS_SHEET_ID=${sheet.spreadsheetId}`);
console.log(`LEADS_DRIVE_FOLDER_ID=${folder.id}`);
console.log(`\nSheet: ${sheet.spreadsheetUrl}\n`);
