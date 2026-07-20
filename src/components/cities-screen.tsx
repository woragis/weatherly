"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CitySearch } from "@/components/city-search";
import { PageShell } from "@/components/page-shell";
import { WeatherIcon } from "@/components/weather-icon";
import { placeQuery } from "@/hooks/use-place";
import { useUnits } from "@/lib/settings";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  type FavoritePlace,
} from "@/lib/favorites";
import type { GeocodeResult, WeatherPayload } from "@/lib/open-weather";

type CityWeatherMap = Record<string, WeatherPayload | null>;

function favKey(place: FavoritePlace): string {
  return `${place.latitude.toFixed(3)},${place.longitude.toFixed(3)}`;
}

export function CitiesScreen() {
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);
  const [weatherByCity, setWeatherByCity] = useState<CityWeatherMap>({});
  const { formatTemp, formatWind } = useUnits();

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    for (const fav of favorites) {
      const key = favKey(fav);
      if (weatherByCity[key] !== undefined) continue;

      fetch(`/api/weather?lat=${fav.latitude}&lon=${fav.longitude}`, {
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("failed");
          const data = (await res.json()) as WeatherPayload;
          setWeatherByCity((prev) => ({ ...prev, [key]: data }));
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setWeatherByCity((prev) => ({ ...prev, [key]: null }));
        });
    }

    return () => controller.abort();
    // weatherByCity é intencionalmente omitido para não refazer fetches
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites]);

  function handleAdd(result: GeocodeResult) {
    setFavorites(
      addFavorite({
        label: result.label,
        latitude: result.latitude,
        longitude: result.longitude,
      })
    );
  }

  function handleRemove(fav: FavoritePlace) {
    setFavorites(removeFavorite(fav));
  }

  const loadedFavorites = favorites.filter(
    (fav) => weatherByCity[favKey(fav)]
  );

  return (
    <PageShell title="Minhas cidades" subtitle="Favoritas e comparação">
      <CitySearch onSelect={handleAdd} />

      {favorites.length === 0 && (
        <p className="text-white/70">
          Nenhuma cidade favorita ainda. Busque uma cidade acima para adicionar.
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {favorites.map((fav) => {
          const weather = weatherByCity[favKey(fav)];
          return (
            <li
              key={favKey(fav)}
              className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
            >
              <Link
                href={`/?${placeQuery(fav)}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {fav.label}
                  </p>
                  <p className="truncate text-xs text-white/60">
                    {weather
                      ? weather.current.condition.label
                      : weather === null
                        ? "Sem dados"
                        : "Carregando…"}
                  </p>
                </div>
                {weather && (
                  <>
                    <WeatherIcon
                      name={weather.current.condition.icon}
                      className="h-6 w-6 shrink-0 opacity-90"
                    />
                    <p className="font-[family-name:var(--font-display)] text-2xl text-white">
                      {formatTemp(weather.current.temperature)}
                    </p>
                  </>
                )}
              </Link>
              <button
                type="button"
                onClick={() => handleRemove(fav)}
                aria-label={`Remover ${fav.label} dos favoritos`}
                className="shrink-0 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-white/70 transition hover:bg-white/20 hover:text-white"
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>

      {loadedFavorites.length >= 2 && (
        <section className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
          <h2 className="mb-3 text-[0.7rem] uppercase tracking-[0.16em] text-white/55">
            Comparação
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/85">
              <thead>
                <tr className="text-[0.65rem] uppercase tracking-wider text-white/50">
                  <th className="py-1.5 pr-3 font-medium">Cidade</th>
                  <th className="py-1.5 pr-3 font-medium">Agora</th>
                  <th className="py-1.5 pr-3 font-medium">Máx/Mín</th>
                  <th className="py-1.5 pr-3 font-medium">Umidade</th>
                  <th className="py-1.5 font-medium">Vento</th>
                </tr>
              </thead>
              <tbody>
                {loadedFavorites.map((fav) => {
                  const w = weatherByCity[favKey(fav)];
                  if (!w) return null;
                  return (
                    <tr key={favKey(fav)} className="border-t border-white/10">
                      <td className="max-w-32 truncate py-2 pr-3">
                        {fav.label.split(",")[0]}
                      </td>
                      <td className="py-2 pr-3 tabular-nums">
                        {formatTemp(w.current.temperature)}
                      </td>
                      <td className="py-2 pr-3 tabular-nums">
                        {formatTemp(w.daily[0]?.tempMax ?? w.current.temperature)} /{" "}
                        {formatTemp(w.daily[0]?.tempMin ?? w.current.temperature)}
                      </td>
                      <td className="py-2 pr-3 tabular-nums">
                        {Math.round(w.current.humidity)}%
                      </td>
                      <td className="py-2 tabular-nums">
                        {formatWind(w.current.windSpeed)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </PageShell>
  );
}
