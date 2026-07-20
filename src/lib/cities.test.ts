import { describe, expect, it } from "vitest";
import { cityLabel, getCity, listCities } from "./cities";

describe("cities catalog", () => {
  it("lista cidades com slugs únicos", () => {
    const cities = listCities();
    expect(cities.length).toBeGreaterThanOrEqual(27);
    const slugs = cities.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("resolve João Pessoa pelo slug", () => {
    const city = getCity("joao-pessoa-pb");
    expect(city).not.toBeNull();
    expect(city?.name).toBe("João Pessoa");
    expect(cityLabel(city!)).toBe("João Pessoa, PB");
  });

  it("retorna null para slug inexistente", () => {
    expect(getCity("cidade-que-nao-existe")).toBeNull();
  });
});
