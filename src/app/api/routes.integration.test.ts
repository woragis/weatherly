import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const fetchForecast = vi.fn();
const fetchGeocode = vi.fn();

vi.mock("@/lib/open-weather", () => ({
  REVALIDATE_SECONDS: 900,
  fetchForecast: (...args: unknown[]) => fetchForecast(...args),
  fetchGeocode: (...args: unknown[]) => fetchGeocode(...args),
}));

describe("GET /api/weather", () => {
  beforeEach(() => {
    fetchForecast.mockReset();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("returns 400 when lat/lon missing", async () => {
    const { GET } = await import("@/app/api/weather/route");
    const res = await GET(
      new NextRequest("http://localhost/api/weather?lat=abc&lon=-34")
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/lat e lon/i);
  });

  it("returns 400 when coordinates out of range", async () => {
    const { GET } = await import("@/app/api/weather/route");
    const res = await GET(
      new NextRequest("http://localhost/api/weather?lat=99&lon=-34")
    );
    expect(res.status).toBe(400);
  });

  it("returns 200 with mocked forecast", async () => {
    fetchForecast.mockResolvedValue({
      latitude: -7.1,
      longitude: -34.8,
      timezone: "UTC-3",
      current: { temperature: 28 },
      hourly: [],
      daily: [],
    });
    const { GET } = await import("@/app/api/weather/route");
    const res = await GET(
      new NextRequest("http://localhost/api/weather?lat=-7.1&lon=-34.8")
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.current.temperature).toBe(28);
    expect(fetchForecast).toHaveBeenCalledWith(-7.1, -34.8);
  });

  it("returns 502 when upstream fails", async () => {
    fetchForecast.mockRejectedValue(new Error("OpenWeatherMap boom"));
    const { GET } = await import("@/app/api/weather/route");
    const res = await GET(
      new NextRequest("http://localhost/api/weather?lat=-7.1&lon=-34.8")
    );
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toMatch(/previsão/i);
  });

  it("returns clear message when API key missing", async () => {
    fetchForecast.mockRejectedValue(
      new Error("OPENWEATHERMAP_API_KEY não configurada.")
    );
    const { GET } = await import("@/app/api/weather/route");
    const res = await GET(
      new NextRequest("http://localhost/api/weather?lat=-7.1&lon=-34.8")
    );
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toMatch(/API key/i);
  });
});

describe("GET /api/geocode", () => {
  beforeEach(() => {
    fetchGeocode.mockReset();
  });

  it("returns 400 for short query", async () => {
    const { GET } = await import("@/app/api/geocode/route");
    const res = await GET(new NextRequest("http://localhost/api/geocode?q=a"));
    expect(res.status).toBe(400);
  });

  it("returns 200 with results", async () => {
    fetchGeocode.mockResolvedValue([
      {
        id: 1,
        name: "João Pessoa",
        latitude: -7.1,
        longitude: -34.8,
        country: "BR",
        label: "João Pessoa, Paraíba, BR",
      },
    ]);
    const { GET } = await import("@/app/api/geocode/route");
    const res = await GET(
      new NextRequest("http://localhost/api/geocode?q=Joao")
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results).toHaveLength(1);
  });

  it("returns 502 when upstream fails", async () => {
    fetchGeocode.mockRejectedValue(new Error("fail"));
    const { GET } = await import("@/app/api/geocode/route");
    const res = await GET(
      new NextRequest("http://localhost/api/geocode?q=Joao")
    );
    expect(res.status).toBe(502);
  });
});
