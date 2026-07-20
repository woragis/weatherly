"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { GeocodeResult } from "@/lib/open-meteo";

type CitySearchProps = {
  onSelect: (place: GeocodeResult) => void;
  disabled?: boolean;
};

export function CitySearch({ onSelect, disabled }: CitySearchProps) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const trimmed = query.trim();
  const canSearch = trimmed.length >= 2;
  const visibleResults = canSearch ? results : [];

  useEffect(() => {
    if (!canSearch) return;

    const timer = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/geocode?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        const data = (await res.json()) as {
          results?: GeocodeResult[];
          error?: string;
        };
        if (!res.ok) {
          setError(data.error ?? "Falha na busca.");
          setResults([]);
          return;
        }
        setResults(data.results ?? []);
        setOpen(true);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Não foi possível buscar cidades.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [canSearch, trimmed]);

  function handleSelect(place: GeocodeResult) {
    setQuery(place.label);
    setOpen(false);
    setResults([]);
    onSelect(place);
  }

  return (
    <div className="city-search relative w-full max-w-md">
      <label className="sr-only" htmlFor={listId}>
        Buscar cidade
      </label>
      <input
        id={listId}
        type="search"
        autoComplete="off"
        placeholder="Buscar cidade…"
        value={query}
        disabled={disabled}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => visibleResults.length > 0 && setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        className="w-full rounded-xl border border-white/25 bg-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/55 outline-none backdrop-blur-md transition focus:border-white/45 focus:bg-white/20"
      />
      {canSearch && loading && (
        <p className="mt-1.5 text-xs text-white/70" aria-live="polite">
          Buscando…
        </p>
      )}
      {canSearch && error && (
        <p className="mt-1.5 text-xs text-amber-100" role="alert">
          {error}
        </p>
      )}
      {open && visibleResults.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-white/20 bg-slate-900/90 py-1 shadow-lg backdrop-blur-md"
        >
          {visibleResults.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                className="w-full px-4 py-2.5 text-left text-sm text-white/90 transition hover:bg-white/10"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(place)}
              >
                {place.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
