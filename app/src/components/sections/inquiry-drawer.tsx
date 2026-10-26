"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useUtm } from "@/lib/hooks/use-utm";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/locale-provider";
import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";
import { InquiryForm, type Option } from "./inquiry-form";

type DrawerContextValue = { open: (service?: string) => void };

const DrawerContext = createContext<DrawerContextValue | null>(null);

type InquiryDrawerProviderProps = {
  children: ReactNode;
  dict: { drawer: Dictionary["drawer"]; form: Dictionary["form"]; close: string };
  services: Option[];
};

/**
 * Site-wide inquiry form, opened from any CTA via useInquiryDrawer(): a dialog
 * on desktop, a full-height sheet from the reading end on mobile (S4.1).
 */
export function InquiryDrawerProvider({ children, dict, services }: InquiryDrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [service, setService] = useState<string | undefined>();
  const isDesktop = useMediaQuery("(min-width: 768px)", true);
  const { dir } = useLocale();
  // Lives in the layout, so landing-page UTM is captured before any form mounts.
  useUtm();

  const open = useCallback((next?: string) => {
    setService(next);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  // key re-applies the preselected service each time the form opens
  const form = (
    <InquiryForm key={service ?? "general"} dict={dict.form} services={services} defaultService={service} />
  );

  return (
    <DrawerContext value={value}>
      {children}
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent
            closeLabel={dict.close}
            className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto rounded-card p-6 sm:max-w-lg sm:p-10"
          >
            <DialogHeader className="gap-2 pe-8">
              <DialogTitle className="font-display text-3xl leading-tight">{dict.drawer.title}</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {dict.drawer.description}
              </DialogDescription>
            </DialogHeader>
            {form}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          {/* Opens from the reading end: right in English, left in Arabic. */}
          <SheetContent
            side={dir === "rtl" ? "left" : "right"}
            closeLabel={dict.close}
            className="gap-6 overflow-y-auto px-6 pt-16 pb-10 data-[side=left]:w-full data-[side=right]:w-full"
          >
            <SheetHeader className="gap-2 p-0">
              <SheetTitle className="font-display text-3xl leading-tight">{dict.drawer.title}</SheetTitle>
              <SheetDescription className="text-base">{dict.drawer.description}</SheetDescription>
            </SheetHeader>
            {form}
          </SheetContent>
        </Sheet>
      )}
    </DrawerContext>
  );
}

export function useInquiryDrawer(): DrawerContextValue {
  const value = use(DrawerContext);
  if (!value) throw new Error("useInquiryDrawer must be used inside InquiryDrawerProvider");
  return value;
}
