"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type TempUnit = "c" | "f";
export type WindUnit = "kmh" | "ms";

export type Settings = {
  tempUnit: TempUnit;
  windUnit: WindUnit;
  animations: boolean;
};

const DEFAULTS: Settings = {
  tempUnit: "c",
  windUnit: "kmh",
  animations: true,
};

const STORAGE_KEY = "weatherly:settings";

type SettingsContextValue = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULTS,
  update: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSettings({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) });
      }
    } catch {
      // localStorage indisponível — mantém defaults
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("no-anim", !settings.animations);
  }, [settings.animations]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}

export function celsiusTo(unit: TempUnit, celsius: number): number {
  return unit === "f" ? celsius * 1.8 + 32 : celsius;
}

export function kmhTo(unit: WindUnit, kmh: number): number {
  return unit === "ms" ? kmh / 3.6 : kmh;
}

/** Formatadores que respeitam as unidades escolhidas. */
export function useUnits() {
  const { settings } = useSettings();

  const formatTemp = useCallback(
    (celsius: number) => `${Math.round(celsiusTo(settings.tempUnit, celsius))}°`,
    [settings.tempUnit]
  );

  const formatWind = useCallback(
    (kmh: number) =>
      settings.windUnit === "ms"
        ? `${Math.round(kmhTo("ms", kmh))} m/s`
        : `${Math.round(kmh)} km/h`,
    [settings.windUnit]
  );

  return { formatTemp, formatWind, settings };
}
