import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  owmCurrentFixture,
  owmForecastFixture,
  owmGeocodeFixture,
} from "@/test/fixtures/owm";
import { fetchForecast, fetchGeocode } from "@/lib/open-weather";

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("fetchForecast (integration)", () => {
  beforeEach(() => {
    process.env.OPENWEATHERMAP_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/data/2.5/weather")) {
          return jsonResponse(owmCurrentFixture);
        }
        if (url.includes("/data/2.5/forecast")) {
          return jsonResponse(owmForecastFixture);
        }
        return jsonResponse({ message: "not found" }, 404);
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("normalizes current, hourly, and daily payload", async () => {
    const payload = await fetchForecast(-7.1153, -34.8631);

    expect(payload.locationName).toBe("João Pessoa, BR");
    expect(payload.current.temperature).toBe(28.4);
    expect(payload.current.feelsLike).toBe(30.1);
    expect(payload.current.humidity).toBe(66);
    expect(payload.current.windSpeed).toBeCloseTo(12.6);
    expect(payload.current.condition.theme).toBe("clear-day");
    expect(payload.hourly.length).toBeGreaterThan(0);
    expect(payload.hourly[0]?.precipitationProbability).toBe(10);
    expect(payload.daily.length).toBeGreaterThanOrEqual(1);
    expect(payload.daily[0]?.tempMax).toBeGreaterThanOrEqual(
      payload.daily[0]?.tempMin ?? 0
    );
  });

  it("throws when upstream forecast fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ message: "fail" }, 500))
    );
    await expect(fetchForecast(-7, -34)).rejects.toThrow(/failed: 500/);
  });
});

describe("fetchGeocode (integration)", () => {
  beforeEach(() => {
    process.env.OPENWEATHERMAP_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse(owmGeocodeFixture))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("maps geocode results with Portuguese labels", async () => {
    const results = await fetchGeocode("João");
    expect(results).toHaveLength(2);
    expect(results[0]?.label).toContain("João Pessoa");
    expect(results[0]?.latitude).toBeCloseTo(-7.11532);
  });
});
