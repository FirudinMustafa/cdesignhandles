"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Sayfa geçişlerinde yeni sayfanın her zaman en üstten açılmasını garanti eder.
 * Next'in kendi kaydırması iki durumda yetersiz kalıyordu:
 *  - uzun sayfanın altından geçişte, görseller yüklenmeden ölçüm yaptığı için sayfa biraz aşağıda açılıyordu;
 *  - bulunulan sayfanın linkine tıklanınca hiç kaydırmıyordu.
 * Geri/ileri tuşlarında tarayıcının hatırladığı konuma dokunulmaz.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPop = () => (fromHistory.current = true);
    window.addEventListener("popstate", onPop);

    // Bulunulan sayfanın linkine tıklanınca başa kaydır
    // (defaultPrevented'a bakılmaz: Next'in <Link>'i istemci geçişi için tıklamayı zaten engelliyor)
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a");
      if (!a || a.target === "_blank" || a.origin !== location.origin || a.hash) return;
      if (a.pathname === location.pathname) window.scrollTo({ top: 0, behavior: "instant" });
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useLayoutEffect(() => {
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    if (!location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
