import { InquiryForm } from "@/components/sections/inquiry-form";
import { PageHero } from "@/components/sections/page-hero";
import { getContent } from "@/content/data/get-content";
import { branchMeta } from "@/content/data/site";
import { branchIds, serviceSlugs } from "@/content/data/types";
import { format } from "@/lib/i18n/format";
import { getI18n } from "@/lib/i18n/server";
import { JsonLd } from "@/components/sections/json-ld";
import { pageMetadata, travelAgencyJsonLd } from "@/lib/seo";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BranchMap } from "./_components/branch-map";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return pageMetadata({
    locale,
    dict,
    path: "/contact",
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
  });
}

export default async function ContactPage() {
  const { locale, dict } = await getI18n();
  const content = getContent(locale);
  const page = dict.contactPage;
  const services = serviceSlugs.map((s) => ({ value: s, label: content.services[s].title }));
  const branches = branchIds.map((id) => ({ value: id, label: content.branches[id].name }));

  return (
    <>
      <JsonLd data={travelAgencyJsonLd(locale, dict, content)} />
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />

      <section aria-labelledby="branches-title" className="pb-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 id="branches-title" className="mb-10 font-display text-3xl md:text-4xl">
            {page.branchesTitle}
          </h2>
          <ul className="grid gap-5 md:grid-cols-2">
            {branchIds.map((id) => {
              const branch = content.branches[id];
              const meta = branchMeta[id];
              return (
                <li key={id} className="grid content-start gap-6 rounded-card border border-border p-6 md:p-8">
                  <h3 className="font-display text-2xl">{branch.name}</h3>
                  <dl className="grid gap-4">
                    <Row icon={<MapPin className="size-4" />} label={page.address}>
                      {branch.address}
                    </Row>
                    <Row icon={<Clock className="size-4" />} label={page.hours}>
                      {branch.hours}
                    </Row>
                    {meta.phone ? (
                      <Row icon={<Phone className="size-4" />} label={page.phone}>
                        <a href={`tel:${meta.phone.tel}`} className="hover:text-primary">
                          <bdi dir="ltr">{meta.phone.display}</bdi>
                        </a>
                      </Row>
                    ) : null}
                    {meta.email ? (
                      <Row icon={<Mail className="size-4" />} label={page.email}>
                        <a href={`mailto:${meta.email}`} className="hover:text-primary">
                          {meta.email}
                        </a>
                      </Row>
                    ) : null}
                  </dl>
                  {branch.mapQuery ? (
                    <div className="grid gap-3">
                      <BranchMap
                        query={branch.mapQuery}
                        locale={locale}
                        title={format(page.mapTitle, { branch: branch.name })}
                        showLabel={page.showMap}
                      />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.mapQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline"
                      >
                        {page.directions}
                      </a>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="contact-form-title" className="border-t border-border py-20 md:py-28">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <h2 id="contact-form-title" className="font-display text-4xl md:text-5xl">
              {page.formTitle}
            </h2>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">{page.formDescription}</p>
          </div>
          <InquiryForm dict={dict.form} services={services} branches={branches} />
        </div>
      </section>
    </>
  );
}

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span aria-hidden="true" className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-accent">
        {icon}
      </span>
      <div>
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <dd>{children}</dd>
      </div>
    </div>
  );
}
