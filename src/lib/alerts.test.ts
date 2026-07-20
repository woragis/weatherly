import { describe, expect, it } from "vitest";
import { deriveAlerts } from "./alerts";
import type { WeatherPayload, WeatherCondition } from "./open-weather";
import type { DetailsPayload } from "./details";

const condition: WeatherCondition = {
  code: 800,
  label: "Céu limpo",
  icon: "sun",
  theme: "clear-day",
};

function makeWeather(overrides?: {
  pop?: number;
  wind?: number;
  tempMax?: number;
  tempMin?: number;
}): WeatherPayload {
  return {
    latitude: 0,
    longitude: 0,
    timezone: "UTC",
    current: {
      time: "2026-07-20T12:00:00Z",
      temperature: 25,
      feelsLike: 25,
      humidity: 60,
      windSpeed: overrides?.wind ?? 10,
      weatherCode: 800,
      isDay: true,
      condition,
    },
    hourly: [
      {
        time: "2026-07-20T13:00:00Z",
        temperature: 25,
        weatherCode: 800,
        precipitationProbability: overrides?.pop ?? 0,
        condition,
      },
    ],
    daily: [
      {
        date: "2026-07-20",
        weatherCode: 800,
        tempMax: overrides?.tempMax ?? 28,
        tempMin: overrides?.tempMin ?? 20,
        sunrise: "2026-07-20T09:00:00Z",
        sunset: "2026-07-20T21:00:00Z",
        condition,
      },
    ],
  };
}

function makeDetails(uvMax: number): DetailsPayload {
  return {
    aqi: { index: 1, label: "Boa", pm25: 5, pm10: 10, o3: 40, no2: 8 },
    uv: { current: uvMax - 1, max: uvMax, label: "Alto" },
    sun: { sunrise: "2026-07-20T09:00:00Z", sunset: "2026-07-20T21:00:00Z" },
    moon: { phase: 0.5, label: "Lua cheia", emoji: "🌕", illumination: 100 },
    conditions: {
      feelsLike: 25,
      humidity: 60,
      windSpeed: 10,
      windDeg: 90,
      pressure: 1013,
      visibility: 10,
    },
  };
}

describe("deriveAlerts", () => {
  it("não gera alertas em condições calmas", () => {
    expect(deriveAlerts(makeWeather(), makeDetails(4))).toEqual([]);
  });

  it("gera alerta de chuva quando pop >= 50%", () => {
    const alerts = deriveAlerts(makeWeather({ pop: 80 }), null);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].kind).toBe("rain");
    expect(alerts[0].severity).toBe("warning");
  });

  it("gera alerta de vento forte", () => {
    const alerts = deriveAlerts(makeWeather({ wind: 40 }), null);
    expect(alerts.map((a) => a.kind)).toContain("wind");
  });

  it("gera alerta de UV alto com base nos detalhes", () => {
    const alerts = deriveAlerts(makeWeather(), makeDetails(9));
    expect(alerts.map((a) => a.kind)).toContain("uv");
  });

  it("gera alerta de calor intenso", () => {
    const alerts = deriveAlerts(makeWeather({ tempMax: 37 }), null);
    expect(alerts.map((a) => a.kind)).toContain("temp");
    expect(alerts[0].title).toBe("Calor intenso");
  });

  it("retorna vazio sem dados de clima", () => {
    expect(deriveAlerts(null, null)).toEqual([]);
  });
});
