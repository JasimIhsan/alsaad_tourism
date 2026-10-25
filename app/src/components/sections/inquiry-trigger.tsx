"use client";

import { Button, type ButtonProps } from "@/components/motion/button/base";
import { useInquiryDrawer } from "./inquiry-drawer";

type InquiryTriggerProps = Omit<ButtonProps, "onClick"> & {
  /** Service slug to preselect in the inquiry form. */
  service?: string;
  /** Runs before the dialog opens, e.g. to close the mobile menu. */
  onBeforeOpen?: () => void;
};

/** Button that opens the site-wide inquiry dialog. */
export function InquiryTrigger({ service, onBeforeOpen, ...props }: InquiryTriggerProps) {
  const { open } = useInquiryDrawer();
  return (
    <Button
      {...props}
      onClick={() => {
        onBeforeOpen?.();
        open(service);
      }}
    />
  );
}
