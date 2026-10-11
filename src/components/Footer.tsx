import Image from "next/image";
import Link from "next/link";
import { href, type Dictionary, type Locale } from "@/lib/i18n";
import { company } from "@/lib/site";

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const pages = [
    { path: "/", label: t.nav.home },
    { path: "/collection", label: t.nav.collection },
    { path: "/about", label: t.nav.about },
    { path: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="bg-ink text-ivory/70">
      <div className="container-x grid gap-14 py-20 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Image src="/brand/logo-full.png" alt="C-Design Handles" width={951} height={810} className="h-auto w-36" />
          <p className="mt-8 font-display text-2xl font-light text-ivory italic">{t.footer.tagline}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">{t.footer.groups}</p>
        </div>

        <div>
          <p className="eyebrow text-gold">{t.footer.pages}</p>
          <ul className="mt-6 space-y-3 text-sm">
            {pages.map((p) => (
              <li key={p.path}>
                <Link href={href(locale, p.path)} className="transition hover:text-gold">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold">{t.footer.contact}</p>
          <ul className="mt-6 space-y-3 text-sm">
            <li>
              <a href={company.phoneHref} className="transition hover:text-gold">
                {company.phone}
              </a>
            </li>
            <li>
              <a href={company.whatsappHref} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold">
                WhatsApp · {company.whatsapp}
              </a>
            </li>
            <li>
              <a href={`mailto:${company.email}`} className="transition hover:text-gold">
                {company.email}
              </a>
            </li>
            <li className="max-w-xs leading-relaxed">{company.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="container-x flex flex-col gap-3 py-6 text-xs tracking-wide sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. {t.footer.rights} {t.footer.maker}
          </p>
          <a href="#top" className="link-line text-ivory/60 hover:text-gold">
            {t.footer.top}
          </a>
        </div>
      </div>
    </footer>
  );
}
