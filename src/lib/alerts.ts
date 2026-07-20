/** Alertas derivados localmente da previsão + detalhes (sem push server-side). */

import type { WeatherPayload } from "@/lib/open-weather";
import type { DetailsPayload } from "@/lib/details";

export type AlertKind = "rain" | "wind" | "uv" | "temp";

export type WeatherAlert = {
  kind: AlertKind;
  severity: "info" | "warning";
  title: string;
  description: string;
};

export type AlertPrefs = Record<AlertKind, boolean>;

export const DEFAULT_ALERT_PREFS: AlertPrefs = {
  rain: true,
  wind: true,
  uv: true,
  temp: true,
};

export const ALERT_PREF_LABELS: Record<AlertKind, { label: string; description: string }> = {
  rain: { label: "Chuva", description: "Aviso quando há alta chance de chuva nas próximas horas" },
  wind: { label: "Vento forte", description: "Aviso quando as rajadas passam de 30 km/h" },
  uv: { label: "UV alto", description: "Aviso quando o índice UV do dia é 8 ou mais" },
  temp: { label: "Temperatura extrema", description: "Aviso de calor (≥ 35°) ou frio (≤ 5°) no dia" },
};

export function deriveAlerts(
  weather: WeatherPayload | null,
  details: DetailsPayload | null
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  if (!weather) return alerts;

  const nextHours = weather.hourly.slice(0, 4);
  const rainiest = nextHours.reduce(
    (max, h) => (h.precipitationProbability > max.precipitationProbability ? h : max),
    nextHours[0] ?? { precipitationProbability: 0, time: "" }
  );
  if (rainiest && rainiest.precipitationProbability >= 50) {
    const hour = new Date(rainiest.time).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    alerts.push({
      kind: "rain",
      severity: rainiest.precipitationProbability >= 75 ? "warning" : "info",
      title: "Chuva provável",
      description: `${rainiest.precipitationProbability}% de chance de chuva por volta das ${hour}. Leve guarda-chuva.`,
    });
  }

  if (weather.current.windSpeed >= 30) {
    alerts.push({
      kind: "wind",
      severity: weather.current.windSpeed >= 50 ? "warning" : "info",
      title: "Vento forte",
      description: `Ventos de ${Math.round(weather.current.windSpeed)} km/h agora. Cuidado com objetos soltos.`,
    });
  }

  if (details && details.uv.max >= 8) {
    alerts.push({
      kind: "uv",
      severity: details.uv.max >= 11 ? "warning" : "info",
      title: `UV ${details.uv.label.toLowerCase()}`,
      description: `Índice UV máximo de ${details.uv.max} hoje. Use protetor solar e evite o sol do meio-dia.`,
    });
  }

  const today = weather.daily[0];
  if (today) {
    if (today.tempMax >= 35) {
      alerts.push({
        kind: "temp",
        severity: "warning",
        title: "Calor intenso",
        description: `Máxima de ${Math.round(today.tempMax)}° hoje. Hidrate-se e evite esforço nas horas quentes.`,
      });
    } else if (today.tempMin <= 5) {
      alerts.push({
        kind: "temp",
        severity: "warning",
        title: "Frio intenso",
        description: `Mínima de ${Math.round(today.tempMin)}° hoje. Agasalhe-se bem.`,
      });
    }
  }

  return alerts;
}
