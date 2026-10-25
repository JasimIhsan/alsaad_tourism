import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

/** Locale of the current request, read from the root [lang] segment. */
export async function getRequestLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

/** Locale plus its dictionary, for Server Components. */
export async function getI18n() {
  const locale = await getRequestLocale();
  return { locale, dict: await getDictionary(locale) };
}
