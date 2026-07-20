import { NextRequest, NextResponse } from "next/server";
import { DETAILS_REVALIDATE_SECONDS, fetchDetails } from "@/lib/details";

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
    const details = await fetchDetails(lat, lon);
    return NextResponse.json(details, {
      headers: {
        "Cache-Control": `s-maxage=${DETAILS_REVALIDATE_SECONDS}, stale-while-revalidate`,
      },
    });
  } catch (err) {
    console.error("[api/details]", err);
    const message =
      err instanceof Error && err.message.includes("OPENWEATHERMAP_API_KEY")
        ? "API key do OpenWeatherMap não configurada."
        : "Não foi possível obter os detalhes.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
