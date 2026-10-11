import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale } from "@/lib/i18n";

// Dil öneki olmayan adresleri (/, /collection …) tarayıcı diline göre /tr veya /en altına yönlendirir.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (hasLocale(pathname.split("/")[1] ?? "")) return;

  const preferred = request.headers.get("accept-language") ?? "";
  // Türkçe istenmiyor ve İngilizce isteniyorsa İngilizce, aksi halde varsayılan Türkçe
  const locale = /(^|,)\s*tr\b/i.test(preferred) || !/(^|,)\s*en\b/i.test(preferred) ? defaultLocale : "en";

  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Statik dosyalar, görseller, ikonlar ve SEO dosyaları yönlendirilmez
  matcher: ["/((?!_next|images|brand|icon.png|apple-icon.png|favicon.ico|robots.txt|sitemap.xml).*)"],
};
