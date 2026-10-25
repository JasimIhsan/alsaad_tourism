"use client";

import { createContext, use, type ReactNode } from "react";
import { getDirection, type Direction, type Locale } from "./config";

type LocaleContextValue = { locale: Locale; dir: Direction };

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext value={{ locale, dir: getDirection(locale) }}>
      {children}
    </LocaleContext>
  );
}

export function useLocale(): LocaleContextValue {
  const value = use(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside LocaleProvider");
  return value;
}

/** Sign to multiply horizontal motion offsets by, so slides follow reading direction. */
export function useDirectionSign(): 1 | -1 {
  return useLocale().dir === "rtl" ? -1 : 1;
}
