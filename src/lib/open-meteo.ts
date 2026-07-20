/** Open-Meteo types, WMO weathercode mapping, and fetch helpers. */

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

type OpenMeteoForecastResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
  };
};

type OpenMeteoGeocodeResponse = {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
  }>;
};

const REVALIDATE_SECONDS = 900;

/** WMO Weather interpretation codes → Portuguese labels + theme buckets */
export function mapWeatherCode(
  code: number,
  isDay = true
): WeatherCondition {
  const dayNightTheme = (day: WeatherTheme, night: WeatherTheme): WeatherTheme =>
    isDay ? day : night;

  if (code === 0) {
    return {
      code,
      label: "Céu limpo",
      icon: isDay ? "sun" : "moon",
      theme: dayNightTheme("clear-day", "clear-night"),
    };
  }
  if (code === 1) {
    return {
      code,
      label: "Predominantemente limpo",
      icon: isDay ? "sun" : "moon",
      theme: dayNightTheme("clear-day", "clear-night"),
    };
  }
  if (code === 2) {
    return {
      code,
      label: "Parcialmente nublado",
      icon: "cloud-sun",
      theme: "cloudy",
    };
  }
  if (code === 3) {
    return {
      code,
      label: "Nublado",
      icon: "cloud",
      theme: "cloudy",
    };
  }
  if (code === 45 || code === 48) {
    return { code, label: "Neblina", icon: "fog", theme: "fog" };
  }
  if (code >= 51 && code <= 57) {
    return { code, label: "Garoa", icon: "drizzle", theme: "drizzle" };
  }
  if (code >= 61 && code <= 67) {
    return { code, label: "Chuva", icon: "rain", theme: "rain" };
  }
  if (code >= 71 && code <= 77) {
    return { code, label: "Neve", icon: "snow", theme: "snow" };
  }
  if (code >= 80 && code <= 82) {
    return { code, label: "Pancadas de chuva", icon: "rain", theme: "rain" };
  }
  if (code >= 85 && code <= 86) {
    return { code, label: "Pancadas de neve", icon: "snow", theme: "snow" };
  }
  if (code >= 95 && code <= 99) {
    return { code, label: "Tempestade", icon: "storm", theme: "storm" };
  }
  return { code, label: "Desconhecido", icon: "cloud", theme: "cloudy" };
}

export function buildForecastUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
    hourly: "temperature_2m,weather_code,precipitation_probability",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
    timezone: "auto",
    forecast_days: "7",
  });
  return `https://api.open-meteo.com/v1/forecast?${params}`;
}

export function buildGeocodeUrl(query: string): string {
  const params = new URLSearchParams({
    name: query,
    count: "5",
    language: "pt",
    format: "json",
  });
  return `https://geocoding-api.open-meteo.com/v1/search?${params}`;
}

export async function fetchForecast(
  lat: number,
  lon: number
): Promise<WeatherPayload> {
  const res = await fetch(buildForecastUrl(lat, lon), {
    cache: "force-cache",
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`Open-Meteo forecast failed: ${res.status}`);
  }
  const data = (await res.json()) as OpenMeteoForecastResponse;
  return normalizeForecast(data);
}

export async function fetchGeocode(query: string): Promise<GeocodeResult[]> {
  const res = await fetch(buildGeocodeUrl(query), {
    cache: "force-cache",
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`Open-Meteo geocode failed: ${res.status}`);
  }
  const data = (await res.json()) as OpenMeteoGeocodeResponse;
  return (data.results ?? []).map((r) => {
    const parts = [r.name, r.admin1, r.country].filter(Boolean);
    return {
      id: r.id,
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      country: r.country ?? "",
      admin1: r.admin1,
      label: parts.join(", "),
    };
  });
}

function normalizeForecast(data: OpenMeteoForecastResponse): WeatherPayload {
  const isDay = data.current.is_day === 1;
  const currentCode = data.current.weather_code;

  const now = Date.parse(data.current.time);
  const hourly: HourlyPoint[] = [];
  for (let i = 0; i < data.hourly.time.length && hourly.length < 24; i++) {
    const t = Date.parse(data.hourly.time[i]);
    if (t < now - 60 * 60 * 1000) continue;
    const code = data.hourly.weather_code[i];
    hourly.push({
      time: data.hourly.time[i],
      temperature: data.hourly.temperature_2m[i],
      weatherCode: code,
      precipitationProbability: data.hourly.precipitation_probability[i] ?? 0,
      condition: mapWeatherCode(code, isDay),
    });
  }

  const daily: DailyPoint[] = data.daily.time.map((date, i) => {
    const code = data.daily.weather_code[i];
    return {
      date,
      weatherCode: code,
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
      condition: mapWeatherCode(code, true),
    };
  });

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: currentCode,
      isDay,
      condition: mapWeatherCode(currentCode, isDay),
    },
    hourly,
    daily,
  };
}

export { REVALIDATE_SECONDS };
