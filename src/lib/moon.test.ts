import { describe, expect, it } from "vitest";
import { moonInfo } from "./moon";

describe("moonInfo", () => {
  it("identifica lua nova na data de referência", () => {
    const info = moonInfo(new Date(Date.UTC(2000, 0, 6, 18, 14)));
    expect(info.label).toBe("Lua nova");
    expect(info.illumination).toBe(0);
  });

  it("identifica lua cheia ~14,8 dias após a lua nova", () => {
    const full = new Date(Date.UTC(2000, 0, 21, 4, 40));
    const info = moonInfo(full);
    expect(info.label).toBe("Lua cheia");
    expect(info.illumination).toBeGreaterThan(95);
  });

  it("retorna fase entre 0 e 1 para qualquer data", () => {
    const info = moonInfo(new Date("1990-05-15T00:00:00Z"));
    expect(info.phase).toBeGreaterThanOrEqual(0);
    expect(info.phase).toBeLessThan(1);
  });
});
