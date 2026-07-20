"use client";

import { PageShell } from "@/components/page-shell";
import { usePlace } from "@/hooks/use-place";

const LEGEND = [
  { color: "bg-sky-300", label: "Fraca" },
  { color: "bg-blue-500", label: "Moderada" },
  { color: "bg-amber-400", label: "Forte" },
  { color: "bg-red-500", label: "Muito forte" },
];

export function radarEmbedUrl(lat: number, lon: number): string {
  return `https://www.rainviewer.com/map.html?loc=${lat},${lon},7&oCS=1&c=3&o=83&lm=0&layer=radar&sm=1&sn=1&hu=false`;
}

export function RadarScreen() {
  const { place, pending, errorMessage, requestGeo } = usePlace();

  return (
    <PageShell title="Radar de chuva" subtitle={place?.label} place={place}>
      {pending && (
        <p className="text-white/70" aria-busy="true">
          Obtendo sua localização…
        </p>
      )}
      {errorMessage && (
        <div className="flex flex-col gap-3">
          <p className="text-white/80" role="alert">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={requestGeo}
            className="w-fit rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
          >
            Tentar localização de novo
          </button>
        </div>
      )}

      {place && (
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-white/20 shadow-lg">
            <iframe
              title={`Radar de precipitação — ${place.label}`}
              src={radarEmbedUrl(place.latitude, place.longitude)}
              className="h-[60vh] min-h-80 w-full border-0"
              loading="lazy"
              allow="fullscreen"
            />
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
            <span className="text-[0.7rem] uppercase tracking-[0.14em] text-white/55">
              Intensidade
            </span>
            <ul className="flex flex-wrap items-center gap-3">
              {LEGEND.map((item) => (
                <li key={item.label} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs text-white/80">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/50">
            Dados de radar em tempo real fornecidos por RainViewer.
          </p>
        </div>
      )}
    </PageShell>
  );
}
