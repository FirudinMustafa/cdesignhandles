import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/ui";
import { getDictionary, hasLocale, href } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).about;
  return {
    title: t.eyebrow,
    description: t.paragraphs[0].slice(0, 160),
    alternates: { canonical: `/${lang}/about`, languages: { tr: "/tr/about", en: "/en/about" } },
  };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const a = t.about;

  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title} image="/images/about-kitchen.webp" />

      {/* ---------- Hikaye ---------- */}
      <section className="container-x grid gap-16 py-28 sm:py-36 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden bg-sand">
            <Image src="/images/about-craft.webp" alt="" fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
          </div>
          <p className="mt-6 flex items-baseline gap-4">
            <span className="font-display text-6xl font-light text-gold-dark">1971</span>
            <span className="text-xs tracking-wide text-stone">CNC · {lang === "tr" ? "Otomat · Torna" : "Automatic lathe · Turning"}</span>
          </p>
        </Reveal>

        <div className="space-y-8">
          {a.paragraphs.map((p, i) => (
            <Reveal key={i}>
              <p
                className={
                  i === 0
                    ? "font-display text-2xl leading-snug font-light text-umber sm:text-3xl"
                    : "text-[1.02rem] leading-[1.9] text-stone"
                }
              >
                {p}
              </p>
            </Reveal>
          ))}
          <Reveal>
            <blockquote className="mt-12 border-l border-gold pl-8">
              <p className="display text-3xl sm:text-4xl">
                <em>{a.motto}</em>
              </p>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ---------- Vizyon & misyon ---------- */}
      <section className="bg-ink text-ivory">
        <div className="container-x grid gap-px bg-line-dark py-0 md:grid-cols-2">
          {[
            { title: a.visionTitle, text: a.vision, n: "01" },
            { title: a.missionTitle, text: a.mission, n: "02" },
          ].map((item, i) => (
            <Reveal key={item.n} delay={i * 0.15} className="bg-ink py-20 md:px-12 md:py-28 lg:px-16">
              <span className="font-display text-xl text-gold italic">{item.n}</span>
              <h2 className="display mt-6 text-4xl sm:text-5xl">{item.title}</h2>
              <p className="mt-8 max-w-lg leading-[1.9] text-ivory/65">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- İlkeler ---------- */}
      <section className="container-x py-28 sm:py-36">
        <Reveal>
          <p className="eyebrow text-gold-dark">{a.principlesEyebrow}</p>
        </Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
          {a.principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.12} className="border-t border-line-light pt-8">
              <span className="font-display text-lg text-gold-dark italic">0{i + 1}</span>
              <h3 className="mt-4 font-display text-3xl">{p.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-stone">{p.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-20">
          <Link href={href(lang, "/collection")} className="btn btn-ghost-dark">
            {t.home.ctaPrimary} <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
