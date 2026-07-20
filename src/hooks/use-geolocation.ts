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

function readPosition(
  onSuccess: (coords: GeoCoords) => void,
  onFail: (status: GeolocationStatus, message: string) => void
) {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    onFail("unavailable", "Geolocalização não disponível neste navegador.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        onFail(
          "denied",
          "Permissão de localização negada. Busque uma cidade abaixo."
        );
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        onFail("unavailable", "Não foi possível obter sua posição.");
      } else {
        onFail("error", "Tempo esgotado ao obter localização.");
      }
    },
    { enableHighAccuracy: false, timeout: 12000, maximumAge: 300_000 }
  );
}

export function useGeolocation(autoRequest = true): UseGeolocationResult {
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>(
    autoRequest ? "pending" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const request = useCallback(() => {
    setStatus("pending");
    setErrorMessage(null);
    readPosition(
      (next) => {
        setCoords(next);
        setStatus("granted");
      },
      (nextStatus, message) => {
        setStatus(nextStatus);
        setErrorMessage(message);
      }
    );
  }, []);

  useEffect(() => {
    if (!autoRequest) return;

    let cancelled = false;
    readPosition(
      (next) => {
        if (cancelled) return;
        setCoords(next);
        setStatus("granted");
      },
      (nextStatus, message) => {
        if (cancelled) return;
        setStatus(nextStatus);
        setErrorMessage(message);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [autoRequest]);

  return { coords, status, errorMessage, request };
}
