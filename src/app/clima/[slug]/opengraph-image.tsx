import { ImageResponse } from "next/og";
import { cityLabel, getCity } from "@/lib/cities";
import { formatTemp } from "@/lib/format";
import { fetchForecast } from "@/lib/open-weather";

export const alt = "Clima na cidade — Weatherly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function CityOgImage({ params }: Props) {
  const { slug } = await params;
  const city = getCity(slug);
  const label = city ? cityLabel(city) : "Clima";
  let tempLine = "Previsão do tempo";

  if (city) {
    try {
      const weather = await fetchForecast(city.lat, city.lon);
      tempLine = `${formatTemp(weather.current.temperature)} · ${weather.current.condition.label}`;
    } catch {
      tempLine = `${city.name}, ${city.state}`;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 64,
          background: "linear-gradient(165deg, #3d4f63 0%, #53677c 45%, #6e8499 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.75, marginBottom: 8 }}>Weatherly</div>
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -1 }}>{label}</div>
        <div style={{ fontSize: 32, opacity: 0.92, marginTop: 16 }}>{tempLine}</div>
      </div>
    ),
    { ...size }
  );
}
