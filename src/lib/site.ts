import catalog from "./catalog.generated.json";

// Telefon ve WhatsApp üretici firma Alevsan ile ortak; e-posta ve adres C-Design'a ait.
export const company = {
  name: "C-Design Handles",
  maker: "Alevsan Torna Sanayi ve Ticaret Ltd. Şti.",
  founded: 1971,
  phone: "0216 471 00 06",
  phoneHref: "tel:+902164710006",
  whatsapp: "+90 535 637 37 37",
  whatsappHref: "https://wa.me/905356373737",
  email: "c-designhandles@hotmail.com",
  address: "İMES Sanayi Sitesi C Blok 207. Sokak No:15/3, Ümraniye / İstanbul",
  mapQuery: "İMES Sanayi Sitesi C Blok 207. Sokak 15, Ümraniye, İstanbul",
  siteUrl: "https://cdesignhandles.com",
};

export const categorySlugs = ["kulplar", "t-kulplar", "topuzlar", "paslanmaz", "normal", "sehpa"] as const;
export type CategorySlug = (typeof categorySlugs)[number];

export type Product = {
  src: string;
  category: CategorySlug;
  kind: "product" | "application" | "mounting";
  width: number;
  height: number;
};

export const products = catalog as Product[];

export const categoryImage: Record<CategorySlug, string> = {
  kulplar: "/images/cat-kulplar.webp",
  "t-kulplar": "/images/cat-t-kulplar.webp",
  topuzlar: "/images/cat-topuzlar.webp",
  paslanmaz: "/images/cat-paslanmaz.webp",
  normal: "/images/cat-normal.webp",
  sehpa: "/images/cat-sehpa.webp",
};

export const countByCategory = (slug: CategorySlug) => products.filter((p) => p.category === slug).length;

// Ana sayfadaki seçki: farklı kategorilerden, farklı yüzeylerden
export const featured = [
  "/images/products/kulplar-03.webp",
  "/images/products/topuzlar-17.webp",
  "/images/products/paslanmaz-02.webp",
  "/images/products/topuzlar-12.webp",
  "/images/products/kulplar-08.webp",
  "/images/products/normal-03.webp",
  "/images/products/topuzlar-18.webp",
  "/images/products/sehpa-02.webp",
];
