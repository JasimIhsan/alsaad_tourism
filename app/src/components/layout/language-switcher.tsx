"use client";

import { switchLocalePath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LanguageSwitcherProps = {
  target: Locale;
  label: string;
  ariaLabel: string;
  className?: string;
};

/** Links to the same page in the other language. */
export function LanguageSwitcher({ target, label, ariaLabel, className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  return (
    <Link
      href={switchLocalePath(pathname, target)}
      hrefLang={target}
      lang={target}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground",
        className,
      )}
    >
      {label}
    </Link>
  );
}
