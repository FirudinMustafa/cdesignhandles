import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { company } from "@/lib/site";

const paths = ["", "/collection", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${company.siteUrl}/${lang}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${company.siteUrl}/${l}${path}`])) },
    })),
  );
}
