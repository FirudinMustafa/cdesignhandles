// Hostinger sunucusunda Next'in yerel SWC derleyicisi çalışmıyor (eski glibc), WebAssembly yedeğine düşüyor.
// Yedek derleyici TypeScript config'i okuyamadığı için bu dosya düz JS; build de Webpack ile alınıyor.
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
