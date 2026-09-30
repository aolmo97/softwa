import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
const origin = "http://localhost:3210";
const credentials = () =>
  JSON.parse(readFileSync(".tmp/e2e-credentials.json", "utf8"));

test("consented traffic reaches the protected dashboard and can be exported", async ({
  page,
  context,
  request,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  expect((await request.get("/api/admin/analytics")).status()).toBe(401);
  expect((await request.get("/api/admin/analytics?format=csv")).status()).toBe(
    401,
  );
  expect(
    (
      await request.post("/api/admin/login", {
        headers: { origin },
        data: credentials(),
      })
    ).status(),
  ).toBe(200);
  const before = await (
    await request.get("/api/admin/analytics?range=day")
  ).json();
  await page.goto("/");
  expect(
    (await context.cookies()).some((cookie) => cookie.name === "sa_visitor"),
  ).toBe(false);
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url() === origin + "/api/analytics" &&
        response.request().postDataJSON()?.name === "page_view",
    ),
    page.getByRole("button", { name: "Allow analytics", exact: true }).click(),
  ]);
  const visitor = (await context.cookies()).find(
    (cookie) => cookie.name === "sa_visitor",
  )!;
  const visit = (await context.cookies()).find(
    (cookie) => cookie.name === "sa_visit",
  )!;
  expect(visitor.httpOnly).toBe(true);
  expect(visit.expires - Date.now() / 1000).toBeGreaterThan(1700);
  await page.getByRole("combobox").fill("photosop");
  await page.getByRole("combobox").press("ArrowDown");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url() === origin + "/api/analytics" &&
        response.request().postDataJSON()?.name === "search",
    ),
    page.getByRole("combobox").press("Enter"),
  ]);
  await expect(page).toHaveURL(/alternatives\/photoshop/);
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url() === origin + "/api/analytics" &&
        response.request().postDataJSON()?.name === "page_view",
    ),
    page.goto("/software/gimp"),
  ]);
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "sa_visitor")
      ?.value,
  ).toBe(visitor.value);
  await context.addCookies([
    { ...visit, expires: Math.floor(Date.now() / 1000) - 1 },
  ]);
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url() === origin + "/api/analytics" &&
        response.request().postDataJSON()?.name === "page_view",
    ),
    page.reload(),
  ]);
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "sa_visit")
      ?.value,
  ).not.toBe(visit.value);
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "sa_visitor")
      ?.value,
  ).toBe(visitor.value);
  const after = await (
    await request.get("/api/admin/analytics?range=day")
  ).json();
  expect(after.totals.visitors).toBe(before.totals.visitors + 1);
  expect(after.totals.sessions).toBe(before.totals.sessions + 2);
  expect(after.totals.searches).toBe(before.totals.searches + 1);
  expect(
    after.topSearched.some(
      (row: { label: string }) => row.label === "Adobe Photoshop",
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Analytics preferences", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Decline analytics", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Decline analytics", exact: true }),
  ).toHaveCount(0);
  expect(
    (await context.cookies()).some((cookie) =>
      ["sa_visitor", "sa_visit"].includes(cookie.name),
    ),
  ).toBe(false);
  await page.goto("/admin");
  await page
    .getByLabel("Username", { exact: true })
    .fill(credentials().username);
  await page
    .getByLabel("Password", { exact: true })
    .fill(credentials().password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("button", { name: "Analytics", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Site analytics" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Most searched tools" }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Period", exact: true })
    .selectOption("week");
  await page
    .getByRole("combobox", { name: "Group by", exact: true })
    .selectOption("week");
  await page.getByRole("button", { name: "Update statistics" }).click();
  await expect(
    page.getByRole("heading", { name: "Visitors by week" }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Group by", exact: true })
    .selectOption("month");
  await page.getByRole("button", { name: "Update statistics" }).click();
  await expect(
    page.getByRole("heading", { name: "Visitors by month" }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Period", exact: true })
    .selectOption("custom");
  const today = new Date().toISOString().slice(0, 10);
  await page.getByLabel("From", { exact: true }).fill(today);
  await page.getByLabel("To", { exact: true }).fill(today);
  await page.getByRole("button", { name: "Update statistics" }).click();
  await expect(
    page.getByText("Showing " + today + " to " + today, { exact: false }),
  ).toBeVisible();
  const href = await page
    .getByRole("link", { name: "Download CSV" })
    .getAttribute("href");
  const csv = await page.request.get(href!);
  expect(csv.status()).toBe(200);
  expect(csv.headers()["content-type"]).toContain("text/csv");
  expect(await csv.text()).toContain('"total","visitors"');
  expect(
    (
      await request.get(
        "/api/admin/analytics?range=custom&from=2099-01-01&to=2099-01-02",
      )
    ).status(),
  ).toBe(400);
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: info.outputPath("analytics-dashboard.png"),
    fullPage: true,
  });
  await page.request.post("/api/analytics/consent", {
    headers: { origin },
    data: { choice: "accepted" },
  });
  await page.request.post("/api/analytics", {
    headers: { origin },
    data: { id: randomUUID(), name: "page_view", path: "/" },
  });
  const final = await (
    await request.get("/api/admin/analytics?range=day")
  ).json();
  expect(final.totals.pageViews).toBe(after.totals.pageViews);
  expect(errors).toEqual([]);
});

test("collection rejects cross-origin and raw data and honours privacy choices", async ({
  request,
}) => {
  const input = { id: randomUUID(), name: "page_view", path: "/" };
  expect(
    (
      await request.post("/api/analytics", {
        headers: { origin: "https://other.example" },
        data: input,
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/analytics", { headers: { origin }, data: input })
    ).status(),
  ).toBe(204);
  expect(
    (await request.storageState()).cookies.some(
      (cookie) => cookie.name === "sa_visitor",
    ),
  ).toBe(false);
  expect(
    (
      await request.post("/api/analytics/consent", {
        headers: { origin: "https://other.example" },
        data: { choice: "accepted" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/analytics/consent", {
        headers: { origin },
        data: { choice: "accepted" },
      })
    ).status(),
  ).toBe(200);
  const privacyHeaders: Array<Record<string, string>> = [
    { dnt: "1" },
    { "sec-gpc": "1" },
    { "user-agent": "ExampleBot" },
  ];
  for (const headers of privacyHeaders)
    expect(
      (
        await request.post("/api/analytics", {
          headers: { origin, ...headers },
          data: input,
        })
      ).status(),
    ).toBe(204);
  expect(
    (await request.storageState()).cookies.some(
      (cookie) => cookie.name === "sa_visitor",
    ),
  ).toBe(false);
  expect(
    (
      await request.post("/api/analytics", {
        headers: { origin },
        data: { ...input, query: "private@example.com" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/analytics", {
        headers: { origin },
        data: { ...input, path: "/admin" },
      })
    ).status(),
  ).toBe(204);
  expect(
    (await request.storageState()).cookies.some(
      (cookie) => cookie.name === "sa_visitor",
    ),
  ).toBe(false);
  expect(
    (
      await request.post("/api/analytics", { headers: { origin }, data: input })
    ).status(),
  ).toBe(204);
  expect(
    (await request.storageState()).cookies.some(
      (cookie) => cookie.name === "sa_visitor",
    ),
  ).toBe(true);
  await request.post("/api/analytics/consent", {
    headers: { origin },
    data: { choice: "declined" },
  });
  await request.post("/api/analytics", {
    headers: { origin },
    data: { ...input, id: randomUUID() },
  });
  expect(
    (await request.storageState()).cookies.some((cookie) =>
      ["sa_visitor", "sa_visit"].includes(cookie.name),
    ),
  ).toBe(false);
});
