"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary, hasLocale, href } from "@/lib/i18n";

export default function NotFound() {
  const seg = usePathname().split("/")[1] ?? "";
  const lang = hasLocale(seg) ? seg : "tr";
  const t = getDictionary(lang).notFound;

  return (
    <section className="bg-ink text-ivory">
      <div className="container-x flex min-h-[80svh] flex-col items-start justify-center pt-32 pb-20">
        <p className="font-display text-8xl font-light text-gold italic">404</p>
        <h1 className="display mt-6 max-w-2xl text-4xl sm:text-5xl">{t.title}</h1>
        <p className="mt-4 text-ivory/60">{t.text}</p>
        <Link href={href(lang)} className="btn btn-ghost-light mt-10">
          {t.back}
        </Link>
      </div>
    </section>
  );
}
