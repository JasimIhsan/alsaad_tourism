// Sheet tabs and their column headers. Shared by the app and sheet-setup.mjs
// (which writes the header rows), so keep this file free of "@/" imports.
// Headers are staff-facing labels in the client's Google Sheet, not site UI.

export const leadTabs = ["Visa", "Flights", "Packages", "Contact"] as const;
export type LeadTab = (typeof leadTabs)[number];

/** Every tab uses the same columns, in this order. */
export const leadColumns = [
  "Timestamp",
  "Form",
  "Locale",
  "Page",
  "UTM source",
  "UTM medium",
  "UTM campaign",
  "Name",
  "Phone",
  "Email",
  "Service",
  "Subject",
  "Travel date",
  "Travellers",
  "Branch",
  "Message",
] as const;
