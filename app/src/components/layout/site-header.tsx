"use client";

import { InquiryTrigger } from "@/components/sections/inquiry-trigger";
import type { Locale } from "@/lib/i18n/config";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import type { NavItem } from "./nav-types";

type SiteHeaderProps = {
  homeHref: string;
  brand: { name: string; tagline: string };
  items: NavItem[];
  navLabel: string;
  ctaLabel: string;
  menuLabels: { open: string; close: string; title: string };
  language: { target: Locale; label: string; ariaLabel: string };
};

export function SiteHeader({
  homeHref,
  brand,
  items,
  navLabel,
  ctaLabel,
  menuLabels,
  language,
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-40 px-4">
      <header
        className={cn(
          "pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-glass-border py-2 ps-5 pe-2 backdrop-blur-md backdrop-saturate-150 transition-[background-color,box-shadow] duration-400 ease-brand",
          scrolled ? "bg-glass-strong shadow-raised" : "bg-glass",
        )}
      >
        <Logo href={homeHref} brand={brand} />

        <nav aria-label={navLabel} className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm">
            {items.map((item) => (
              <li key={item.href}>
                {item.children ? <NavDropdown item={item} /> : <NavAnchor href={item.href} label={item.label} />}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher {...language} className="hidden sm:inline-flex" />
          <InquiryTrigger variant="primary" size="sm" className="hidden px-5 font-semibold md:inline-flex">
            {ctaLabel}
          </InquiryTrigger>
          <MobileNav
            items={items}
            labels={menuLabels}
            ctaLabel={ctaLabel}
            language={language}
          />
        </div>
      </header>
    </div>
  );
}

function NavAnchor({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="inline-flex min-h-11 items-center transition-colors hover:text-primary aria-[current=page]:text-primary"
    >
      {label}
    </Link>
  );
}

/** Disclosure-style dropdown: opens on hover (pointer devices), click or keyboard. */
function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // A hover-open followed by a click should keep the panel open, not toggle it shut.
  const openedByHover = useRef(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const active = pathname.startsWith(item.href);

  // Close when navigating to another page.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && !open) {
          openedByHover.current = true;
          setOpen(true);
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") {
          openedByHover.current = false;
          setOpen(false);
        }
      }}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (openedByHover.current) {
            openedByHover.current = false;
            setOpen(true);
          } else {
            setOpen((v) => !v);
          }
        }}
        className={cn(
          "inline-flex min-h-11 items-center gap-1 transition-colors hover:text-primary",
          active && "text-primary",
        )}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-3.5 transition-transform duration-300 ease-brand", open && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="absolute top-full -start-3 z-10 pt-3"
          >
            <ul className="grid w-72 gap-0.5 rounded-2xl bg-popover p-2.5 shadow-pop">
              {item.children?.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-accent focus-visible:bg-accent"
                  >
                    <span className="block text-sm font-medium">{child.label}</span>
                    {child.description ? (
                      <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {child.description}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
              {item.allLabel ? (
                <li className="mt-1 border-t border-border pt-1">
                  <Link
                    href={item.href}
                    className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-accent"
                  >
                    {item.allLabel}
                  </Link>
                </li>
              ) : null}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
