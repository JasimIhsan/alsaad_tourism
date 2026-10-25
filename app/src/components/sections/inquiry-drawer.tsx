"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";
import { InquiryForm, type Option } from "./inquiry-form";

type DrawerContextValue = { open: (service?: string) => void };

const DrawerContext = createContext<DrawerContextValue | null>(null);

type InquiryDrawerProviderProps = {
  children: ReactNode;
  dict: { drawer: Dictionary["drawer"]; form: Dictionary["form"]; close: string };
  services: Option[];
};

/** Site-wide inquiry dialog, opened from any CTA via useInquiryDrawer(). */
export function InquiryDrawerProvider({ children, dict, services }: InquiryDrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [service, setService] = useState<string | undefined>();

  const open = useCallback((next?: string) => {
    setService(next);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <DrawerContext value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          closeLabel={dict.close}
          className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto rounded-card p-6 sm:max-w-lg sm:p-10"
        >
          <DialogHeader className="gap-2 pe-8">
            <DialogTitle className="font-display text-3xl leading-tight">
              {dict.drawer.title}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {dict.drawer.description}
            </DialogDescription>
          </DialogHeader>
          {/* key re-applies the preselected service each time the dialog opens */}
          <InquiryForm
            key={service ?? "general"}
            dict={dict.form}
            services={services}
            defaultService={service}
          />
        </DialogContent>
      </Dialog>
    </DrawerContext>
  );
}

export function useInquiryDrawer(): DrawerContextValue {
  const value = use(DrawerContext);
  if (!value) throw new Error("useInquiryDrawer must be used inside InquiryDrawerProvider");
  return value;
}
