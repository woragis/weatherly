"use client";

import { useEffect, useState } from "react";
import type { DetailsPayload } from "@/lib/details";

export function useDetails(lat: number | null, lon: number | null): {
  details: DetailsPayload | null;
  error: string | null;
  loading: boolean;
} {
  const [details, setDetails] = useState<DetailsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === null || lon === null) return;

    const controller = new AbortController();
    setDetails(null);
    setError(null);

    fetch(`/api/details?lat=${lat}&lon=${lon}`, { signal: controller.signal })
      .then(async (res) => {
        const data = (await res.json()) as DetailsPayload & { error?: string };
        if (!res.ok) throw new Error(data.error ?? "Erro ao carregar detalhes.");
        setDetails(data);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Falha de rede.");
      });

    return () => controller.abort();
  }, [lat, lon]);

  return {
    details,
    error,
    loading: lat !== null && lon !== null && !details && !error,
  };
}
