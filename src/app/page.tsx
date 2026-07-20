import { WeatherShell } from "@/components/weather-shell";
import type { Place } from "@/hooks/use-place";

type HomeProps = {
  searchParams: Promise<{ lat?: string; lon?: string; label?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const lat = Number(params.lat);
  const lon = Number(params.lon);

  const initialPlace: Place | null =
    Number.isFinite(lat) && Number.isFinite(lon) && params.label
      ? { label: params.label, latitude: lat, longitude: lon }
      : null;

  return <WeatherShell initialPlace={initialPlace} />;
}
