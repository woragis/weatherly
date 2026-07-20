import { afterEach, describe, expect, it } from "vitest";
import { pageMetadata, PAGE_SEO, siteUrl } from "./site";

describe("site", () => {
  const prevApp = process.env.APP_URL;
  const prevPublic = process.env.NEXT_PUBLIC_APP_URL;

  afterEach(() => {
    if (prevApp === undefined) delete process.env.APP_URL;
    else process.env.APP_URL = prevApp;
    if (prevPublic === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = prevPublic;
  });

  it("siteUrl usa APP_URL quando definido", () => {
    process.env.APP_URL = "https://example.test/";
    expect(siteUrl().origin).toBe("https://example.test");
  });

  it("siteUrl cai no fallback de produção sem env", () => {
    delete process.env.APP_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;
    expect(siteUrl().origin).toBe("https://saas-weatherly.vercel.app");
  });

  it("pageMetadata monta canonical e OG", () => {
    const meta = pageMetadata("blog", "/blog");
    expect(meta.title).toBe(PAGE_SEO.blog.title);
    expect(meta.description).toBe(PAGE_SEO.blog.description);
    expect(meta.alternates.canonical).toBe("/blog");
    expect(meta.openGraph.url).toBe("/blog");
    expect(meta.twitter.card).toBe("summary_large_image");
  });
});
