"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Links SEO/marketing discretos (fora da nav de features do app). */
export function SiteLinks() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Explorar e blog"
      className="flex items-center justify-center gap-4 text-xs text-white/60"
    >
      <Link
        href="/clima"
        className={`transition hover:text-white ${
          pathname.startsWith("/clima") ? "text-white/90" : ""
        }`}
      >
        Clima por cidade
      </Link>
      <span aria-hidden className="text-white/30">
        ·
      </span>
      <Link
        href="/blog"
        className={`transition hover:text-white ${
          pathname.startsWith("/blog") ? "text-white/90" : ""
        }`}
      >
        Blog
      </Link>
    </nav>
  );
}
