import { describe, expect, it } from "vitest";
import {
  formatHour,
  formatTemp,
  formatWeekday,
  formatWind,
} from "@/lib/format";

describe("formatTemp", () => {
  it("rounds and appends degree symbol", () => {
    expect(formatTemp(27.4)).toBe("27°");
    expect(formatTemp(27.6)).toBe("28°");
  });
});

describe("formatWind", () => {
  it("rounds km/h", () => {
    expect(formatWind(12.4)).toBe("12 km/h");
    expect(formatWind(12.6)).toBe("13 km/h");
  });
});

describe("formatHour", () => {
  it("formats time in pt-BR", () => {
    const label = formatHour("2026-07-20T15:00:00.000Z");
    expect(label).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe("formatWeekday", () => {
  it("returns capitalized short weekday", () => {
    const label = formatWeekday("2026-07-20");
    expect(label.length).toBeGreaterThan(0);
    expect(label[0]).toBe(label[0].toUpperCase());
  });
});
