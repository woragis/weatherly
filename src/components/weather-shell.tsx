"use client";

import { useCallback, useEffect, useState } from "react";
import { CitySearch } from "@/components/city-search";
import { DailyList } from "@/components/daily-list";
import { Hero } from "@/components/hero";
import { HourlyStrip } from "@/components/hourly-strip";
import { MetricsRow } from "@/components/metrics-row";
import { useGeolocation } from "@/hooks/use-geolocation";
import type { GeocodeResult, WeatherPayload, WeatherTheme } from "@/lib/open-meteo";

type LoadState = "locating" | "loading" | "ready" | "geo-error" | "api-error";

type Place = {
  label: string;
  latitude: number;
  longitude: number;
};

export function WeatherShell() {
  const geo = useGeolocation(true);
  const [place, setPlace] = useState<Place | null>(null);
  const [weather, setWeather] = useState<WeatherPayload | null>(null);
  const [state, setState] = useState<LoadState>("locating");
  const [apiError, setApiError] = useState<string | null>(null);

  const loadWeather = useCallback(async (lat: number, lon: number) => {
    setState("loading");
    setApiError(null);
    try {
      const res = await fetch(
        `/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
      );
      const data = (await res.json()) as WeatherPayload & { error?: string };
      if (!res.ok) {
        setApiError(data.error ?? "Erro ao carregar o clima.");
        setState("api-error");
        return;
      }
      setWeather(data);
      setState("ready");
    } catch {
      setApiError("Falha de rede ao carregar o clima.");
      setState("api-error");
    }
  }, []);

  useEffect(() => {
    if (place) return;

    if (geo.status === "pending" || geo.status === "idle") {
      setState("locating");
      return;
    }

    if (geo.status === "granted" && geo.coords) {
      setPlace({
        label: "Sua localização",
        latitude: geo.coords.latitude,
        longitude: geo.coords.longitude,
      });
      return;
    }

    if (
      geo.status === "denied" ||
      geo.status === "unavailable" ||
      geo.status === "error"
    ) {
      setState("geo-error");
    }
  }, [geo.status, geo.coords, place]);

  useEffect(() => {
    if (!place) return;
    void loadWeather(place.latitude, place.longitude);
  }, [place, loadWeather]);

  function handleCitySelect(result: GeocodeResult) {
    setPlace({
      label: result.label,
      latitude: result.latitude,
      longitude: result.longitude,
    });
  }

  const theme: WeatherTheme =
    weather?.current.condition.theme ?? "cloudy";
  const isDay = weather?.current.isDay ?? true;
  const atmosphereClass = `atmosphere theme-${theme} ${isDay ? "is-day" : "is-night"}`;

  return (
    <div className={`weather-shell min-h-dvh ${atmosphereClass}`}>
      <div className="atmosphere-overlay pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-8 px-5 pb-12 pt-8 sm:px-6">
        <CitySearch onSelect={handleCitySelect} />

        {(state === "locating" || state === "loading") && (
          <div
            className="flex flex-1 flex-col justify-center gap-3 py-24"
            aria-busy="true"
            aria-live="polite"
          >
            <p className="font-[family-name:var(--font-display)] text-3xl text-white">
              Weatherly
            </p>
            <p className="text-white/70">
              {state === "locating"
                ? "Obtendo sua localização…"
                : "Carregando previsão…"}
            </p>
            <div className="loading-pulse mt-2 h-1 w-32 overflow-hidden rounded-full bg-white/20">
              <div className="loading-bar h-full w-1/2 rounded-full bg-white/70" />
            </div>
          </div>
        )}

        {state === "geo-error" && !weather && (
          <div className="flex flex-1 flex-col justify-center gap-4 py-16">
            <p className="font-[family-name:var(--font-display)] text-3xl text-white">
              Weatherly
            </p>
            <p className="text-white/80" role="alert">
              {geo.errorMessage ??
                "Não foi possível usar o GPS. Busque uma cidade."}
            </p>
            <button
              type="button"
              onClick={() => geo.request()}
              className="w-fit rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
            >
              Tentar localização de novo
            </button>
          </div>
        )}

        {state === "api-error" && (
          <div className="flex flex-1 flex-col justify-center gap-4 py-16">
            <p className="font-[family-name:var(--font-display)] text-3xl text-white">
              Weatherly
            </p>
            <p className="text-white/80" role="alert">
              {apiError}
            </p>
            {place && (
              <button
                type="button"
                onClick={() => void loadWeather(place.latitude, place.longitude)}
                className="w-fit rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
              >
                Tentar novamente
              </button>
            )}
          </div>
        )}

        {state === "ready" && weather && place && (
          <div
            key={`${place.latitude}-${place.longitude}-${weather.current.time}`}
            className="weather-content flex flex-col gap-8"
          >
            <Hero
              city={place.label}
              current={weather.current}
              high={weather.daily[0]?.tempMax ?? weather.current.temperature}
              low={weather.daily[0]?.tempMin ?? weather.current.temperature}
            />
            <MetricsRow current={weather.current} />
            <HourlyStrip hours={weather.hourly} />
            <DailyList days={weather.daily} />
          </div>
        )}
      </div>
    </div>
  );
}
