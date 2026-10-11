"use client";

// "#top" bağlantısı body'ye kaydırmada güvenilir çalışmadığı için doğrudan sayfanın başına kaydırır
export function BackToTop({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="link-line text-ivory/60 hover:text-gold">
      {label}
    </button>
  );
}
