import { Reveal } from "@/components/motion/reveal";
import { ArrowRight } from "lucide-react";
import { InquiryTrigger } from "./inquiry-trigger";

type CtaBandProps = {
  title: string;
  description: string;
  buttonLabel: string;
  service?: string;
};

/** Cherry call-to-action card that opens the inquiry dialog. */
export function CtaBand({ title, description, buttonLabel, service }: CtaBandProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal className="grid items-center gap-10 rounded-section bg-gradient-cta px-7 py-14 text-primary-foreground md:grid-cols-[1.2fr_1fr] md:px-16 md:py-20">
          <div>
            <h2 className="font-display text-4xl leading-[1.04] text-balance md:text-6xl">{title}</h2>
            <p className="mt-5 max-w-md text-on-primary-muted">{description}</p>
          </div>
          <div className="md:justify-self-end">
            <InquiryTrigger variant="inverse" size="lg" service={service}>
              {buttonLabel}
              <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </InquiryTrigger>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
