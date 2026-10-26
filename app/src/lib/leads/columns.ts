// Sheet tabs and their column headers. Shared by the app and google-setup.ts
// (which writes the header rows), so keep this file free of "@/" imports.
// Headers are staff-facing labels in the client's Google Sheet, not site UI.

export const inquiryTabs = ["Visa", "Flights", "Packages", "Contact"] as const;
export type InquiryTab = (typeof inquiryTabs)[number];
export type LeadTab = InquiryTab | "Diaries";

export const inquiryColumns = [
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
  "Nationality",
  "Visa type",
  "Files",
] as const;

export const diaryColumns = [
  "Timestamp",
  "Locale",
  "Page",
  "UTM source",
  "UTM medium",
  "UTM campaign",
  "Name",
  "Trip",
  "Language",
  "Rating",
  "Story",
  "Photos",
  "Markdown draft",
  "Status",
] as const;

export type InquiryColumn = (typeof inquiryColumns)[number];
export type DiaryColumn = (typeof diaryColumns)[number];

export const tabColumns: Record<LeadTab, readonly string[]> = {
  Visa: inquiryColumns,
  Flights: inquiryColumns,
  Packages: inquiryColumns,
  Contact: inquiryColumns,
  Diaries: diaryColumns,
};
