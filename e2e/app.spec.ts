import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
const origin = "http://localhost:3210";
const credentials = () =>
  JSON.parse(readFileSync(".tmp/e2e-credentials.json", "utf8"));
test("homepage, keyboard autocomplete and typo search", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Find an alternative",
  );
  const search = page.getByRole("combobox");
  await search.fill("photosop");
  await expect(page.getByRole("option")).toContainText("Adobe Photoshop");
  await search.press("ArrowDown");
  await search.press("Enter");
  await expect(page).toHaveURL(/alternatives\/photoshop/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Photoshop alternatives",
  );
  expect(errors).toEqual([]);
});
test("filters, empty states, table and durable query parameters", async ({
  page,
}) => {
  await page.goto("/alternatives/photoshop");
  await page.getByLabel("Open source", { exact: true }).check();
  await expect(page.locator(".alternative-card")).toHaveCount(2);
  await page.reload();
  await expect(page.getByLabel("Open source", { exact: true })).toBeChecked();
  await page.getByRole("button", { name: "Compare table" }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await page.getByLabel("iOS", { exact: true }).check();
  await expect(
    page.getByRole("heading", { name: "No matching software" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await expect(page.getByRole("table")).toBeVisible();
});
test("personalized matching explains factors and hard exclusions", async ({
  page,
}) => {
  await page.goto("/find?current=photoshop");
  await page.getByLabel("Operating system").selectOption("linux");
  await page.getByLabel("Open source", { exact: true }).selectOption("require");
  await page.getByRole("button", { name: "Find my alternatives" }).click();
  await expect(
    page.getByRole("heading", { name: "Your alternatives" }),
  ).toBeVisible();
  await expect(page.locator(".alternative-card")).toHaveCount(2);
  await expect(page.locator(".factor-list").first()).toContainText("met");
  await page.getByLabel("Operating system").selectOption("ios");
  await page.getByRole("button", { name: "Find my alternatives" }).click();
  await expect(
    page.getByRole("heading", {
      name: "No verified match for these requirements",
    }),
  ).toBeVisible();
});
test("software evidence, comparison and metadata", async ({
  page,
  request,
}) => {
  await page.goto("/software/gimp");
  await expect(
    page.getByRole("heading", { name: "GIMP", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#sources")).toContainText("2026-09-21");
  const structured = await page
    .locator('script[type="application/ld+json"]')
    .last()
    .evaluate((el) => JSON.parse(el.textContent ?? "{}"));
  expect(structured["@type"]).toBe("SoftwareApplication");
  await page.goto("/compare/obsidian-vs-notion");
  await expect(page).toHaveURL(/notion-vs-obsidian/);
  await expect(page.getByRole("table")).toContainText("Offline");
  const response = await request.get("/alternatives/photoshop?filters=free");
  expect(await response.text()).toContain("noindex");
  const thin = await request.get("/alternatives/photoshop/linux");
  expect(thin.status()).toBe(404);
});
test("security endpoints reject anonymous, cross-origin and malformed writes", async ({
  request,
}) => {
  expect((await request.get("/api/admin/software")).status()).toBe(401);
  expect(
    (
      await request.post("/api/admin/software", {
        headers: { origin },
        data: {},
      })
    ).status(),
  ).toBe(401);
  expect(
    (
      await request.post("/api/admin/login", {
        headers: { origin: "https://evil.test" },
        data: credentials(),
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/match", {
        data: {
          current: "photoshop",
          criteria: [
            {
              kind: "flag",
              key: "openSource",
              value: true,
              weight: -1,
              hard: true,
            },
          ],
        },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/match", {
        data: {
          current: "photoshop",
          criteria: [
            {
              kind: "platform",
              key: "linux",
              value: "linux",
              weight: 1,
              hard: false,
            },
            {
              kind: "platform",
              key: "duplicate",
              value: "linux",
              weight: 10,
              hard: false,
            },
          ],
        },
      })
    ).status(),
  ).toBe(400);
  expect((await request.get("/api/search?q=vs%20code")).status()).toBe(200);
});
test("admin login, validation, create and edit with persistence", async ({
  page,
}) => {
  await page.goto("/admin");
  await page
    .getByLabel("Username", { exact: true })
    .fill(credentials().username);
  await page
    .getByLabel("Password", { exact: true })
    .fill(credentials().password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Catalogue manager" }),
  ).toBeVisible();
  const records = await page.request.get("/api/admin/software?q=gimp");
  expect(records.status()).toBe(200);
  const product = (await records.json()).items.find(
    (item: { slug: string }) => item.slug === "gimp",
  );
  const unsupportedPlan = await page.request.post("/api/admin/software", {
    headers: { origin },
    data: {
      ...product,
      plans: [
        ...product.plans,
        {
          id: "unsupported-billing",
          name: "Unverified one-time option",
          amount: null,
          currency: null,
          period: "one-time",
          notes: "No verified source.",
        },
      ],
    },
  });
  expect(unsupportedPlan.status()).toBe(400);
  expect((await unsupportedPlan.json()).error).toContain(
    "plan:unsupported-billing",
  );
  await page.getByRole("button", { name: "categories", exact: true }).click();
  await page.getByRole("button", { name: "Create record" }).click();
  const slug = "test-category-" + Date.now();
  await page.getByLabel("slug", { exact: true }).fill(slug);
  await page.getByLabel("name", { exact: true }).fill("Browser test category");
  await page.getByRole("button", { name: "Save record" }).click();
  await expect(page.getByRole("status")).toContainText("Saved");
  await page
    .getByLabel("name", { exact: true })
    .fill("Updated browser category");
  await page.getByRole("button", { name: "Save record" }).click();
  await expect(page.getByRole("status")).toContainText("Saved");
  await page.reload();
  await page.getByRole("button", { name: "categories", exact: true }).click();
  await page.getByLabel("Search records").fill(slug);
  await page.getByRole("button", { name: "Search / filter" }).click();
  await expect(page.locator(".admin-list")).toContainText(
    "Updated browser category",
  );
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(
    page.getByRole("heading", { name: "Welcome back." }),
  ).toBeVisible();
});
test("published routes, sitemap, robots and broken links", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("/alternatives/photoshop/free");
  expect(xml).not.toContain("/categories/accounting");
  expect(xml).not.toContain("?filters");
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname,
  );
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(await response.text(), path).not.toContain(
      "We couldn’t load this page",
    );
  }
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /admin");
  const response = await request.get("/");
  const html = await response.text();
  const links = [
    ...new Set(
      [...html.matchAll(/href="(\/[^"#?]*)"/g)]
        .map((m) => m[1])
        .filter((p) => !p.startsWith("/_next")),
    ),
  ];
  for (const href of links) {
    expect((await request.get(href)).status(), href).toBeLessThan(400);
  }
  expect((await request.get("/software/missing")).status()).toBe(404);
  expect((await request.get("/compare/photoshop-vs-slack")).status()).toBe(404);
});
test("responsive layouts, accessibility and clean console", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const route of [
    "/",
    "/software/gimp",
    "/alternatives/photoshop",
    "/find",
    "/compare/notion-vs-obsidian",
    "/admin",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      audit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      route,
    ).toEqual([]);
  }
  await page.goto("/");
  await page.screenshot({ path: info.outputPath("homepage-viewport.png") });
  await page.screenshot({
    path: info.outputPath("homepage.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
