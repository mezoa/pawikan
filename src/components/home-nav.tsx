"use client";

import { usePathname } from "next/navigation";

const sections = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#publication", label: "Publication" },
  { href: "#contact", label: "Contact" },
];

// These anchors only exist on the home page, so other pages show no links.
export function HomeNav() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <nav
      aria-label="Page sections"
      className="order-last w-full sm:order-none sm:w-auto"
    >
      <ul className="flex flex-wrap gap-x-5 gap-y-1">
        {sections.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              className="inline-flex min-h-6 items-center rounded-sm transition-colors duration-200 hover:text-primary motion-reduce:transition-none"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
