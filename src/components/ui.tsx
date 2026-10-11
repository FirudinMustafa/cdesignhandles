import Image from "next/image";
import { Reveal } from "./Reveal";

/** İç sayfaların koyu başlık alanı: solda metin, arkada kararan görsel. */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  image: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink pt-40 pb-24 text-ivory sm:pt-48 sm:pb-32">
      <Image src={image} alt="" fill priority sizes="100vw" className="hero-unveil -z-10 object-cover opacity-45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
      <div className="container-x">
        <p className="hero-rise eyebrow text-gold">{eyebrow}</p>
        <h1 className="hero-rise display mt-6 max-w-4xl text-5xl sm:text-6xl lg:text-7xl" style={{ "--d": "0.15s" } as React.CSSProperties}>
          {title}
        </h1>
        {lead && (
          <p className="hero-rise mt-8 max-w-xl text-base leading-relaxed text-ivory/70" style={{ "--d": "0.3s" } as React.CSSProperties}>
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}

/** Bölüm başlığı: numaralı küçük üst başlık + iki satırlı serif başlık (ikinci satır italik altın). */
export function SectionHeading({
  eyebrow,
  a,
  b,
  lead,
  tone = "light",
  action,
}: {
  eyebrow: string;
  a: string;
  b: string;
  lead?: string;
  tone?: "light" | "dark";
  action?: React.ReactNode;
}) {
  return (
    <Reveal className="mb-14 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
      <div>
        <p className={`eyebrow ${tone === "dark" ? "text-gold" : "text-gold-dark"}`}>{eyebrow}</p>
        <h2 className="display mt-5 text-4xl sm:text-5xl lg:text-6xl">
          {a}
          <br />
          <em>{b}</em>
        </h2>
      </div>
      {(lead || action) && (
        <div className="max-w-sm md:text-right">
          {lead && <p className={`text-sm leading-relaxed ${tone === "dark" ? "text-ivory/60" : "text-stone"}`}>{lead}</p>}
          {action && <div className="mt-5">{action}</div>}
        </div>
      )}
    </Reveal>
  );
}
