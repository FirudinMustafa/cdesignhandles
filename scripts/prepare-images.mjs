// Kaynak siteden indirilen görselleri (../kaynak) web için hazırlar:
// - ürün görselleri → public/images/products/<kategori>-<no>.webp + src/lib/catalog.generated.json
// - sayfa görselleri → public/images/<ad>.webp
// - logo (siyah zeminli) → şeffaf PNG parçaları: public/brand/*
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "../kaynak";
const catalog = JSON.parse(fs.readFileSync(path.join(SRC, "catalog.json"), "utf8"));
const MAX = 1600;

fs.mkdirSync("public/images/products", { recursive: true });
fs.mkdirSync("public/brand", { recursive: true });

async function toWebp(file, out) {
  const { info } = await sharp(path.join(SRC, file))
    .resize(MAX, MAX, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out)
    .then((info) => ({ info }));
  return { width: info.width, height: info.height };
}

// Ürünler: kaynak sıradaki kategori içi numarayla adlandırılır
const counters = {};
const products = [];
for (const item of catalog.images) {
  const n = String((counters[item.category] = (counters[item.category] ?? 0) + 1)).padStart(2, "0");
  const name = `${item.category}-${n}.webp`;
  const size = await toWebp(item.image, `public/images/products/${name}`);
  // Kaynakta başlık "Kulplar · Uygulama" biçiminde; ikinci kısım görselin türü
  const kind = item.title.includes("Uygulama") ? "application" : item.title.includes("Montaj") ? "mounting" : "product";
  products.push({ src: `/images/products/${name}`, category: item.category, kind, ...size, source: item.image });
}
fs.writeFileSync("src/lib/catalog.generated.json", JSON.stringify(products, null, 1));
console.log(products.length, "ürün görseli");

// Sayfa görselleri (kaynak sitenin ana sayfasında kullanılanlar + seçilmiş ürün çekimleri)
const pageImages = {
  "hero": "assets/image-42.jpeg",
  "cat-kulplar": "assets/image-6.jpeg",
  "cat-t-kulplar": "assets/image-44.jpeg",
  "cat-topuzlar": "assets/image-73.jpeg",
  "cat-paslanmaz": "assets/image-56.jpeg",
  "cat-normal": "assets/image-63.jpeg",
  "cat-sehpa": "assets/image-22.jpeg",
  "app-dolap": "assets/image-71.jpeg",
  "app-kapi": "assets/image-36.jpeg",
  "app-sehpa": "assets/image-24.jpeg",
  "about-craft": "assets/image-12.jpeg",
  "about-detail": "assets/image-72.jpeg",
  "about-kitchen": "assets/image-29.jpeg",
  "contact": "assets/image-35.jpeg",
  "technical": "assets/image-43.jpeg",
};
for (const [name, file] of Object.entries(pageImages)) await toWebp(file, `public/images/${name}.webp`);
console.log(Object.keys(pageImages).length, "sayfa görseli");

// Logo: gümüş metal, siyah zemin → parlaklık alfa olur, renk "siyah zeminden arındırılır"
const BG = 8;
const smooth = (lo, hi, v) => { const t = Math.min(1, Math.max(0, (v - lo) / (hi - lo))); return t * t * (3 - 2 * t); };
const { data, info } = await sharp(path.join(SRC, "assets/image-49.png")).removeAlpha().raw().toBuffer({ resolveWithObject: true });
async function logoPart([x0, y0, w, h], out) {
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = ((y0 + y) * info.width + (x0 + x)) * info.channels;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const a = smooth(14, 90, Math.max(r, g, b));
    if (a <= 0.01) continue;
    const un = (c) => Math.min(255, Math.max(0, Math.round((c - (1 - a) * BG) / a)));
    const o = (y * w + x) * 4;
    buf[o] = un(r); buf[o + 1] = un(g); buf[o + 2] = un(b); buf[o + 3] = Math.round(a * 255);
  }
  const res = await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
  await sharp(res.data).toFile(out);
  console.log(out, `${res.info.width}x${res.info.height}`);
}
await logoPart([0, 0, info.width, info.height], "public/brand/logo-full.png");
await logoPart([300, 200, 660, 560], "public/brand/monogram.png");
await logoPart([120, 820, 1020, 240], "public/brand/wordmark.png");

// Site ikonları: monogram, koyu zemin
const mono = await sharp("public/brand/monogram.png").resize(400, 400, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#0e0d0c" } })
  .composite([{ input: mono, gravity: "center" }]).png().toFile("src/app/icon.png");
await sharp("src/app/icon.png").resize(180, 180).png().toFile("src/app/apple-icon.png");
// Sosyal paylaşım görseli
await sharp(path.join(SRC, "assets/image-49.png")).resize(1200, 630, { fit: "contain", background: "#000" }).jpeg({ quality: 85 }).toFile("public/images/og.jpg");
