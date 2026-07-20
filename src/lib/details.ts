/** Day-detail data: AQI (OpenWeatherMap), UV (Open-Meteo), sun, moon, extra conditions. */

import { moonInfo, type MoonInfo } from "@/lib/moon";

export type AqiInfo = {
  /** escala OWM 1..5 */
  index: number;
  label: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
};

export type UvInfo = {
  current: number;
  max: number;
  label: string;
};

export type DetailsPayload = {
  aqi: AqiInfo;
  uv: UvInfo;
  sun: { sunrise: string; sunset: string };
  moon: MoonInfo;
  conditions: {
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDeg: number;
    pressure: number;
    /** km */
    visibility: number;
  };
};

type OwmAirResponse = {
  list: Array<{
    main: { aqi: number };
    components: { pm2_5: number; pm10: number; o3: number; no2: number };
  }>;
};

type OwmCurrentLean = {
  main: {
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: { speed: number; deg?: number };
  visibility?: number;
  sys: { sunrise: number; sunset: number };
};

type OpenMeteoUvResponse = {
  current?: { uv_index?: number };
  daily?: { uv_index_max?: number[] };
};

const REVALIDATE_SECONDS = 900;

const AQI_LABELS: Record<number, string> = {
  1: "Boa",
  2: "Razoável",
  3: "Moderada",
  4: "Ruim",
  5: "Muito ruim",
};

export function uvLabel(uv: number): string {
  if (uv < 3) return "Baixo";
  if (uv < 6) return "Moderado";
  if (uv < 8) return "Alto";
  if (uv < 11) return "Muito alto";
  return "Extremo";
}

function getApiKey(): string {
  const key = process.env.OPENWEATHERMAP_API_KEY;
  if (!key) {
    throw new Error("OPENWEATHERMAP_API_KEY não configurada.");
  }
  return key;
}

async function cachedJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    cache: "force-cache",
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`Upstream failed (${res.status}): ${url.split("?")[0]}`);
  }
  return (await res.json()) as T;
}

export async function fetchDetails(
  lat: number,
  lon: number
): Promise<DetailsPayload> {
  const key = getApiKey();
  const owmBase = "https://api.openweathermap.org";

  const [air, current, uvData] = await Promise.all([
    cachedJson<OwmAirResponse>(
      `${owmBase}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`
    ),
    cachedJson<OwmCurrentLean>(
      `${owmBase}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`
    ),
    cachedJson<OpenMeteoUvResponse>(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index&daily=uv_index_max&timezone=auto&forecast_days=1`
    ),
  ]);

  const airRow = air.list[0];
  const aqiIndex = airRow?.main.aqi ?? 1;

  const uvCurrent = Math.round((uvData.current?.uv_index ?? 0) * 10) / 10;
  const uvMax =
    Math.round((uvData.daily?.uv_index_max?.[0] ?? uvCurrent) * 10) / 10;

  return {
    aqi: {
      index: aqiIndex,
      label: AQI_LABELS[aqiIndex] ?? "—",
      pm25: airRow?.components.pm2_5 ?? 0,
      pm10: airRow?.components.pm10 ?? 0,
      o3: airRow?.components.o3 ?? 0,
      no2: airRow?.components.no2 ?? 0,
    },
    uv: {
      current: uvCurrent,
      max: uvMax,
      label: uvLabel(uvMax),
    },
    sun: {
      sunrise: new Date(current.sys.sunrise * 1000).toISOString(),
      sunset: new Date(current.sys.sunset * 1000).toISOString(),
    },
    moon: moonInfo(),
    conditions: {
      feelsLike: current.main.feels_like,
      humidity: current.main.humidity,
      windSpeed: current.wind.speed * 3.6,
      windDeg: current.wind.deg ?? 0,
      pressure: current.main.pressure,
      visibility: Math.round(((current.visibility ?? 10000) / 1000) * 10) / 10,
    },
  };
}

export { REVALIDATE_SECONDS as DETAILS_REVALIDATE_SECONDS };
