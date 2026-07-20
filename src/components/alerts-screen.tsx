"use client";

import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Toggle } from "@/components/toggle";
import { usePlace } from "@/hooks/use-place";
import { useDetails } from "@/hooks/use-details";
import { useWeather } from "@/hooks/use-weather";
import {
  ALERT_PREF_LABELS,
  DEFAULT_ALERT_PREFS,
  deriveAlerts,
  type AlertKind,
  type AlertPrefs,
} from "@/lib/alerts";

const PREFS_KEY = "weatherly:alert-prefs";

export function AlertsScreen() {
  const { place, pending, errorMessage } = usePlace();
  const lat = place?.latitude ?? null;
  const lon = place?.longitude ?? null;
  const { weather, loading } = useWeather(lat, lon);
  const { details } = useDetails(lat, lon);

  const [prefs, setPrefs] = useState<AlertPrefs>(DEFAULT_ALERT_PREFS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        setPrefs({ ...DEFAULT_ALERT_PREFS, ...(JSON.parse(raw) as Partial<AlertPrefs>) });
      }
    } catch {
      // mantém defaults
    }
  }, []);

  function togglePref(kind: AlertKind, value: boolean) {
    setPrefs((prev) => {
      const next = { ...prev, [kind]: value };
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  const alerts = useMemo(
    () => deriveAlerts(weather, details).filter((a) => prefs[a.kind]),
    [weather, details, prefs]
  );

  const theme = weather?.current.condition.theme ?? "cloudy";
  const isDay = weather?.current.isDay ?? true;
  const cityLabel =
    place?.label === "Sua localização"
      ? (weather?.locationName ?? place.label)
      : place?.label;

  return (
    <PageShell
      title="Alertas"
      subtitle={cityLabel}
      theme={theme}
      isDay={isDay}
      place={place}
    >
      {(pending || loading) && !errorMessage && (
        <p className="text-white/70" aria-busy="true">
          Verificando condições…
        </p>
      )}
      {errorMessage && (
        <p className="text-white/80" role="alert">
          {errorMessage}
        </p>
      )}

      {weather && (
        <>
          {alerts.length === 0 ? (
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-lg font-medium text-white">Tudo tranquilo por aqui</p>
              <p className="mt-1 text-sm text-white/65">
                Nenhum alerta ativo para {cityLabel} nas próximas horas.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {alerts.map((alert) => (
                <li
                  key={alert.kind}
                  className={`rounded-2xl border p-4 backdrop-blur-md ${
                    alert.severity === "warning"
                      ? "border-amber-300/40 bg-amber-400/15"
                      : "border-white/15 bg-white/10"
                  }`}
                >
                  <p className="text-sm font-semibold text-white">{alert.title}</p>
                  <p className="mt-1 text-sm text-white/75">{alert.description}</p>
                </li>
              ))}
            </ul>
          )}

          <section className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
            <h2 className="pt-2 text-[0.7rem] uppercase tracking-[0.16em] text-white/55">
              Tipos de alerta
            </h2>
            <div className="divide-y divide-white/10">
              {(Object.keys(ALERT_PREF_LABELS) as AlertKind[]).map((kind) => (
                <Toggle
                  key={kind}
                  label={ALERT_PREF_LABELS[kind].label}
                  description={ALERT_PREF_LABELS[kind].description}
                  checked={prefs[kind]}
                  onChange={(value) => togglePref(kind, value)}
                />
              ))}
            </div>
          </section>

          <p className="text-xs text-white/50">
            Os alertas são calculados a partir da previsão ao abrir o app. Notificações
            push estão no roadmap.
          </p>
        </>
      )}
    </PageShell>
  );
}
