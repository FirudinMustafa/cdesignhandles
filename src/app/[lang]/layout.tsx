import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import { company } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin", "latin-ext"] });

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(company.siteUrl),
    title: { default: t.meta.title, template: "%s | C-Design Handles" },
    description: t.meta.description,
    alternates: { canonical: `/${lang}`, languages: { tr: "/tr", en: "/en" } },
    openGraph: {
      type: "website",
      locale: t.meta.ogLocale,
      siteName: "C-Design Handles",
      images: ["/images/og.jpg"],
    },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    // data-scroll-behavior: CSS'teki smooth kaydırma sayfa geçişlerinde kapatılsın; yoksa yeni sayfa
    // yukarı kaydırılırken yarıda kalıyor ve footer'daki linkler sayfayı altta açıyor (Next 16 değişikliği)
    <html lang={lang} data-scroll-behavior="smooth" className={`${cormorant.variable} ${manrope.variable} antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header locale={lang} t={t.nav} />
        <main className="flex-1">{children}</main>
        <Footer locale={lang} t={t} />
      </body>
    </html>
  );
}
