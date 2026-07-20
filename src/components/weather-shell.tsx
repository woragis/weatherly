"use client";

import { useEffect, useMemo, useState } from "react";
import { CitySearch } from "@/components/city-search";
import { DailyList } from "@/components/daily-list";
import { Hero } from "@/components/hero";
import { HourlyStrip } from "@/components/hourly-strip";
import { MetricsRow } from "@/components/metrics-row";
import { useGeolocation } from "@/hooks/use-geolocation";
import type { GeocodeResult, WeatherPayload, WeatherTheme } from "@/lib/open-meteo";

type Place = {
  label: string;
  latitude: number;
  longitude: number;
};

function placeKey(place: Place): string {
  return `${place.latitude.toFixed(4)},${place.longitude.toFixed(4)}`;
}

export function WeatherShell() {
  const geo = useGeolocation(true);
  const [manualPlace, setManualPlace] = useState<Place | null>(null);
  const [cache, setCache] = useState<{
    key: string;
    weather: WeatherPayload;
  } | null>(null);
  const [fetchError, setFetchError] = useState<{
    key: string;
    message: string;
  } | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const geoPlace = useMemo<Place | null>(() => {
    if (geo.status !== "granted" || !geo.coords) return null;
    return {
      label: "Sua localização",
      latitude: geo.coords.latitude,
      longitude: geo.coords.longitude,
    };
  }, [geo.status, geo.coords]);

  const place = manualPlace ?? geoPlace;
  const key = place ? placeKey(place) : null;

  useEffect(() => {
    if (!place || !key) return;

    const controller = new AbortController();

    fetch(
      `/api/weather?lat=${encodeURIComponent(place.latitude)}&lon=${encodeURIComponent(place.longitude)}`,
      { signal: controller.signal }
    )
      .then(async (res) => {
        const data = (await res.json()) as WeatherPayload & { error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? "Erro ao carregar o clima.");
        }
        setCache({ key, weather: data });
        setFetchError(null);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Falha de rede ao carregar o clima.";
        setFetchError({ key, message });
      });

    return () => controller.abort();
  }, [place, key, refreshNonce]);

  function handleCitySelect(result: GeocodeResult) {
    setManualPlace({
      label: result.label,
      latitude: result.latitude,
      longitude: result.longitude,
    });
  }

  function retryWeather() {
    if (!key) return;
    setCache((prev) => (prev?.key === key ? null : prev));
    setFetchError(null);
    setRefreshNonce((n) => n + 1);
  }

  const weather = cache?.key === key ? cache.weather : null;
  const apiError = fetchError?.key === key ? fetchError.message : null;
  const isLocating =
    !place && (geo.status === "idle" || geo.status === "pending");
  const isGeoError =
    !place &&
    (geo.status === "denied" ||
      geo.status === "unavailable" ||
      geo.status === "error");
  const isLoadingWeather = Boolean(place && !weather && !apiError);
  const isReady = Boolean(place && weather);

  const theme: WeatherTheme = weather?.current.condition.theme ?? "cloudy";
  const isDay = weather?.current.isDay ?? true;
  const atmosphereClass = `atmosphere theme-${theme} ${isDay ? "is-day" : "is-night"}`;

  return (
    <div className={`weather-shell min-h-dvh ${atmosphereClass}`}>
      <div className="atmosphere-overlay pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-8 px-5 pb-12 pt-8 sm:px-6">
        <CitySearch onSelect={handleCitySelect} />

        {(isLocating || isLoadingWeather) && (
          <div
            className="flex flex-1 flex-col justify-center gap-3 py-24"
            aria-busy="true"
            aria-live="polite"
          >
            <p className="font-[family-name:var(--font-display)] text-3xl text-white">
              Weatherly
            </p>
            <p className="text-white/70">
              {isLocating
                ? "Obtendo sua localização…"
                : "Carregando previsão…"}
            </p>
            <div className="loading-pulse mt-2 h-1 w-32 overflow-hidden rounded-full bg-white/20">
              <div className="loading-bar h-full w-1/2 rounded-full bg-white/70" />
            </div>
          </div>
        )}

        {isGeoError && (
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

        {apiError && place && (
          <div className="flex flex-1 flex-col justify-center gap-4 py-16">
            <p className="font-[family-name:var(--font-display)] text-3xl text-white">
              Weatherly
            </p>
            <p className="text-white/80" role="alert">
              {apiError}
            </p>
            <button
              type="button"
              onClick={retryWeather}
              className="w-fit rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {isReady && weather && place && (
          <div
            key={`${key}-${weather.current.time}`}
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
