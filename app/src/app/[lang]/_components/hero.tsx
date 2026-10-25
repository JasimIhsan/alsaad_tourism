import { ButtonLink } from "@/components/motion/button/base";
import { InquiryForm, type Option } from "@/components/sections/inquiry-form";
import { InquiryTrigger } from "@/components/sections/inquiry-trigger";
import { PhotoFill } from "@/components/sections/photo-fill";
import { pagePhotos } from "@/content/data/site";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { ArrowRight } from "lucide-react";

type HeroProps = {
  dict: Dictionary["home"];
  formDict: Dictionary["form"];
  photoAlts: Dictionary["images"];
  services: Option[];
  servicesHref: string;
};

export function Hero({ dict, formDict, photoAlts, services, servicesHref }: HeroProps) {
  const { hero, selector } = dict;
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div>
            <p className="eyebrow mb-5 text-muted-foreground">{hero.eyebrow}</p>
            <h1 className="font-display text-[clamp(3rem,6.6vw,6rem)] leading-[0.98] tracking-[-0.02em] text-balance">
              {hero.titleStart}
              <em className="accent-em">{hero.titleAccent}</em>
              {hero.titleEnd}
            </h1>
            <p className="mt-7 max-w-[40ch] text-lg">{hero.subtitle}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <InquiryTrigger variant="primary" size="md">
                {hero.primaryCta}
                <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </InquiryTrigger>
              <ButtonLink href={servicesHref} variant="outline" size="md">
                {hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <Collage dict={hero} photoAlts={photoAlts} />
        </div>

        <section aria-label={selector.label} className="mt-16 md:mt-20">
          <InquiryForm
            variant="compact"
            dict={formDict}
            services={services}
            submitLabel={selector.submit}
          />
        </section>
      </div>
    </section>
  );
}

function Collage({
  dict,
  photoAlts,
}: {
  dict: Dictionary["home"]["hero"];
  photoAlts: Dictionary["images"];
}) {
  return (
    <div aria-label={dict.collageLabel} role="group" className="relative h-[26rem] sm:h-[32rem] lg:h-[35rem]">
      <div className="absolute end-0 top-0 h-[78%] w-[72%] overflow-hidden rounded-t-[12.5rem] rounded-b-card bg-gradient-sky">
        <PhotoFill
          id={pagePhotos.heroMain}
          alt={photoAlts[pagePhotos.heroMain]}
          sizes="(min-width: 1024px) 40vw, 72vw"
          preload
        />
        <Caption>{dict.captionMain}</Caption>
      </div>
      <div className="absolute start-0 bottom-0 h-[46%] w-[46%] overflow-hidden rounded-card rounded-se-[6.875rem] bg-gradient-ember">
        <PhotoFill
          id={pagePhotos.heroSecondary}
          alt={photoAlts[pagePhotos.heroSecondary]}
          sizes="(min-width: 1024px) 26vw, 46vw"
        />
        <Caption>{dict.captionSecondary}</Caption>
      </div>
      <Badge className="start-[2%] top-[26%]" label={dict.badgeOneLabel} value={dict.badgeOneValue} />
      <Badge
        className="end-[4%] bottom-[16%] [animation-delay:-3s]"
        label={dict.badgeTwoLabel}
        value={dict.badgeTwoValue}
      />
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 bg-gradient-caption px-5 pt-10 pb-4">
      <span className="eyebrow text-inverse-foreground/90">{children}</span>
    </span>
  );
}

function Badge({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute max-w-[70%] animate-float rounded-full bg-background px-4 py-3 text-sm font-semibold shadow-float sm:px-5 ${className ?? ""}`}
    >
      <span className="eyebrow block text-[0.6875rem] font-medium text-muted-foreground">{label}</span>
      <span className="block truncate">{value}</span>
    </div>
  );
}
