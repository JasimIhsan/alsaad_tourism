import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { getContent } from "@/content/data/get-content";
import { getDiaries } from "@/lib/diaries";
import { getI18n } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { DiaryFeed } from "./_components/diary-feed";
import { toCardData, tagLabel } from "./_components/to-card-data";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.meta.diaries.title, description: dict.meta.diaries.description };
}

export default async function DiariesPage() {
  const { locale, dict } = await getI18n();
  const content = getContent(locale);
  const page = dict.diariesPage;
  const diaries = getDiaries();

  // Only offer filters that match at least one story, in site-content order.
  const usedTags = new Set(diaries.flatMap((diary) => diary.tags));
  const tags = [...usedTags].map((tag) => ({ value: tag, label: tagLabel(content, tag) }));

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
      <section className="pb-8">
        <div className="mx-auto w-full max-w-6xl px-6">
          <DiaryFeed
            diaries={diaries.map((diary) => toCardData(diary, locale, dict))}
            tags={tags}
            labels={{ filter: page.filterLabel, all: page.all, empty: page.empty, read: page.readStory }}
          />
        </div>
      </section>
      <CtaBand title={dict.home.cta.title} description={dict.home.cta.description} buttonLabel={dict.home.cta.button} />
    </>
  );
}
