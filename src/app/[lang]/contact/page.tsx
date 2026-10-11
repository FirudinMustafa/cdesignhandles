import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/ui";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { company } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).contact;
  return {
    title: t.eyebrow,
    description: t.lead,
    alternates: { canonical: `/${lang}/contact`, languages: { tr: "/tr/contact", en: "/en/contact" } },
  };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = getDictionary(lang).contact;

  const items = [
    { icon: Phone, label: c.phone, value: company.phone, href: company.phoneHref },
    { icon: MessageCircle, label: c.whatsapp, value: company.whatsapp, href: company.whatsappHref },
    { icon: Mail, label: c.email, value: company.email, href: `mailto:${company.email}` },
    { icon: MapPin, label: c.address, value: company.address },
  ];

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} image="/images/contact.webp" />

      <section className="container-x grid gap-20 py-28 sm:py-36 lg:grid-cols-[0.8fr_1.2fr] lg:gap-28">
        <Reveal>
          <ul className="divide-y divide-line-light border-y border-line-light">
            {items.map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <>
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-gold-dark" strokeWidth={1.3} />
                  <span>
                    <span className="eyebrow block text-stone">{label}</span>
                    <span className="mt-2 block text-[1.02rem] text-umber">{value}</span>
                  </span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex gap-5 py-7 transition hover:text-gold-dark"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex gap-5 py-7">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <h2 className="display mb-12 text-4xl sm:text-5xl">{c.form.title}</h2>
          <ContactForm locale={lang} t={c.form} />
        </Reveal>
      </section>

      <section className="h-[440px] bg-sand">
        <iframe
          title={c.mapTitle}
          src={`https://www.google.com/maps?q=${encodeURIComponent(company.mapQuery)}&output=embed`}
          className="h-full w-full grayscale-[0.85] sepia-[0.15]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
