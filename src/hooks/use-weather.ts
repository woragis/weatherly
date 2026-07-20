"use client";

import { useEffect, useState } from "react";
import type { WeatherPayload } from "@/lib/open-weather";

export function useWeather(lat: number | null, lon: number | null): {
  weather: WeatherPayload | null;
  error: string | null;
  loading: boolean;
} {
  const [weather, setWeather] = useState<WeatherPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === null || lon === null) return;

    const controller = new AbortController();
    setWeather(null);
    setError(null);

    fetch(`/api/weather?lat=${lat}&lon=${lon}`, { signal: controller.signal })
      .then(async (res) => {
        const data = (await res.json()) as WeatherPayload & { error?: string };
        if (!res.ok) throw new Error(data.error ?? "Erro ao carregar o clima.");
        setWeather(data);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Falha de rede.");
      });

    return () => controller.abort();
  }, [lat, lon]);

  return {
    weather,
    error,
    loading: lat !== null && lon !== null && !weather && !error,
  };
}
