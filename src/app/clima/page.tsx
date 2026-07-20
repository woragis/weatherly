import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { cityLabel, listCities } from "@/lib/cities";
import { pageMetadata, PAGE_SEO } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata("climaIndex", "/clima"),
  title: { absolute: PAGE_SEO.climaIndex.title },
};

export default function ClimaIndexPage() {
  const cities = listCities();
  const byState = new Map<string, typeof cities>();
  for (const city of cities) {
    const list = byState.get(city.state) ?? [];
    list.push(city);
    byState.set(city.state, list);
  }
  const states = [...byState.keys()].sort();

  return (
    <MarketingShell
      title="Clima por cidade"
      subtitle="Previsão nas principais cidades do Brasil"
    >
      <p className="text-sm text-white/80">
        Escolha uma cidade para ver temperatura atual, condição e próximos dias —
        páginas geradas no servidor para consulta rápida.
      </p>
      <div className="flex flex-col gap-6">
        {states.map((state) => (
          <section key={state}>
            <h2 className="mb-2 text-[0.7rem] uppercase tracking-[0.16em] text-white/55">
              {state}
            </h2>
            <ul className="flex flex-col gap-1.5">
              {(byState.get(state) ?? []).map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/clima/${city.slug}`}
                    className="block rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white transition hover:bg-white/15"
                  >
                    {cityLabel(city)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </MarketingShell>
  );
}
