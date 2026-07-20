export function formatTemp(value: number): string {
  return `${Math.round(value)}°`;
}

export function formatHour(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function formatWeekday(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  const label = d.toLocaleDateString("pt-BR", { weekday: "short" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatWind(kmh: number): string {
  return `${Math.round(kmh)} km/h`;
}
