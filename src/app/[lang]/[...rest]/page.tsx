import { notFound } from "next/navigation";

// Tanımsız adresler dilin kendi 404 sayfasını (header/footer ile) göstersin
export default function CatchAll() {
  notFound();
}
