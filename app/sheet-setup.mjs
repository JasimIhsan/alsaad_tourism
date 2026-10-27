// Prepares the leads Google Sheet (S4.4). Run from app/ after filling .env.local:
//
//   node --env-file=.env.local sheet-setup.mjs
//
// The sheet must already be shared with GOOGLE_SERVICE_ACCOUNT_EMAIL as an Editor.
// Adds any missing tabs (Visa, Flights, Packages, Contact) and writes a bold,
// frozen header row to each. Safe to re-run: existing rows are left alone.

import { JWT } from "google-auth-library";
import { leadColumns, leadTabs } from "./src/lib/leads/columns.ts";

const { GOOGLE_SERVICE_ACCOUNT_EMAIL: email, GOOGLE_PRIVATE_KEY: key, LEADS_SHEET_ID: sheetId } = process.env;
if (!email || !key || !sheetId) {
  console.error("Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY and LEADS_SHEET_ID in .env.local first.");
  process.exit(1);
}

const auth = new JWT({
  email,
  key: key.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const base = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;

async function call(path, method = "GET", body) {
  const { token } = await auth.getAccessToken();
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const hint = response.status === 403 || response.status === 404 ? `\nIs the sheet shared with ${email}?` : "";
    throw new Error(`${response.status} ${await response.text()}${hint}`);
  }
  return response.json();
}

const meta = await call("?fields=properties.title,sheets.properties(sheetId,title)");
const existing = new Set(meta.sheets.map((sheet) => sheet.properties.title));
const missing = leadTabs.filter((tab) => !existing.has(tab));

if (missing.length > 0) {
  await call(":batchUpdate", "POST", {
    requests: missing.map((title) => ({ addSheet: { properties: { title } } })),
  });
}

const sheets = (await call("?fields=sheets.properties(sheetId,title)")).sheets.filter((sheet) =>
  leadTabs.includes(sheet.properties.title),
);

await call("/values:batchUpdate", "POST", {
  valueInputOption: "RAW",
  data: leadTabs.map((tab) => ({ range: `'${tab}'!A1`, values: [[...leadColumns]] })),
});

await call(":batchUpdate", "POST", {
  requests: sheets.flatMap(({ properties: { sheetId: id } }) => [
    {
      repeatCell: {
        range: { sheetId: id, startRowIndex: 0, endRowIndex: 1 },
        cell: { userEnteredFormat: { textFormat: { bold: true } } },
        fields: "userEnteredFormat.textFormat.bold",
      },
    },
    {
      updateSheetProperties: {
        properties: { sheetId: id, gridProperties: { frozenRowCount: 1 } },
        fields: "gridProperties.frozenRowCount",
      },
    },
  ]),
});

console.log(`"${meta.properties.title}" is ready. Tabs: ${leadTabs.join(", ")}.`);
if (missing.length > 0) console.log(`Added: ${missing.join(", ")}.`);
