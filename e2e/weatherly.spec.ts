import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import {
  mockGeocode,
  mockWeather,
  mockWeatherRecife,
} from "./fixtures";

async function mockApis(page: Page) {
  await page.route("**/api/weather**", async (route) => {
    const url = new URL(route.request().url());
    const lat = Number(url.searchParams.get("lat"));
    const body =
      Math.abs(lat - -8.0476) < 0.01 ? mockWeatherRecife : mockWeather;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  await page.route("**/api/geocode**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockGeocode),
    });
  });
}

async function allowGeolocation(context: BrowserContext) {
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({
    latitude: -7.1153,
    longitude: -34.8631,
  });
}

async function denyGeolocation(page: Page) {
  await page.addInitScript(() => {
    const denied = {
      code: 1 as const,
      message: "User denied Geolocation",
      PERMISSION_DENIED: 1 as const,
      POSITION_UNAVAILABLE: 2 as const,
      TIMEOUT: 3 as const,
    };

    const getCurrentPosition = (
      _success: PositionCallback,
      error?: PositionErrorCallback | null
    ) => {
      queueMicrotask(() => {
        error?.(denied as GeolocationPositionError);
      });
    };

    // Override methods instead of replacing navigator.geolocation
    // (Chromium may not allow redefining the property).
    navigator.geolocation.getCurrentPosition = getCurrentPosition;
    navigator.geolocation.watchPosition = () => 0;
  });
}

test.describe("Weatherly e2e", () => {
  test("home shows Weatherly brand", async ({ page }) => {
    await denyGeolocation(page);
    await mockApis(page);
    await page.goto("/");
    await expect(page.getByText("Weatherly").first()).toBeVisible();
  });

  test("geolocation + weather mock shows temperature in hero", async ({
    page,
    context,
  }) => {
    await allowGeolocation(context);
    await mockApis(page);
    await page.goto("/");

    const hero = page.getByRole("banner");
    await expect(hero.getByText("Weatherly")).toBeVisible();
    await expect(hero.getByText("28°", { exact: true })).toBeVisible({
      timeout: 10_000,
    });
    await expect(hero.getByText("Céu limpo")).toBeVisible();
    await expect(hero.getByText(/João Pessoa/i)).toBeVisible();
  });

  test("city search selects result and loads new weather", async ({ page }) => {
    await denyGeolocation(page);
    await mockApis(page);
    await page.goto("/");

    await expect(
      page.getByText(/Permissão de localização negada/i)
    ).toBeVisible({ timeout: 10_000 });

    const search = page.getByPlaceholder("Buscar cidade…");
    await search.fill("Recife");
    await expect(page.getByRole("option", { name: /Recife/i })).toBeVisible({
      timeout: 5000,
    });
    await page.getByRole("option", { name: /Recife/i }).click();

    const hero = page.getByRole("banner");
    await expect(hero.getByText("31°", { exact: true })).toBeVisible({
      timeout: 10_000,
    });
    await expect(hero.getByText(/Recife/i)).toBeVisible();
  });

  test("denied GPS shows fallback UI", async ({ page }) => {
    await denyGeolocation(page);
    await mockApis(page);
    await page.goto("/");

    await expect(
      page.getByText(/Permissão de localização negada/i)
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByRole("button", { name: /Tentar localização de novo/i })
    ).toBeVisible();
    await expect(page.getByPlaceholder("Buscar cidade…")).toBeVisible();
  });
});
