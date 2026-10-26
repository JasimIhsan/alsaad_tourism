import { PageHero } from "@/components/sections/page-hero";
import { getI18n } from "@/lib/i18n/server";
import { LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import { VisaForm } from "./_components/visa-form";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.meta.visa.title, description: dict.meta.visa.description };
}

export default async function VisaApplicationPage() {
  const { dict } = await getI18n();
  const page = dict.visaPage;

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-24 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <div className="rounded-card border border-border p-6 sm:p-10">
          <VisaForm dict={page.form} formDict={dict.form} />
        </div>

        <aside className="grid content-start gap-6 lg:sticky lg:top-28 lg:self-start">
          <section aria-labelledby="visa-steps" className="rounded-card bg-muted p-7">
            <h2 id="visa-steps" className="font-display text-2xl">
              {page.steps.title}
            </h2>
            <ol className="mt-5 grid gap-4">
              {page.steps.items.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>
          <p className="flex gap-3 text-sm text-muted-foreground">
            <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
            {page.privacy}
          </p>
        </aside>
      </div>
    </>
  );
}
