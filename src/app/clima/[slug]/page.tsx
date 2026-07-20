import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CityWeatherJsonLd } from "@/components/json-ld";
import { MarketingShell } from "@/components/marketing-shell";
import {
  cityAppHref,
  cityLabel,
  getCity,
  listCities,
} from "@/lib/cities";
import { formatHour, formatTemp, formatWeekday, formatWind } from "@/lib/format";
import { fetchForecast } from "@/lib/open-weather";
import { siteUrl, SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

/** SSR on demand — evita 40+ chamadas OWM no build. */
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return listCities().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: "Cidade não encontrada" };

  const label = cityLabel(city);
  const path = `/clima/${city.slug}`;
  let description = `Previsão do tempo em ${label}: temperatura atual, condição, próximas horas e 7 dias.`;
  let title = `Clima em ${city.name} (${city.state}) agora — Weatherly`;

  try {
    const weather = await fetchForecast(city.lat, city.lon);
    const temp = formatTemp(weather.current.temperature);
    const condition = weather.current.condition.label;
    title = `Clima em ${city.name} (${city.state}): ${temp} ${condition} — Weatherly`;
    description = `Agora em ${label}: ${temp}, ${condition}. Máx ${formatTemp(weather.daily[0]?.tempMax ?? weather.current.temperature)} · Mín ${formatTemp(weather.daily[0]?.tempMin ?? weather.current.temperature)}.`;
  } catch {
    // fallback genérico acima
  }

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CityWeatherPage({ params }: Props) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const label = cityLabel(city);
  const absoluteUrl = new URL(`/clima/${city.slug}`, siteUrl()).toString();

  let weather = null;
  let error: string | null = null;
  try {
    weather = await fetchForecast(city.lat, city.lon);
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Não foi possível carregar a previsão.";
  }

  return (
    <>
      <CityWeatherJsonLd
        cityName={city.name}
        state={city.state}
        url={absoluteUrl}
        temperature={weather?.current.temperature}
        condition={weather?.current.condition.label}
      />
      <MarketingShell title={`Clima em ${city.name}`} subtitle={label}>
        {error && (
          <p className="rounded-2xl border border-amber-300/40 bg-amber-400/15 p-4 text-white/90" role="alert">
            {error}
          </p>
        )}

        {weather && (
          <div className="flex flex-col gap-6">
            <section className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.14em] text-white/55">Agora</p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-6xl text-white">
                {formatTemp(weather.current.temperature)}
              </p>
              <p className="mt-1 text-lg text-white/90">
                {weather.current.condition.label}
              </p>
              <p className="mt-2 text-sm text-white/70">
                Máx {formatTemp(weather.daily[0]?.tempMax ?? weather.current.temperature)}{" "}
                · Mín {formatTemp(weather.daily[0]?.tempMin ?? weather.current.temperature)}
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-white/15 pt-4 text-center">
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-wider text-white/50">
                    Sensação
                  </dt>
                  <dd className="mt-0.5 font-medium text-white">
                    {formatTemp(weather.current.feelsLike)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-wider text-white/50">
                    Umidade
                  </dt>
                  <dd className="mt-0.5 font-medium text-white">
                    {Math.round(weather.current.humidity)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-wider text-white/50">
                    Vento
                  </dt>
                  <dd className="mt-0.5 font-medium text-white">
                    {formatWind(weather.current.windSpeed)}
                  </dd>
                </div>
              </dl>
            </section>

            <section>
              <h2 className="mb-3 text-[0.7rem] uppercase tracking-[0.16em] text-white/55">
                Próximas horas
              </h2>
              <ul className="flex gap-2 overflow-x-auto pb-1">
                {weather.hourly.slice(0, 12).map((h) => (
                  <li
                    key={h.time}
                    className="w-16 shrink-0 rounded-xl bg-white/10 px-2 py-3 text-center text-white/90"
                  >
                    <span className="block text-xs text-white/60">
                      {formatHour(h.time)}
                    </span>
                    <span className="mt-1 block text-sm font-medium">
                      {formatTemp(h.temperature)}
                    </span>
                    {h.precipitationProbability > 0 ? (
                      <span className="mt-1 block text-[0.65rem] text-sky-100/80">
                        {h.precipitationProbability}%
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-[0.7rem] uppercase tracking-[0.16em] text-white/55">
                Próximos dias
              </h2>
              <ul className="flex flex-col gap-1">
                {weather.daily.map((day, index) => (
                  <li
                    key={day.date}
                    className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-white/90"
                  >
                    <span className="w-12 text-sm font-medium">
                      {index === 0 ? "Hoje" : formatWeekday(day.date)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-white/65">
                      {day.condition.label}
                    </span>
                    <span className="text-sm tabular-nums text-white/55">
                      {formatTemp(day.tempMin)}
                    </span>
                    <span className="w-10 text-right text-sm font-medium tabular-nums">
                      {formatTemp(day.tempMax)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        <Link
          href={cityAppHref(city)}
          className="inline-flex w-fit rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/25"
        >
          Abrir no app
        </Link>

        <p className="text-sm text-white/60">
          Ver também{" "}
          <Link href="/clima" className="underline hover:text-white">
            todas as cidades
          </Link>{" "}
          ou o{" "}
          <Link href="/blog" className="underline hover:text-white">
            blog
          </Link>
          .
        </p>
      </MarketingShell>
    </>
  );
}
