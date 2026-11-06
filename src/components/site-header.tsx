import Link from "next/link";
import { HomeNav } from "@/components/home-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="page-frame flex flex-wrap items-center gap-x-6 gap-y-2 py-4">
      <Link
        href="/"
        aria-label="MA, Meo Angelo Alcantara, home"
        className="inline-flex size-11 items-center justify-center rounded-md border border-border text-sm font-semibold transition-colors duration-200 ease-out hover:text-primary motion-reduce:transition-none"
      >
        MA
      </Link>
      <HomeNav />
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
