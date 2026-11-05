import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="page-frame flex items-center justify-between py-4">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-sm font-medium hover:text-primary"
      >
        Meo Angelo Alcantara
      </Link>
      <ThemeToggle />
    </header>
  );
}
