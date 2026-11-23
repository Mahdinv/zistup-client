// Run with Node and Playwright; PLAYWRIGHT_MODULE_PATH may point to an existing installation.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createServer } from "vite";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
);
const plan = {
  success: true,
  data: {
    created_at_utc: "2026-11-14 16:48:07",
    diet: { key: "zistpa", title: "زیستاپ" },
    isConfirm: true,
    shopping: { basis: "week", groups: [] },
    days: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      meals: [
        {
          id: `breakfast-${i + 1}`,
          key: "breakfast",
          title: "صبحانه",
          main: {
            id: `recipe-${i + 1}`,
            food_id: i + 1,
            type: "recipe",
            title: `Meal ${i + 1}`,
            quantity: { grams: 100, servings: 1, unit: "gram" },
            nutrition: {
              calories_kcal: 200,
              protein_g: 10,
              carbohydrate_g: 20,
              fiber_g: 3,
            },
          },
        },
      ],
    })),
  },
};
const server = await createServer({
  cacheDir: "node_modules/.vite-weekly-confirmation-test",
  server: { host: "127.0.0.1", port: 0 },
  plugins: [
    {
      name: "weekly-confirmation-harness",
      configureServer(vite) {
        vite.middlewares.use("/__weekly-confirmation", async (req, res) => {
          res.setHeader("Content-Type", "text/html");
          res.end(
            await vite.transformIndexHtml(
              req.originalUrl,
              '<html lang="fa" dir="rtl"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module" src="/tests/fixtures/weekly-confirmation-harness.tsx"></script></body></html>',
            ),
          );
        });
      },
    },
  ],
});
await server.listen();
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE_PATH
    ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH }
    : { channel: process.env.BROWSER_CHANNEL || "msedge" }),
});
const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
let weeklyRequests = 0;
let registeredRequests = 0;
const confirmations = [];
let weeklyRequest;
let confirmationRequest;
await page.route("**/diet/v2/plan?diet=zistpa", async (route) => {
  weeklyRequests++;
  weeklyRequest = route;
});
await page.route("**/diet/v2/plan/confirm", async (route) => {
  assert.equal(route.request().method(), "POST");
  confirmations.push(route.request().postDataJSON());
  confirmationRequest = route;
});
await page.route("**/diet/v2/plan/registered", async (route) => {
  registeredRequests++;
  await route.fulfill({ json: plan });
});

async function waitFor(predicate) {
  for (let i = 0; i < 100 && !predicate(); i++) await page.waitForTimeout(20);
  assert.ok(predicate());
}

try {
  await page.goto(`${server.resolvedUrls.local[0]}__weekly-confirmation`);
  const button = page.locator("button").filter({ hasText: /^تایید برنامه$/ });
  await button.waitFor();
  assert.equal(
    await button.isDisabled(),
    true,
    "Wait for a ready plan before confirmation",
  );
  await waitFor(() => weeklyRequests === 1);
  await weeklyRequest.fulfill({ json: plan });
  await page.waitForFunction(() =>
    [...document.querySelectorAll("button")].some(
      (el) => el.textContent.trim() === "تایید برنامه" && !el.disabled,
    ),
  );

  const fonts = [];
  for (const viewport of [
    { width: 320, height: 640 },
    { width: 768, height: 900 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    const container = await page.getByTestId("weekly-container").boundingBox();
    const before = await button.boundingBox();
    const scroll = page.locator(".overflow-y-auto").first();
    assert.ok(await scroll.evaluate((el) => el.scrollHeight > el.clientHeight));
    await scroll.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    const after = await button.boundingBox();
    const lastCard = await page.locator("article").last().boundingBox();
    assert.ok(
      after.x >= container.x &&
        after.x + after.width <= container.x + container.width + 1,
    );
    assert.ok(after.y + after.height <= container.y + container.height);
    assert.ok(
      Math.abs(after.y - before.y) < 1,
      "The footer stays fixed while meals scroll",
    );
    assert.ok(
      lastCard.y + lastCard.height <= after.y,
      "The last meal remains above the footer",
    );
    fonts.push(
      await button.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    );
  }
  assert.ok(fonts[0] <= fonts[1] && fonts[1] <= fonts[2]);
  console.log(
    "PASS contained responsive footer, scrolling, and unobscured final meal",
  );

  await button.evaluate((el) => {
    el.click();
    el.click();
  });
  await waitFor(() => confirmations.length === 1);
  await page.waitForFunction(() =>
    [...document.querySelectorAll("button")].some(
      (el) =>
        el.textContent.trim() === "تایید برنامه" &&
        el.getAttribute("aria-busy") === "true",
    ),
  );
  assert.equal(await button.isDisabled(), true);
  await page.waitForTimeout(100);
  assert.deepEqual(confirmations, [{ diet: "zistpa" }]);
  assert.equal(registeredRequests, 0);
  await confirmationRequest.fulfill({
    json: {
      success: false,
      error: { code: 42, message: "Confirmation failed" },
    },
  });
  await page.getByText("Confirmation failed", { exact: true }).waitFor();
  await page.waitForFunction(() =>
    [...document.querySelectorAll("button")].some(
      (el) => el.textContent.trim() === "تایید برنامه" && !el.disabled,
    ),
  );
  assert.equal(registeredRequests, 0, "Failure keeps the weekly page mounted");
  assert.equal(
    weeklyRequests,
    1,
    "A failed confirmation does not refresh or discard the plan",
  );
  console.log(
    "PASS exact POST payload, busy state, duplicate prevention, and error recovery",
  );

  await button.evaluate((el) => {
    el.click();
    el.click();
  });
  await waitFor(() => confirmations.length === 2);
  await confirmationRequest.fulfill({ json: { success: true } });
  await page.getByText("Dashboard destination", { exact: true }).waitFor();
  assert.deepEqual(confirmations, [{ diet: "zistpa" }, { diet: "zistpa" }]);
  assert.equal(
    registeredRequests,
    1,
    "Dashboard verifies confirmation with one registered-plan request",
  );
  assert.equal(
    weeklyRequests,
    1,
    "Invalidation does not refetch the departing weekly page",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS successful confirmation reaches Dashboard without stale redirects or duplicate reads",
  );
} finally {
  await browser.close();
  await server.close();
}
