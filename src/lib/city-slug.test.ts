import { describe, expect, it } from "vitest";
import { slugify } from "./city-slug";

describe("slugify", () => {
  it("normaliza acentos e espaços", () => {
    expect(slugify("João Pessoa")).toBe("joao-pessoa");
    expect(slugify("São Paulo")).toBe("sao-paulo");
  });

  it("remove pontuação e colapsa hífens", () => {
    expect(slugify("  Rio -- de Janeiro!  ")).toBe("rio-de-janeiro");
  });
});
