"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { categorySlugs, type CategorySlug, type Product } from "@/lib/site";

const STEP = 24;
type Filter = "all" | CategorySlug;

export function Gallery({
  products,
  t,
  categories,
}: {
  products: Product[];
  t: Dictionary["collection"];
  categories: Dictionary["categories"];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [limit, setLimit] = useState(STEP);
  const [viewIndex, setViewIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  // Ana sayfadaki kategori kartları /collection?category=kulplar gibi gelir.
  // (#kulplar gibi hash kullanılmıyor: hedef id sayfada olmayınca Next yeni sayfayı yukarı kaydırmıyor.)
  useEffect(() => {
    const fromUrl = () => {
      const slug = new URLSearchParams(location.search).get("category") ?? "";
      if ((categorySlugs as readonly string[]).includes(slug)) {
        setFilter(slug as CategorySlug);
        setLimit(STEP);
      }
    };
    fromUrl();
  }, []);

  const choose = (f: Filter) => {
    setFilter(f);
    setLimit(STEP);
    history.replaceState(null, "", f === "all" ? location.pathname : `?category=${f}`);
  };

  const list = filter === "all" ? products : products.filter((p) => p.category === filter);
  const shown = list.slice(0, limit);

  const caption = (p: Product) =>
    `${categories[p.category].label} · ${p.kind === "application" ? t.application : p.kind === "mounting" ? t.mounting : t.product}`;

  const open = (i: number) => {
    setViewIndex(i);
    dialog.current?.showModal();
  };
  const move = useCallback((n: number) => setViewIndex((i) => (i === null ? i : (i + n + list.length) % list.length)), [list.length]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    };
    d.addEventListener("keydown", onKey);
    return () => d.removeEventListener("keydown", onKey);
  }, [move]);

  const current = viewIndex === null ? null : list[viewIndex];

  return (
    <>
      <div className="flex flex-col gap-6 border-b border-line-light pb-6 md:flex-row md:items-end md:justify-between">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0" role="group">
          {(["all", ...categorySlugs] as Filter[]).map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                onClick={() => choose(f)}
                aria-pressed={active}
                className={`shrink-0 border px-4 py-2.5 text-[0.68rem] font-semibold tracking-[0.18em] uppercase transition duration-500 ${
                  active ? "border-umber bg-umber text-ivory" : "border-line-light text-stone hover:border-umber hover:text-umber"
                }`}
              >
                {f === "all" ? t.all : categories[f].label}
              </button>
            );
          })}
        </div>
        <p className="shrink-0 text-xs tracking-wide text-stone" aria-live="polite">
          {list.length} {t.count}
        </p>
      </div>

      {filter !== "all" && <p className="mt-6 font-display text-2xl text-stone italic">{categories[filter].description}</p>}

      {/* Görsellerin oranları farklı: sütun düzeni boşluk bırakmadan dizer */}
      <div className="mt-10 columns-2 gap-4 md:columns-3 md:gap-6 xl:columns-4">
        {shown.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => open(i)}
            className="group relative mb-4 block w-full overflow-hidden bg-sand break-inside-avoid md:mb-6"
            aria-label={`${caption(p)} – ${t.view}`}
          >
            <Image
              src={p.src}
              alt={caption(p)}
              width={p.width}
              height={p.height}
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw"
              className="img-zoom h-auto w-full"
            />
            <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink/85 to-transparent p-4 pt-10 text-left text-[0.68rem] font-semibold tracking-[0.18em] text-ivory uppercase transition duration-500 group-hover:translate-y-0">
              {caption(p)}
            </span>
          </button>
        ))}
      </div>

      {limit < list.length && (
        <div className="mt-12 text-center">
          <button type="button" onClick={() => setLimit((l) => l + STEP)} className="btn btn-ghost-dark">
            {t.more}
          </button>
        </div>
      )}

      <dialog
        ref={dialog}
        onClose={() => setViewIndex(null)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto max-h-none max-w-none bg-transparent p-0 text-ivory"
        aria-label={current ? caption(current) : undefined}
      >
        {current && (
          <div className="flex h-[100svh] w-screen flex-col items-center justify-center gap-5 p-4 sm:p-10">
            <div className="flex w-full max-w-5xl items-center justify-between">
              <p className="eyebrow text-ivory/70">{caption(current)}</p>
              <button type="button" onClick={() => dialog.current?.close()} className="flex items-center gap-2 eyebrow text-ivory/70 hover:text-gold">
                {t.close} <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>
            <div className="relative min-h-0 w-full max-w-5xl flex-1">
              <Image src={current.src} alt={caption(current)} fill sizes="90vw" className="object-contain" />
            </div>
            <div className="flex items-center gap-8">
              <button type="button" onClick={() => move(-1)} className="p-2 text-ivory/70 hover:text-gold" aria-label={t.prev}>
                <ChevronLeft className="h-6 w-6" strokeWidth={1.4} />
              </button>
              <span className="font-display text-lg italic">
                {(viewIndex ?? 0) + 1} / {list.length}
              </span>
              <button type="button" onClick={() => move(1)} className="p-2 text-ivory/70 hover:text-gold" aria-label={t.next}>
                <ChevronRight className="h-6 w-6" strokeWidth={1.4} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
