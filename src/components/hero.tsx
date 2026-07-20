import { WeatherIcon } from "@/components/weather-icon";
import { formatTemp } from "@/lib/format";
import type { CurrentWeather } from "@/lib/open-weather";

type HeroProps = {
  city: string;
  current: CurrentWeather;
  high: number;
  low: number;
};

export function Hero({ city, current, high, low }: HeroProps) {
  return (
    <header className="hero-block flex flex-col items-start gap-3 pt-2">
      <p className="brand-mark font-[family-name:var(--font-display)] text-3xl tracking-tight text-white sm:text-4xl">
        Weatherly
      </p>
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
        {city}
      </p>
      <div className="flex items-end gap-4">
        <p className="font-[family-name:var(--font-display)] text-7xl leading-none tracking-tight text-white sm:text-8xl">
          {formatTemp(current.temperature)}
        </p>
        <div className="mb-2 flex flex-col gap-1 text-white/90">
          <WeatherIcon
            name={current.condition.icon}
            className="h-10 w-10 opacity-90"
          />
          <p className="text-base font-medium sm:text-lg">
            {current.condition.label}
          </p>
        </div>
      </div>
      <p className="text-sm text-white/75">
        Máx {formatTemp(high)} · Mín {formatTemp(low)}
      </p>
    </header>
  );
}
