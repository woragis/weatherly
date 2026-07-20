import { NextRequest, NextResponse } from "next/server";
import { fetchForecast, REVALIDATE_SECONDS } from "@/lib/open-meteo";

export const revalidate = REVALIDATE_SECONDS;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json(
      { error: "Parâmetros lat e lon são obrigatórios." },
      { status: 400 }
    );
  }
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json(
      { error: "Coordenadas fora do intervalo válido." },
      { status: 400 }
    );
  }

  try {
    const weather = await fetchForecast(lat, lon);
    return NextResponse.json(weather, {
      headers: {
        "Cache-Control": `s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate`,
      },
    });
  } catch (err) {
    console.error("[api/weather]", err);
    return NextResponse.json(
      { error: "Não foi possível obter a previsão." },
      { status: 502 }
    );
  }
}
