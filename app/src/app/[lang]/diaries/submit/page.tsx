import { PageHero } from "@/components/sections/page-hero";
import { diaryLanguages } from "@/lib/diary-rules";
import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { SubmissionForm } from "../_components/submission-form";
import { languageName } from "../_components/to-card-data";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.meta.diarySubmit.title, description: dict.meta.diarySubmit.description };
}

export default async function DiarySubmitPage() {
  const { locale, dict } = await getI18n();
  const page = dict.diariesPage.submit;
  const languages = diaryLanguages.map((lang) => ({ value: lang, label: languageName(locale, lang) }));

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
      <section className="pb-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="max-w-3xl rounded-card border border-border p-6 sm:p-10">
            <SubmissionForm dict={page} optionalLabel={dict.form.optional} languages={languages} />
          </div>
        </div>
      </section>
    </>
  );
}
