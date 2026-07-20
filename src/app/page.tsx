import type { Metadata } from "next";
import Link from "next/link";
import { HomeJsonLd } from "@/components/json-ld";
import { WeatherShell } from "@/components/weather-shell";
import type { Place } from "@/hooks/use-place";
import { pageMetadata, PAGE_SEO } from "@/lib/site";

type HomeProps = {
  searchParams: Promise<{ lat?: string; lon?: string; label?: string }>;
};

export const metadata: Metadata = {
  ...pageMetadata("home", "/"),
  title: { absolute: PAGE_SEO.home.title },
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const lat = Number(params.lat);
  const lon = Number(params.lon);

  const initialPlace: Place | null =
    Number.isFinite(lat) && Number.isFinite(lon) && params.label
      ? { label: params.label, latitude: lat, longitude: lon }
      : null;

  return (
    <>
      <HomeJsonLd />
      <div className="sr-only">
        <h1>Weatherly — clima com clareza</h1>
        <p>
          Previsão do tempo atual, horária e diária com geolocalização ou busca
          de cidade. Consulte também{" "}
          <Link href="/clima">clima por cidade</Link> e o{" "}
          <Link href="/blog">blog</Link>.
        </p>
      </div>
      <WeatherShell initialPlace={initialPlace} />
    </>
  );
}
