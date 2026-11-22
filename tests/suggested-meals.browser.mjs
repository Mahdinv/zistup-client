// DIET_PLAN_FIXTURE points to a response JSON; it is read only and never copied into the repository.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { createServer } from "vite";
const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
);
const response = JSON.parse(
  await readFile(process.env.DIET_PLAN_FIXTURE, "utf8"),
);
const expected = response.data.days.flatMap((day) =>
  day.meals.flatMap((meal) =>
    [meal.main, ...meal.alternatives].filter(Boolean),
  ),
);
const server = await createServer({
  cacheDir: "node_modules/.vite-suggested-meals-test",
  server: { host: "127.0.0.1", port: 5196, strictPort: true },
  plugins: [
    {
      name: "suggested-meal-harness",
      configureServer(vite) {
        vite.middlewares.use(async (req, res, next) => {
          if (req.url === "/__plan-response") {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(response));
            return;
          }
          if (req.url === "/__suggested-meals") {
            res.setHeader("Content-Type", "text/html");
            res.end(
              await vite.transformIndexHtml(
                req.url,
                '<html lang="fa" dir="rtl"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module" src="/tests/fixtures/suggested-meals-harness.tsx"></script></body></html>',
              ),
            );
            return;
          }
          next();
        });
      },
    },
  ],
});
await server.listen();
const browser = await chromium.launch({
  headless: true,
  channel: process.env.BROWSER_CHANNEL || "msedge",
});
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
const errors = [];
const requests = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.route("**/dashboard/meal-logs", (route) => {
  requests.push({ kind: "submit", data: route.request().postDataJSON() });
  return route.fulfill({ json: { success: true } });
});
await page.route("**/dashboard/food-info", (route) => {
  const data = route.request().postDataJSON();
  requests.push({ kind: "info", data });
  return route.fulfill({
    json: {
      success: true,
      data: {
        food_id: data.id,
        type: data.type,
        name: "Detailed test food",
        serving_unit: "gram",
        serving_weight_g: 1,
        amount_g: 100,
        nutrition: {
          calories_kcal: 100,
          protein_g: 2,
          carbohydrate_g: 3,
          fiber_g: 4,
          ghg_kg_co2eq: 0,
          ef_single_score_mpt: 0,
          water_l: 0,
        },
        ingredients: [
          {
            ingredient_id: 117,
            name: "Test ingredient",
            grams: 100,
            nutrition: {
              calories_kcal: 100,
              protein_g: 2,
              carbohydrate_g: 3,
              fiber_g: 4,
              ghg_kg_co2eq: 0,
              ef_single_score_mpt: 0,
              water_l: 0,
            },
          },
        ],
      },
    },
  });
});
try {
  await page.goto("http://127.0.0.1:5196/__suggested-meals");
  await page.waitForFunction(() => window.testCardCount > 0);
  assert.equal(
    await page.evaluate(() => window.testCardCount),
    expected.length,
  );
  for (let i = 0; i < expected.length; i++) {
    await page.evaluate((index) => window.testShowCard(index), i);
    await page
      .getByRole("button", {
        name: "نمایش جزئیات " + expected[i].title,
        exact: true,
      })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    for (const ingredient of expected[i].ingredients || []) {
      const name =
        typeof ingredient === "string" ? ingredient : ingredient?.name;
      if (typeof name === "string" && name.trim())
        assert(
          (await dialog.getByText(name.trim(), { exact: true }).count()) > 0,
          `Ingredient missing on card ${i}`,
        );
    }
    assert(!(await dialog.innerText()).includes("[object Object]"));
    await dialog.locator('[data-slot="drawer-close"]').click();
    await dialog.waitFor({ state: "hidden" });
  }
  // Submit each food type once, and verify numeric IDs instead of recipe display codes.
  for (const type of ["recipe", "base_food"]) {
    const index = expected.findIndex((food) => food.type === type);
    if (index < 0) continue;
    const food = expected[index];
    await page.evaluate((index) => window.testShowCard(index), index);
    await page
      .getByRole("button", { name: "نمایش جزئیات " + food.title, exact: true })
      .click();
    await page
      .getByRole("button", { name: "ثبت این غذا", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.deepEqual(requests.at(-1)?.data.id, food.food_id ?? food.foodId);
    assert.equal(requests.at(-1)?.data.type, type);
    assert.equal(requests.at(-1)?.data.value, food.quantity.grams);
    await page
      .getByRole("button", { name: "نمایش جزئیات " + food.title, exact: true })
      .click();
    await page.getByRole("button", { name: /ثبت تفکیک شده/ }).click();
    await page
      .getByRole("dialog")
      .filter({ hasText: "Detailed test food" })
      .waitFor();
    assert.deepEqual(requests.at(-1), {
      kind: "info",
      data: { id: food.food_id ?? food.foodId, type },
    });
    await page
      .getByRole("dialog")
      .locator('[data-slot="drawer-close"]')
      .click();
    await page
      .getByRole("dialog")
      .filter({ hasText: "جزئیات وعده پیشنهادی" })
      .waitFor();
    await page
      .getByRole("dialog")
      .locator('[data-slot="drawer-close"]')
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
  }
  // Detailed submission follows plan ingredient order and joins food-info by ID.
  await page.evaluate(() => window.testShowCard(0));
  await page
    .getByRole("button", {
      name: "نمایش جزئیات " + expected[0].title,
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: /ثبت تفکیک شده/ }).click();
  await page
    .getByRole("dialog")
    .filter({ hasText: "Detailed test food" })
    .waitFor();
  await page.getByRole("button", { name: "ثبت غذا", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  const detailed = requests.at(-1);
  assert.equal(detailed.kind, "submit");
  assert.equal(detailed.data.foodId, expected[0].food_id ?? expected[0].foodId);
  assert.equal(detailed.data.type, expected[0].type);
  assert.equal(detailed.data.value, expected[0].quantity.grams);
  const planned = new Map();
  for (const part of expected[0].ingredients ?? []) {
    if (!Number.isSafeInteger(part?.ingredient_id) || part.ingredient_id <= 0)
      continue;
    const value = Number.isFinite(part.grams) && part.grams >= 0
      ? part.grams
      : part.ingredient_id === 117 ? 100 : undefined;
    if (value !== undefined) planned.set(part.ingredient_id, value);
  }
  assert.deepEqual(
    detailed.data.separatedItems,
    planned.size
      ? [...planned].map(([ingredient_id, value]) => ({ ingredient_id, value }))
      : [{ ingredient_id: 117, value: 100 }],
  );
  assert.deepEqual(errors, []);
  console.log(
    `PASS: all ${expected.length} supplied cards open with ingredient names; numeric food IDs/types, registration and detailed logging verified`,
  );
} finally {
  await browser.close();
  await server.close();
}
