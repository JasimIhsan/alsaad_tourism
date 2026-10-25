import type { BranchId, PackageSlug, ServiceSlug } from "./types";

// Locale-neutral data. Text lives in en.ts / ar.ts and the locale dictionaries.
// TODO(client): confirm numbers, emails and branch details (BRD §8).

export const contact = {
  /** International format without "+" for wa.me links. */
  whatsapp: "971551252328",
  phones: {
    mobile: { display: "+971 55 125 2328", tel: "+971551252328" },
    office: { display: "+971 6 522 3236", tel: "+97165223236" },
  },
  socials: {
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
    youtube: "https://www.youtube.com/",
  },
} as const;

export type ServiceIcon = "plane" | "stamp" | "route" | "globe" | "family";
export type Visual =
  | "desert"
  | "sky"
  | "dusk"
  | "night"
  | "coast"
  | "ember";

/**
 * Placeholder photography from Wikimedia Commons (free licences, credited on
 * /legal/credits). Alt text lives in the locale dictionaries under `images`.
 * TODO(client): replace with approved photography (BRD §8).
 */
export const photoIds = [
  "dubaiSkyline",
  "dubaiDunes",
  "dubaiCreek",
  "duneBashing",
  "burjAlArab",
  "maldives",
  "dubaiMarina",
  "emiratesA380",
  "grandMosque",
  "hattaMountains",
  "eiffelTower",
  "burjKhalifaSea",
] as const;
export type PhotoId = (typeof photoIds)[number];

export type Photo = {
  src: string;
  author: string;
  licence: string;
  /** Commons file page, linked from the credits page. */
  source: string;
};

// Self-hosted copies (1280px) in /public: hot-linking Wikimedia gets rate-limited (HTTP 429).
const filePage = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const photos: Record<PhotoId, Photo> = {
  dubaiSkyline: {
    src: "/photo-dubai-skyline.jpg",
    author: "Tim Reckmann",
    licence: "CC BY 2.0",
    source: filePage("Dubai_Skyline_mit_Burj_Khalifa_(18241030269).jpg"),
  },
  dubaiDunes: {
    src: "/photo-dubai-dunes.jpg",
    author: "iMahesh",
    licence: "CC BY-SA 4.0",
    source: filePage("Sunset_captured_on_Dubai_Dunes_(Wide_Angle).jpg"),
  },
  dubaiCreek: {
    src: "/photo-dubai-creek.jpg",
    author: "CT Cooper",
    licence: "Public domain",
    source: filePage("Dubai_Creek_from_an_abra_3.jpg"),
  },
  duneBashing: {
    src: "/photo-dune-bashing.jpg",
    author: "iMahesh",
    licence: "CC BY-SA 4.0",
    source: filePage("A_car_on_Dubai_Dune_bashing.jpg"),
  },
  burjAlArab: {
    src: "/photo-burj-al-arab.jpg",
    author: "Marco Becerra",
    licence: "CC BY 2.0",
    source: filePage("Burj_Al-Arab_(13996844503).jpg"),
  },
  maldives: {
    src: "/photo-maldives.jpg",
    author: "Martin Falbisoner",
    licence: "CC BY-SA 4.0",
    source: filePage("Diamonds_Thudufushi_Beach_and_Water_Villas,_May_2017_-04.jpg"),
  },
  dubaiMarina: {
    src: "/photo-dubai-marina.jpg",
    author: "Norlando Pobre",
    licence: "CC BY 2.0",
    source: filePage("Dubai_Marina_Skyline.jpg"),
  },
  emiratesA380: {
    src: "/photo-emirates-a380.jpg",
    author: "Sunnya343",
    licence: "CC BY-SA 4.0",
    source: filePage("Emirates_A380_at_gate_in_Dubai,_Jul_2017.jpg"),
  },
  grandMosque: {
    src: "/photo-grand-mosque.jpg",
    author: "Guilhem Vellut",
    licence: "CC BY 2.0",
    source: filePage("Sheikh_Zayed_Grand_Mosque_@_Abu_Dhabi_(15856602738).jpg"),
  },
  hattaMountains: {
    src: "/photo-hatta-mountains.jpg",
    author: "GMarcury",
    licence: "CC BY-SA 4.0",
    source: filePage("Hatta_Mountains_Sunset.jpg"),
  },
  eiffelTower: {
    src: "/photo-eiffel-tower.jpg",
    author: "Getfunky Paris",
    licence: "CC BY 2.0",
    source: filePage("Eiffel_Tower_and_Pont_Alexandre_III_at_night.jpg"),
  },
  burjKhalifaSea: {
    src: "/photo-burj-khalifa-sea.jpg",
    author: "Jpbowen",
    licence: "CC BY-SA 4.0",
    source: filePage("Burj_Khalifa_from_the_sea,_Dubai.jpg"),
  },
};

export const pagePhotos = {
  heroMain: "dubaiSkyline",
  heroSecondary: "dubaiDunes",
  about: "burjKhalifaSea",
} as const satisfies Record<string, PhotoId>;

export const serviceMeta: Record<
  ServiceSlug,
  { icon: ServiceIcon; visual: Visual; photo: PhotoId }
> = {
  "flight-tickets": { icon: "plane", visual: "sky", photo: "emiratesA380" },
  "uae-tourist-visa": { icon: "stamp", visual: "desert", photo: "grandMosque" },
  "visa-change": { icon: "route", visual: "dusk", photo: "hattaMountains" },
  "global-visas": { icon: "globe", visual: "coast", photo: "eiffelTower" },
  "family-residence-visas": { icon: "family", visual: "ember", photo: "burjKhalifaSea" },
};

export const packageMeta: Record<PackageSlug, { visual: Visual; photo: PhotoId }> = {
  "dubai-city-tour": { visual: "night", photo: "dubaiCreek" },
  "desert-safari": { visual: "desert", photo: "duneBashing" },
  "luxury-vip": { visual: "ember", photo: "burjAlArab" },
  "custom-holidays": { visual: "coast", photo: "maldives" },
  "family-group": { visual: "sky", photo: "dubaiMarina" },
};

export const branchMeta: Record<
  BranchId,
  { phone?: { display: string; tel: string }; email?: string }
> = {
  sharjah: { phone: contact.phones.office },
  dubai: { phone: contact.phones.mobile },
  sajaa: { phone: contact.phones.mobile },
  india: {},
};
