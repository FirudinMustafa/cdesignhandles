"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { href, type Dictionary, type Locale } from "@/lib/i18n";

export function Header({ locale, t }: { locale: Locale; t: Dictionary["nav"] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { path: "/", label: t.home },
    { path: "/collection", label: t.collection },
    { path: "/about", label: t.about },
    { path: "/contact", label: t.contact },
  ];
  const current = pathname.replace(/^\/(tr|en)/, "") || "/";
  const other: Locale = locale === "tr" ? "en" : "tr";
  const switchHref = href(other, current);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled || open ? "bg-ink/95 py-3 shadow-[0_1px_0_rgba(197,169,121,0.15)] backdrop-blur" : "bg-transparent py-6"
      }`}
    >
      <div className="container-x flex items-center justify-between gap-6 text-ivory">
        <Logo locale={locale} />

        <nav className="hidden items-center gap-10 lg:flex" aria-label={t.menu}>
          {items.map((item) => {
            const active = current === item.path;
            return (
              <Link
                key={item.path}
                href={href(locale, item.path)}
                className={`relative text-[0.7rem] font-semibold tracking-[0.24em] uppercase transition-colors hover:text-gold ${
                  active ? "text-gold" : "text-ivory/80"
                }`}
              >
                {item.label}
                {active && <span className="absolute inset-x-0 -bottom-2 mx-auto h-px w-4 bg-gold" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href={switchHref}
            hrefLang={other}
            className="text-[0.68rem] font-semibold tracking-[0.24em] text-ivory/70 uppercase transition hover:text-gold"
            aria-label={t.switchTo}
          >
            {other}
          </Link>
          <Link href={href(locale, "/contact")} className="btn btn-gold hidden !px-5 !py-3 md:inline-flex">
            {t.cta}
          </Link>
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t.close : t.menu}
          >
            {open ? <X className="h-6 w-6" strokeWidth={1.4} /> : <Menu className="h-6 w-6" strokeWidth={1.4} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="container-x flex flex-col gap-1 pt-6 pb-8 lg:hidden" aria-label={t.menu}>
          {items.map((item) => (
            <Link
              key={item.path}
              href={href(locale, item.path)}
              onClick={() => setOpen(false)}
              className={`border-b border-line-dark py-4 font-display text-3xl font-light ${
                current === item.path ? "text-gold" : "text-ivory"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href={href(locale, "/contact")} onClick={() => setOpen(false)} className="btn btn-gold mt-6">
            {t.cta}
          </Link>
        </nav>
      )}
    </header>
  );
}
