import { tr } from "@/dictionaries/tr";
import { en } from "@/dictionaries/en";

export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

const dictionaries = { tr, en };
export type Dictionary = typeof tr;

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);
export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

/** Sayfa yolunu dile göre kurar: href("tr", "/collection") → "/tr/collection" */
export const href = (locale: Locale, path = "") => `/${locale}${path === "/" ? "" : path}`;
