"use client";

import { InquiryTrigger } from "@/components/sections/inquiry-trigger";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Locale } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/locale-provider";
import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import type { NavItem } from "./nav-types";

type MobileNavProps = {
  items: NavItem[];
  labels: { open: string; close: string; title: string };
  ctaLabel: string;
  language: { target: Locale; label: string; ariaLabel: string };
};

export function MobileNav({ items, labels, ctaLabel, language }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const { dir } = useLocale();
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={labels.open}
        className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background lg:hidden"
      >
        <span
          aria-hidden="true"
          className="relative block h-[1.5px] w-4 bg-foreground before:absolute before:-top-[5px] before:start-0 before:h-[1.5px] before:w-4 before:bg-foreground after:absolute after:top-[5px] after:start-0 after:h-[1.5px] after:w-4 after:bg-foreground"
        />
      </SheetTrigger>
      {/* Opens from the reading end: right in English, left in Arabic. */}
      <SheetContent
        side={dir === "rtl" ? "left" : "right"}
        closeLabel={labels.close}
        className="w-full gap-0 overflow-y-auto px-7 pt-20 pb-10 sm:max-w-md"
      >
        <SheetTitle className="sr-only">{labels.title}</SheetTitle>
        <nav aria-label={labels.title}>
          <ul className="grid">
            {items.map((item) => (
              <li key={item.href} className="border-b border-border">
                <Link
                  href={item.href}
                  onClick={close}
                  className="block py-3 font-display text-3xl"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="grid gap-1 pb-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={close}
                          className="flex min-h-11 items-center text-muted-foreground hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 grid gap-3">
          <InquiryTrigger variant="primary" size="md" className="w-full" onBeforeOpen={close}>
            {ctaLabel}
          </InquiryTrigger>
          <LanguageSwitcher {...language} className="justify-center" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
