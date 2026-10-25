export const serviceSlugs = [
  "flight-tickets",
  "uae-tourist-visa",
  "visa-change",
  "global-visas",
  "family-residence-visas",
] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export const packageSlugs = [
  "dubai-city-tour",
  "desert-safari",
  "luxury-vip",
  "custom-holidays",
  "family-group",
] as const;
export type PackageSlug = (typeof packageSlugs)[number];

export const branchIds = ["sharjah", "dubai", "sajaa", "india"] as const;
export type BranchId = (typeof branchIds)[number];

export const legalSlugs = ["privacy", "terms", "cookies", "credits"] as const;
export type LegalSlug = (typeof legalSlugs)[number];

export type Fact = { label: string; value: string };

export type ServiceContent = {
  title: string;
  summary: string;
  /** Short notice shown above the details, e.g. "Inquiry only, no live fares". */
  notice?: string;
  overview: string[];
  eligibility: string[];
  documents: string[];
  facts: Fact[];
  priceNote: string;
  whatsappMessage: string;
  /** IDs of FAQ items (see faq groups) to show on the service page. */
  faqIds: string[];
};

export type PackageContent = {
  title: string;
  category: string;
  duration: string;
  summary: string;
  overview: string[];
  inclusions: string[];
  itinerary: { title: string; description: string }[];
  priceNote: string;
  whatsappMessage: string;
};

export type FaqItem = { id: string; question: string; answer: string };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

export type BranchContent = {
  name: string;
  address: string;
  hours: string;
  /** Query passed to the Google Maps embed; empty hides the map. */
  mapQuery: string;
};

export type LegalContent = {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export type SiteContent = {
  services: Record<ServiceSlug, ServiceContent>;
  packages: Record<PackageSlug, PackageContent>;
  faq: FaqGroup[];
  branches: Record<BranchId, BranchContent>;
  legal: Record<LegalSlug, LegalContent>;
};
