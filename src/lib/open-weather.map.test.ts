import { describe, expect, it } from "vitest";
import { mapWeatherCode } from "@/lib/open-weather";

describe("mapWeatherCode", () => {
  it("maps clear day and night", () => {
    const day = mapWeatherCode(800, true, "céu limpo");
    expect(day.theme).toBe("clear-day");
    expect(day.icon).toBe("sun");
    expect(day.label).toBe("Céu limpo");

    const night = mapWeatherCode(800, false, "céu limpo");
    expect(night.theme).toBe("clear-night");
    expect(night.icon).toBe("moon");
  });

  it("maps rain, storm, and drizzle", () => {
    expect(mapWeatherCode(501, true, "chuva moderada").theme).toBe("rain");
    expect(mapWeatherCode(200, true, "tempestade").theme).toBe("storm");
    expect(mapWeatherCode(300, true, "garoa").theme).toBe("drizzle");
  });

  it("maps clouds and fog", () => {
    expect(mapWeatherCode(801, true, "poucas nuvens").icon).toBe("cloud-sun");
    expect(mapWeatherCode(804, true, "nublado").theme).toBe("cloudy");
    expect(mapWeatherCode(741, true, "neblina").theme).toBe("fog");
  });

  it("falls back when description is missing", () => {
    expect(mapWeatherCode(800, true).label).toBe("Desconhecido");
  });
});
