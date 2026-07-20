"use client";

import { useCallback, useEffect, useState } from "react";

export type GeoCoords = {
  latitude: number;
  longitude: number;
};

export type GeolocationStatus =
  | "idle"
  | "pending"
  | "granted"
  | "denied"
  | "unavailable"
  | "error";

export type UseGeolocationResult = {
  coords: GeoCoords | null;
  status: GeolocationStatus;
  errorMessage: string | null;
  request: () => void;
};

export function useGeolocation(autoRequest = true): UseGeolocationResult {
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const request = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unavailable");
      setErrorMessage("Geolocalização não disponível neste navegador.");
      return;
    }

    setStatus("pending");
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus("granted");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setStatus("denied");
          setErrorMessage(
            "Permissão de localização negada. Busque uma cidade abaixo."
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setStatus("unavailable");
          setErrorMessage("Não foi possível obter sua posição.");
        } else {
          setStatus("error");
          setErrorMessage("Tempo esgotado ao obter localização.");
        }
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300_000 }
    );
  }, []);

  useEffect(() => {
    if (autoRequest) request();
  }, [autoRequest, request]);

  return { coords, status, errorMessage, request };
}
