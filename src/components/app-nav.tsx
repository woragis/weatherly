"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { placeQuery, type Place } from "@/hooks/use-place";

const ITEMS = [
  { href: "/", label: "Início" },
  { href: "/detalhes", label: "Detalhes" },
  { href: "/radar", label: "Radar" },
  { href: "/cidades", label: "Cidades" },
  { href: "/alertas", label: "Alertas" },
  { href: "/config", label: "Ajustes" },
];

type AppNavProps = {
  place?: Place | null;
};

export function AppNav({ place }: AppNavProps) {
  const pathname = usePathname();
  const query = place ? `?${placeQuery(place)}` : "";

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-4 z-30 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-0.5 overflow-x-auto rounded-full border border-white/20 bg-slate-900/70 px-2 py-1.5 shadow-lg backdrop-blur-md"
    >
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        const needsPlace = item.href !== "/config" && item.href !== "/cidades";
        return (
          <Link
            key={item.href}
            href={needsPlace ? `${item.href}${query}` : item.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-white/20 text-white"
                : "text-white/65 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
