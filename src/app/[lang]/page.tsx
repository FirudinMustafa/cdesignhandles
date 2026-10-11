import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/ui";
import { getDictionary, hasLocale, href } from "@/lib/i18n";
import { categoryImage, categorySlugs, countByCategory, featured } from "@/lib/site";
import { notFound } from "next/navigation";

const delay = (d: number) => ({ "--d": `${d}s` }) as React.CSSProperties;

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const h = t.home;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-ink text-ivory">
        <div className="container-x grid min-h-[100svh] items-center gap-12 pt-32 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:pt-28">
          <div>
            <p className="hero-rise eyebrow text-gold">{h.eyebrow}</p>
            <h1 className="hero-rise display mt-8 text-[3.2rem] sm:text-7xl xl:text-[5.6rem]" style={delay(0.15)}>
              {h.titleA}
              <br />
              <em>{h.titleB}</em>
            </h1>
            <p className="hero-rise mt-8 max-w-md text-base leading-relaxed text-ivory/65" style={delay(0.3)}>
              {h.lead}
            </p>
            <div className="hero-rise mt-12 flex flex-wrap gap-4" style={delay(0.45)}>
              <Link href={href(lang, "/collection")} className="btn btn-gold">
                {h.ctaPrimary} <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link href={href(lang, "/about")} className="btn btn-ghost-light">
                {h.ctaSecondary}
              </Link>
            </div>
            <div className="hero-rise mt-16 flex gap-10 border-t border-line-dark pt-6" style={delay(0.6)}>
              {h.pillars.map((p, i) => (
                <span key={p} className="eyebrow text-ivory/50">
                  <span className="text-gold">0{i + 1}</span> {p}
                </span>
              ))}
            </div>
          </div>

          <div className="relative h-[60vh] lg:h-[78vh]">
            <div className="hero-unveil absolute inset-0 overflow-hidden">
              <Image
                src="/images/hero.webp"
                alt={t.categories.kulplar.label}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            {/* İnce altın çerçeve, görselin dışına taşan */}
            <div className="pointer-events-none absolute -inset-4 hidden border border-gold/25 lg:block" />
            <span className="absolute bottom-6 left-6 eyebrow bg-ink/70 px-4 py-2 text-ivory/80 backdrop-blur">
              {t.categories.kulplar.label} · {h.applications[0]}
            </span>
          </div>
        </div>
      </section>

      {/* ---------- Kayan ürün grubu şeridi ---------- */}
      <div className="overflow-hidden border-y border-line-dark bg-ink-2 py-6 text-ivory/70" aria-hidden="true">
        <div className="marquee flex w-max gap-12 whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-12">
              {categorySlugs.map((slug) => (
                <span key={slug} className="flex items-center gap-12 font-display text-2xl font-light italic">
                  {t.categories[slug].label}
                  <span className="text-xs text-gold not-italic">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Koleksiyon / kategoriler ---------- */}
      <section className="container-x py-28 sm:py-36">
        <SectionHeading eyebrow={h.collectionEyebrow} a={h.collectionTitleA} b={h.collectionTitleB} lead={h.collectionLead} />
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {categorySlugs.map((slug, i) => (
            <Reveal key={slug} delay={(i % 3) * 0.12}>
              <Link href={`${href(lang, "/collection")}?category=${slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                  <Image
                    src={categoryImage[slug]}
                    alt={t.categories[slug].label}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    className="img-zoom object-cover"
                  />
                  <span className="absolute top-5 left-5 font-display text-lg text-ivory italic drop-shadow">0{i + 1}</span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl">{t.categories[slug].label}</h3>
                    <p className="mt-1 text-sm text-stone">{t.categories[slug].description}</p>
                  </div>
                  <span className="mt-1 flex shrink-0 items-center gap-1 text-xs text-gold-dark">
                    {countByCategory(slug)} {h.images}
                    <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.4} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Miras ---------- */}
      <section className="bg-sand">
        <div className="container-x grid items-center gap-16 py-28 sm:py-36 lg:grid-cols-2 lg:gap-24">
          <Reveal className="relative pb-16 lg:pb-24">
            <div className="relative aspect-[4/5] w-4/5 overflow-hidden">
              <Image src="/images/about-craft.webp" alt="" fill sizes="(min-width: 1024px) 36vw, 80vw" className="object-cover" />
            </div>
            <div className="absolute right-0 bottom-0 aspect-square w-1/2 overflow-hidden border-8 border-sand">
              <Image src="/images/about-detail.webp" alt="" fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow={h.heritageEyebrow} a={h.heritageTitleA} b={h.heritageTitleB} />
            <Reveal>
              <p className="-mt-6 max-w-lg leading-relaxed text-stone">{h.heritageText}</p>
              <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line-light pt-8">
                {h.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-display text-4xl font-light text-umber sm:text-5xl">{s.value}</dd>
                    <dd className="mt-2 text-xs tracking-wide text-stone">{s.label}</dd>
                  </div>
                ))}
              </dl>
              <Link href={href(lang, "/about")} className="link-line mt-12 text-umber">
                {h.heritageLink} <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Seçki ---------- */}
      <section className="container-x py-28 sm:py-36">
        <SectionHeading
          eyebrow={h.featuredEyebrow}
          a={h.featuredTitleA}
          b={h.featuredTitleB}
          action={
            <Link href={href(lang, "/collection")} className="link-line text-umber">
              {h.featuredLink} <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {featured.map((src, i) => (
            <Reveal key={src} delay={(i % 4) * 0.1} className={i % 4 === 1 || i % 4 === 3 ? "md:mt-16" : ""}>
              <Link href={href(lang, "/collection")} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                  <Image src={src} alt="" fill sizes="(min-width: 768px) 24vw, 50vw" className="img-zoom object-cover" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Uygulamalar ---------- */}
      <section className="bg-ink text-ivory">
        <div className="container-x py-28 sm:py-36">
          <SectionHeading tone="dark" eyebrow={h.applicationsEyebrow} a={h.applicationsTitleA} b={h.applicationsTitleB} />
          <div className="grid gap-6 md:grid-cols-3">
            {(["app-dolap", "app-kapi", "app-sehpa"] as const).map((img, i) => (
              <Reveal key={img} delay={i * 0.15} as="figure" className="group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src={`/images/${img}.webp`} alt={h.applications[i]} fill sizes="(min-width: 768px) 32vw, 100vw" className="img-zoom object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                </div>
                <figcaption className="mt-5 flex items-center gap-4">
                  <span className="font-display text-gold italic">0{i + 1}</span>
                  <span className="eyebrow text-ivory/80">{h.applications[i]}</span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Çağrı ---------- */}
      <section className="container-x py-28 text-center sm:py-36">
        <Reveal>
          <p className="eyebrow text-gold-dark">{h.ctaEyebrow}</p>
          <h2 className="display mx-auto mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">{h.ctaTitle}</h2>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-stone">{h.ctaText}</p>
          <Link href={href(lang, "/contact")} className="btn btn-ghost-dark mt-10">
            {h.ctaButton} <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
