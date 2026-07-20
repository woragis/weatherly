"use client";

import { PageShell } from "@/components/page-shell";
import { usePlace } from "@/hooks/use-place";
import { useDetails } from "@/hooks/use-details";
import { useWeather } from "@/hooks/use-weather";
import { formatHour } from "@/lib/format";
import { useUnits } from "@/lib/settings";

const AQI_COLORS: Record<number, string> = {
  1: "bg-emerald-400/80",
  2: "bg-lime-400/80",
  3: "bg-amber-400/80",
  4: "bg-orange-500/80",
  5: "bg-red-500/80",
};

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
      <h2 className="mb-3 text-[0.7rem] uppercase tracking-[0.16em] text-white/55">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function DetailsScreen() {
  const { place, pending, errorMessage } = usePlace();
  const lat = place?.latitude ?? null;
  const lon = place?.longitude ?? null;
  const { weather } = useWeather(lat, lon);
  const { details, error, loading } = useDetails(lat, lon);
  const { formatTemp, formatWind } = useUnits();

  const theme = weather?.current.condition.theme ?? "cloudy";
  const isDay = weather?.current.isDay ?? true;
  const cityLabel =
    place?.label === "Sua localização"
      ? (weather?.locationName ?? place.label)
      : place?.label;

  return (
    <PageShell
      title="Detalhes do dia"
      subtitle={cityLabel}
      theme={theme}
      isDay={isDay}
      place={place}
    >
      {(pending || loading) && !errorMessage && (
        <p className="text-white/70" aria-busy="true">
          Carregando detalhes…
        </p>
      )}
      {(errorMessage || error) && (
        <p className="text-white/80" role="alert">
          {errorMessage ?? error}
        </p>
      )}

      {details && (
        <div className="flex flex-col gap-4">
          <Card title="Qualidade do ar">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-slate-900 ${AQI_COLORS[details.aqi.index] ?? "bg-white/40"}`}
              >
                {details.aqi.index}
              </span>
              <div>
                <p className="text-lg font-medium text-white">{details.aqi.label}</p>
                <p className="text-xs text-white/60">Escala OWM (1 boa — 5 muito ruim)</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-4 gap-2 text-center">
              {[
                ["PM2.5", details.aqi.pm25],
                ["PM10", details.aqi.pm10],
                ["O₃", details.aqi.o3],
                ["NO₂", details.aqi.no2],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <dt className="text-[0.65rem] uppercase tracking-wider text-white/50">
                    {label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-white tabular-nums">
                    {Math.round(value as number)}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-right text-[0.6rem] text-white/40">μg/m³</p>
          </Card>

          <Card title="Índice UV">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-[family-name:var(--font-display)] text-4xl text-white">
                  {details.uv.current}
                </p>
                <p className="text-sm text-white/70">agora · {details.uv.label}</p>
              </div>
              <p className="text-sm text-white/60">máx do dia: {details.uv.max}</p>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500"
                style={{ width: `${Math.min((details.uv.max / 12) * 100, 100)}%` }}
              />
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card title="Sol">
              <p className="text-sm text-white/70">Nascer</p>
              <p className="text-xl font-medium text-white">
                {formatHour(details.sun.sunrise)}
              </p>
              <p className="mt-2 text-sm text-white/70">Pôr</p>
              <p className="text-xl font-medium text-white">
                {formatHour(details.sun.sunset)}
              </p>
            </Card>
            <Card title="Lua">
              <p className="text-3xl">{details.moon.emoji}</p>
              <p className="mt-1 text-sm font-medium text-white">{details.moon.label}</p>
              <p className="text-xs text-white/60">
                {details.moon.illumination}% iluminada
              </p>
            </Card>
          </div>

          <Card title="Condições">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                ["Sensação", formatTemp(details.conditions.feelsLike)],
                ["Umidade", `${Math.round(details.conditions.humidity)}%`],
                ["Vento", formatWind(details.conditions.windSpeed)],
                ["Pressão", `${details.conditions.pressure} hPa`],
                ["Visibilidade", `${details.conditions.visibility} km`],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[0.65rem] uppercase tracking-wider text-white/50">
                    {label}
                  </dt>
                  <dd className="mt-0.5 text-base font-medium text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      )}
    </PageShell>
  );
}
