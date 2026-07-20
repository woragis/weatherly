/** OpenWeatherMap client — types, condition mapping, and fetch helpers. */

export type WeatherTheme =
  | "clear-day"
  | "clear-night"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

export type WeatherCondition = {
  code: number;
  label: string;
  icon: string;
  theme: WeatherTheme;
};

export type CurrentWeather = {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  condition: WeatherCondition;
};

export type HourlyPoint = {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  condition: WeatherCondition;
};

export type DailyPoint = {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
  condition: WeatherCondition;
};

export type WeatherPayload = {
  latitude: number;
  longitude: number;
  timezone: string;
  locationName?: string;
  current: CurrentWeather;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
};

export type GeocodeResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  label: string;
};

type OwmWeatherItem = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type OwmCurrentResponse = {
  coord: { lat: number; lon: number };
  weather: OwmWeatherItem[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  wind: { speed: number };
  sys: { country?: string; sunrise: number; sunset: number };
  name: string;
  dt: number;
  timezone: number;
};

type OwmForecastItem = {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  weather: OwmWeatherItem[];
  pop: number;
  dt_txt: string;
};

type OwmForecastResponse = {
  list: OwmForecastItem[];
  city: {
    name: string;
    country: string;
    coord: { lat: number; lon: number };
    timezone: number;
    sunrise: number;
    sunset: number;
  };
};

type OwmGeoResult = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  local_names?: Record<string, string>;
};

const REVALIDATE_SECONDS = 900;
const API_BASE = "https://api.openweathermap.org";

function getApiKey(): string {
  const key = process.env.OPENWEATHERMAP_API_KEY;
  if (!key) {
    throw new Error("OPENWEATHERMAP_API_KEY não configurada.");
  }
  return key;
}

/** OpenWeather condition id → Portuguese labels + theme buckets */
export function mapWeatherCode(
  code: number,
  isDay = true,
  description?: string
): WeatherCondition {
  const label =
    description && description.length > 0
      ? description.charAt(0).toUpperCase() + description.slice(1)
      : "Desconhecido";

  const dayNightTheme = (day: WeatherTheme, night: WeatherTheme): WeatherTheme =>
    isDay ? day : night;

  if (code >= 200 && code < 300) {
    return { code, label, icon: "storm", theme: "storm" };
  }
  if (code >= 300 && code < 400) {
    return { code, label, icon: "drizzle", theme: "drizzle" };
  }
  if (code >= 500 && code < 600) {
    return { code, label, icon: "rain", theme: "rain" };
  }
  if (code >= 600 && code < 700) {
    return { code, label, icon: "snow", theme: "snow" };
  }
  if (code >= 700 && code < 800) {
    return { code, label, icon: "fog", theme: "fog" };
  }
  if (code === 800) {
    return {
      code,
      label,
      icon: isDay ? "sun" : "moon",
      theme: dayNightTheme("clear-day", "clear-night"),
    };
  }
  if (code === 801) {
    return {
      code,
      label,
      icon: "cloud-sun",
      theme: "cloudy",
    };
  }
  if (code > 801 && code < 900) {
    return { code, label, icon: "cloud", theme: "cloudy" };
  }
  return { code, label, icon: "cloud", theme: "cloudy" };
}

function toIso(unixSec: number): string {
  return new Date(unixSec * 1000).toISOString();
}

function dateKey(unixSec: number, timezoneOffsetSec: number): string {
  const local = new Date((unixSec + timezoneOffsetSec) * 1000);
  const y = local.getUTCFullYear();
  const m = String(local.getUTCMonth() + 1).padStart(2, "0");
  const d = String(local.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function owmFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  url.searchParams.set("appid", getApiKey());

  const res = await fetch(url.toString(), {
    cache: "force-cache",
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`OpenWeatherMap ${path} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function fetchForecast(
  lat: number,
  lon: number
): Promise<WeatherPayload> {
  const common = {
    lat: String(lat),
    lon: String(lon),
    units: "metric",
    lang: "pt_br",
  };

  const [current, forecast] = await Promise.all([
    owmFetch<OwmCurrentResponse>("/data/2.5/weather", common),
    owmFetch<OwmForecastResponse>("/data/2.5/forecast", common),
  ]);

  return normalize(current, forecast);
}

export async function fetchGeocode(query: string): Promise<GeocodeResult[]> {
  const results = await owmFetch<OwmGeoResult[]>("/geo/1.0/direct", {
    q: query,
    limit: "5",
  });

  return results.map((r, index) => {
    const name = r.local_names?.pt ?? r.name;
    const parts = [name, r.state, r.country].filter(Boolean);
    return {
      id: index + 1,
      name,
      latitude: r.lat,
      longitude: r.lon,
      country: r.country,
      admin1: r.state,
      label: parts.join(", "),
    };
  });
}

function normalize(
  current: OwmCurrentResponse,
  forecast: OwmForecastResponse
): WeatherPayload {
  const isDay =
    current.dt >= current.sys.sunrise && current.dt < current.sys.sunset;
  const w = current.weather[0];
  const weatherCode = w?.id ?? 800;
  const tz = current.timezone;

  const hourly: HourlyPoint[] = forecast.list.slice(0, 8).map((item) => {
    const code = item.weather[0]?.id ?? 800;
    const itemIsDay =
      item.dt % 86400 > (current.sys.sunrise % 86400) &&
      item.dt % 86400 < (current.sys.sunset % 86400);
    return {
      time: toIso(item.dt),
      temperature: item.main.temp,
      weatherCode: code,
      precipitationProbability: Math.round((item.pop ?? 0) * 100),
      condition: mapWeatherCode(
        code,
        itemIsDay,
        item.weather[0]?.description
      ),
    };
  });

  const byDay = new Map<
    string,
    {
      temps: number[];
      codes: number[];
      descriptions: string[];
      pops: number[];
    }
  >();

  for (const item of forecast.list) {
    const key = dateKey(item.dt, tz);
    const entry = byDay.get(key) ?? {
      temps: [],
      codes: [],
      descriptions: [],
      pops: [],
    };
    entry.temps.push(item.main.temp_min, item.main.temp_max, item.main.temp);
    entry.codes.push(item.weather[0]?.id ?? 800);
    entry.descriptions.push(item.weather[0]?.description ?? "");
    entry.pops.push(item.pop ?? 0);
    byDay.set(key, entry);
  }

  const todayKey = dateKey(current.dt, tz);
  const daily: DailyPoint[] = [];

  // Include today from current + forecast mins/maxes
  const todayBucket = byDay.get(todayKey);
  const todayTemps = [
    current.main.temp_min,
    current.main.temp_max,
    ...(todayBucket?.temps ?? []),
  ];
  daily.push({
    date: todayKey,
    weatherCode,
    tempMax: Math.max(...todayTemps),
    tempMin: Math.min(...todayTemps),
    sunrise: toIso(current.sys.sunrise),
    sunset: toIso(current.sys.sunset),
    condition: mapWeatherCode(weatherCode, true, w?.description),
  });

  for (const [date, bucket] of byDay) {
    if (date === todayKey) continue;
    if (daily.length >= 7) break;
    // Prefer midday-ish sample (around index 4 of 8 three-hour slots = ~noon)
    const mid = Math.min(4, bucket.codes.length - 1);
    const code = bucket.codes[mid] ?? bucket.codes[0] ?? 800;
    daily.push({
      date,
      weatherCode: code,
      tempMax: Math.max(...bucket.temps),
      tempMin: Math.min(...bucket.temps),
      sunrise: toIso(forecast.city.sunrise),
      sunset: toIso(forecast.city.sunset),
      condition: mapWeatherCode(code, true, bucket.descriptions[mid]),
    });
  }

  const locationParts = [current.name, current.sys.country].filter(Boolean);

  return {
    latitude: current.coord.lat,
    longitude: current.coord.lon,
    timezone: `UTC${tz >= 0 ? "+" : ""}${tz / 3600}`,
    locationName: locationParts.join(", "),
    current: {
      time: toIso(current.dt),
      temperature: current.main.temp,
      feelsLike: current.main.feels_like,
      humidity: current.main.humidity,
      windSpeed: current.wind.speed * 3.6, // m/s → km/h (UI expects km/h style)
      weatherCode,
      isDay,
      condition: mapWeatherCode(weatherCode, isDay, w?.description),
    },
    hourly,
    daily,
  };
}

export { REVALIDATE_SECONDS };
