"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useGeolocation } from "@/hooks/use-geolocation";

export type Place = {
  label: string;
  latitude: number;
  longitude: number;
};

/**
 * Resolve o lugar atual: query params (?lat&lon&label) têm prioridade;
 * sem params, cai para a geolocalização do navegador.
 */
export function usePlace(): {
  place: Place | null;
  pending: boolean;
  errorMessage: string | null;
  requestGeo: () => void;
} {
  const params = useSearchParams();
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  const label = params.get("label");
  const hasParams = Number.isFinite(lat) && Number.isFinite(lon) && !!label;

  const geo = useGeolocation(!hasParams);

  const place = useMemo<Place | null>(() => {
    if (hasParams) {
      return { label: label as string, latitude: lat, longitude: lon };
    }
    if (geo.status === "granted" && geo.coords) {
      return {
        label: "Sua localização",
        latitude: geo.coords.latitude,
        longitude: geo.coords.longitude,
      };
    }
    return null;
  }, [hasParams, label, lat, lon, geo.status, geo.coords]);

  return {
    place,
    pending: !hasParams && (geo.status === "idle" || geo.status === "pending"),
    errorMessage: !hasParams ? geo.errorMessage : null,
    requestGeo: geo.request,
  };
}

export function placeQuery(place: Place): string {
  return `lat=${place.latitude}&lon=${place.longitude}&label=${encodeURIComponent(place.label)}`;
}
