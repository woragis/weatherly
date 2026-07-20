import { expect, test } from "@playwright/test";

test.describe("Weatherly SEO pages", () => {
  test("blog lists posts and opens a slug", async ({ page }) => {
    await page.goto("/blog");
    await expect(
      page.getByRole("heading", { name: "Blog", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: /Como ler UV e qualidade do ar/i,
      })
    ).toBeVisible();

    await page
      .getByRole("link", { name: /Como ler UV e qualidade do ar/i })
      .click();
    await expect(
      page.getByRole("heading", {
        name: /Como ler UV e qualidade do ar/i,
      })
    ).toBeVisible();
  });

  test("clima index lists cities and links to slug", async ({ page }) => {
    await page.goto("/clima");
    await expect(
      page.getByRole("heading", { name: "Clima por cidade" })
    ).toBeVisible();

    const jp = page.getByRole("link", { name: /João Pessoa, PB/i });
    await expect(jp).toBeVisible();
    await expect(jp).toHaveAttribute("href", "/clima/joao-pessoa-pb");
  });

  test("city page shows SSR weather shell and app CTA", async ({ page }) => {
    await page.goto("/clima/joao-pessoa-pb");
    await expect(
      page.getByRole("heading", { name: /Clima em João Pessoa/i })
    ).toBeVisible({ timeout: 20_000 });
    await expect(
      page.getByRole("link", { name: /Abrir no app/i })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Abrir no app/i })).toHaveAttribute(
      "href",
      /\?lat=/
    );
  });

  test("robots.txt and sitemap.xml are published", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    const robotsBody = await robots.text();
    expect(robotsBody).toContain("Sitemap:");
    expect(robotsBody).toContain("Disallow: /api/");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const xml = await sitemap.text();
    expect(xml).toContain("/clima/");
    expect(xml).toContain("/blog/");
    expect(xml).toContain("joao-pessoa-pb");
  });
});
