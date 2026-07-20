import { WeatherIcon } from "@/components/weather-icon";
import { formatTemp, formatWeekday } from "@/lib/format";
import type { DailyPoint } from "@/lib/open-meteo";

type DailyListProps = {
  days: DailyPoint[];
};

export function DailyList({ days }: DailyListProps) {
  return (
    <section aria-label="Previsão semanal" className="daily-list">
      <h2 className="mb-3 text-[0.7rem] uppercase tracking-[0.16em] text-white/55">
        Próximos 7 dias
      </h2>
      <ul className="flex flex-col gap-0.5">
        {days.map((day, index) => (
          <li
            key={day.date}
            className="flex items-center gap-3 py-2.5 text-white/90"
          >
            <span className="w-12 text-sm font-medium text-white/80">
              {index === 0 ? "Hoje" : formatWeekday(day.date)}
            </span>
            <WeatherIcon
              name={day.condition.icon}
              className="h-5 w-5 shrink-0 opacity-85"
            />
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
  );
}
