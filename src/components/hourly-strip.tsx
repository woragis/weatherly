"use client";

import { WeatherIcon } from "@/components/weather-icon";
import { formatHour } from "@/lib/format";
import { useUnits } from "@/lib/settings";
import type { HourlyPoint } from "@/lib/open-weather";

type HourlyStripProps = {
  hours: HourlyPoint[];
};

export function HourlyStrip({ hours }: HourlyStripProps) {
  const { formatTemp } = useUnits();

  return (
    <section aria-label="Previsão por hora" className="hourly-strip">
      <h2 className="mb-3 text-[0.7rem] uppercase tracking-[0.16em] text-white/55">
        Próximas horas
      </h2>
      <div className="hourly-scroll -mx-1 flex gap-1 overflow-x-auto pb-2">
        {hours.map((h) => (
          <div
            key={h.time}
            className="flex w-16 shrink-0 flex-col items-center gap-1.5 px-1 py-1 text-white/90"
          >
            <span className="text-xs text-white/60">{formatHour(h.time)}</span>
            <WeatherIcon name={h.condition.icon} className="h-5 w-5 opacity-85" />
            <span className="text-sm font-medium">{formatTemp(h.temperature)}</span>
            {h.precipitationProbability > 0 && (
              <span className="text-[0.65rem] text-sky-100/80">
                {h.precipitationProbability}%
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
