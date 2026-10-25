export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];
export type Direction = "ltr" | "rtl";

export const defaultLocale: Locale = "en";

const directions: Record<Locale, Direction> = {
  en: "ltr",
  ar: "rtl",
};

/** BCP 47 tags used for Intl formatting and hreflang. */
export const intlLocales: Record<Locale, string> = {
  en: "en-AE",
  ar: "ar-AE",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): Direction {
  return directions[locale];
}

/** Prefixes an app path ("/services") with the locale ("/ar/services"). */
export function localizedHref(locale: Locale, path: string): string {
  if (path.startsWith("#")) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Swaps the locale segment of a pathname, keeping the rest of the route. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  if (segments[1] && hasLocale(segments[1])) {
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }
  return localizedHref(target, pathname);
}
