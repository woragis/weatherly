"use client";

import { PageShell } from "@/components/page-shell";
import { Toggle } from "@/components/toggle";
import { useSettings, type TempUnit, type WindUnit } from "@/lib/settings";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm font-medium text-white">{label}</span>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex rounded-full border border-white/20 bg-white/10 p-0.5"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition ${
              value === option.value
                ? "bg-white/25 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
      <h2 className="pt-2 text-[0.7rem] uppercase tracking-[0.16em] text-white/55">
        {title}
      </h2>
      <div className="divide-y divide-white/10">{children}</div>
    </section>
  );
}

export function SettingsScreen() {
  const { settings, update } = useSettings();

  return (
    <PageShell title="Ajustes" subtitle="Unidades e aparência">
      <div className="flex flex-col gap-4">
        <Section title="Unidades">
          <Segmented<TempUnit>
            label="Temperatura"
            value={settings.tempUnit}
            options={[
              { value: "c", label: "°C" },
              { value: "f", label: "°F" },
            ]}
            onChange={(tempUnit) => update({ tempUnit })}
          />
          <Segmented<WindUnit>
            label="Vento"
            value={settings.windUnit}
            options={[
              { value: "kmh", label: "km/h" },
              { value: "ms", label: "m/s" },
            ]}
            onChange={(windUnit) => update({ windUnit })}
          />
        </Section>

        <Section title="Aparência">
          <Toggle
            label="Animações"
            description="Transições de tema e entradas suaves das seções"
            checked={settings.animations}
            onChange={(animations) => update({ animations })}
          />
        </Section>

        <Section title="Sobre">
          <div className="py-3">
            <p className="text-sm font-medium text-white">Weatherly</p>
            <p className="mt-1 text-xs text-white/60">
              Clima com clareza. Dados de OpenWeatherMap, UV de Open-Meteo e radar de
              RainViewer. Projeto de portfólio — web em Next.js, mobile em Expo.
            </p>
          </div>
        </Section>
      </div>
    </PageShell>
  );
}
