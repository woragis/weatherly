import { formatTemp, formatWind } from "@/lib/format";
import type { CurrentWeather } from "@/lib/open-meteo";

type MetricsRowProps = {
  current: CurrentWeather;
};

export function MetricsRow({ current }: MetricsRowProps) {
  const items = [
    { label: "Sensação", value: formatTemp(current.feelsLike) },
    { label: "Umidade", value: `${Math.round(current.humidity)}%` },
    { label: "Vento", value: formatWind(current.windSpeed) },
  ];

  return (
    <section
      aria-label="Métricas atuais"
      className="metrics-row grid grid-cols-3 gap-3 border-y border-white/15 py-4"
    >
      {items.map((item) => (
        <div key={item.label} className="text-center sm:text-left">
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-white/55">
            {item.label}
          </p>
          <p className="mt-1 text-lg font-medium text-white sm:text-xl">
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
