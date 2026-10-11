import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { Gallery, GalleryFallback } from "@/components/Gallery";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/ui";
import { getDictionary, hasLocale, href } from "@/lib/i18n";
import { products } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/collection">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).collection;
  return {
    title: t.eyebrow,
    description: t.lead,
    alternates: { canonical: `/${lang}/collection`, languages: { tr: "/tr/collection", en: "/en/collection" } },
  };
}

export default async function CollectionPage({ params }: PageProps<"/[lang]/collection">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <PageHero eyebrow={t.collection.eyebrow} title={t.collection.title} lead={t.collection.lead} image="/images/cat-kulplar.webp" />

      <section className="container-x py-20 sm:py-28">
        <Suspense fallback={<GalleryFallback products={products} t={t.collection} categories={t.categories} />}>
          <Gallery products={products} t={t.collection} categories={t.categories} />
        </Suspense>
      </section>

      <section className="bg-sand">
        <Reveal className="container-x flex flex-col items-start justify-between gap-8 py-20 md:flex-row md:items-center">
          <h2 className="display max-w-2xl text-3xl sm:text-4xl">{t.collection.ctaTitle}</h2>
          <Link href={href(lang, "/contact")} className="btn btn-ghost-dark shrink-0">
            {t.collection.ctaButton} <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
