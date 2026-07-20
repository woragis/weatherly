"use client";

import { AppNav } from "@/components/app-nav";
import { SiteLinks } from "@/components/site-links";
import type { Place } from "@/hooks/use-place";
import type { WeatherTheme } from "@/lib/open-weather";

type PageShellProps = {
  title: string;
  subtitle?: string;
  theme?: WeatherTheme;
  isDay?: boolean;
  place?: Place | null;
  children: React.ReactNode;
};

export function PageShell({
  title,
  subtitle,
  theme = "cloudy",
  isDay = true,
  place,
  children,
}: PageShellProps) {
  const atmosphereClass = `atmosphere theme-${theme} ${isDay ? "is-day" : "is-night"}`;

  return (
    <div className={`weather-shell min-h-dvh ${atmosphereClass}`}>
      <div className="atmosphere-overlay pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-6 px-5 pb-28 pt-8 sm:px-6">
        <header className="hero-block flex flex-col gap-1">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-white">
            {title}
          </p>
          {subtitle && (
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
              {subtitle}
            </p>
          )}
        </header>
        {children}
        <SiteLinks />
      </div>
      <AppNav place={place} />
    </div>
  );
}
