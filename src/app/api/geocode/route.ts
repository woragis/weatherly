import { NextRequest, NextResponse } from "next/server";
import { fetchGeocode, REVALIDATE_SECONDS } from "@/lib/open-meteo";

export const revalidate = REVALIDATE_SECONDS;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json(
      { error: "Informe pelo menos 2 caracteres (q)." },
      { status: 400 }
    );
  }

  try {
    const results = await fetchGeocode(q);
    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control": `s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate`,
        },
      }
    );
  } catch (err) {
    console.error("[api/geocode]", err);
    return NextResponse.json(
      { error: "Não foi possível buscar cidades." },
      { status: 502 }
    );
  }
}
