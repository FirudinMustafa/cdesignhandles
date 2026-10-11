import Image from "next/image";
import Link from "next/link";
import { href, type Locale } from "@/lib/i18n";

// Logo parçaları kaynak logodan (siyah zeminli) şeffaf olarak çıkarıldı: bkz. scripts/prepare-images.mjs
export function Logo({ locale, className = "" }: { locale: Locale; className?: string }) {
  return (
    <Link href={href(locale)} aria-label="C-Design Handles" className={`flex items-center gap-3 ${className}`}>
      <Image src="/brand/monogram.png" alt="" width={586} height={528} priority className="h-9 w-auto" />
      <Image src="/brand/wordmark.png" alt="C-Design Handles" width={951} height={199} priority className="hidden h-[26px] w-auto sm:block" />
    </Link>
  );
}
