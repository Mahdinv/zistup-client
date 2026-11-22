// Run with Node and Playwright. PLAYWRIGHT_MODULE_PATH can point to an existing installation.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createServer } from "vite";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const nutrition = {
  calories_kcal: 100,
  protein_g: 4,
  carbohydrate_g: 3,
  fiber_g: 2,
};
const ingredient = (ingredient_id, name, grams) => ({
  ingredient_id,
  name,
  grams,
});
const foodInfo = (id) => ({
  food_id: id,
  type: "recipe",
  name: `Recipe ${id}`,
  serving_unit: "gram",
  serving_weight_g: 100,
  amount_g: 100,
  nutrition,
  ingredients: [
    ingredient(11, "Test grain", id === 41 ? 18.12345 : 63.125),
    ingredient(22, "Test oil", id === 42 ? 7.375 : 0),
    ...(id === 42 ? [ingredient(44, "Food-info-only salt", 3.25)] : []),
  ].map((part) => ({ ...part, nutrition })),
});
const planFood = (id, title, grain, oil) => ({
  id,
  food_id: 42, // The same recipe can have different quantities in different meals.
  type: "recipe",
  title,
  image_url: null,
  quantity: { grams: 100, servings: 1, unit: "پرس" },
  nutrition,
  ingredients: [
    { ...ingredient(22, "Test oil", oil), id: 11 },
    { ...ingredient(11, "Test grain", grain), id: 22 },
  ],
});
const breakfast = planFood("breakfast", "Plan breakfast", 25.12345, 0);
breakfast.ingredients.push(ingredient(33, "Plan-only spice", 0.1875));
const alternative = planFood("alternative", "Plan alternative", 14.625, 5.875);
const lunch = planFood("lunch", "Plan lunch", 49.54321, 0);
const sundayLunch = {
  ...planFood("sunday-lunch", "Sunday lunch", 49.54321, 0),
  food_id: 43,
  foodId: 99,
  quantity: { grams: 123.75, servings: 1, unit: "پرس" },
};
sundayLunch.ingredients.push(ingredient(33, "Plan-only spice", 0.1875));
const plan = {
  success: true,
  data: {
    days: [{
      day: 1,
      meals: [
        { id: "b", key: "breakfast", title: "صبحانه", main: breakfast, alternatives: [alternative] },
        { id: "l", key: "lunch", title: "ناهار", main: lunch, alternatives: [] },
      ],
    }, {
      day: 2,
      meals: [{ id: "sunday-lunch", key: "lunch", main: sundayLunch }],
    }],
  },
};
const server = await createServer({
  cacheDir: "node_modules/.vite-separated-logging-test",
  server: { host: "127.0.0.1", port: 0 },
  plugins: [{
    name: "separated-logging-harness",
    configureServer(vite) {
      vite.middlewares.use("/__separated-logging", async (req, res) => {
        res.setHeader("Content-Type", "text/html");
        res.end(await vite.transformIndexHtml(
          req.originalUrl,
          '<html lang="fa" dir="rtl"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module" src="/tests/fixtures/separated-logging-harness.tsx"></script></body></html>',
        ));
      });
    },
  }],
});

const formatGrams = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 5 });
const detailedButton = (page) => page.getByRole("button", { name: /ثبت تفکیک شده/ });
const closeDrawer = (page) =>
  page.getByRole("dialog").locator('[data-slot="drawer-close"]').click();

async function verifyGrams(page, grams) {
  const dialog = page.getByRole("dialog");
  const label = formatGrams.format(grams);
  const amount = dialog.getByRole("spinbutton", { name: "مقدار", exact: true });
  await amount.and(page.locator(`[aria-valuenow="${grams}"][aria-valuetext="${label}"]`)).waitFor();
  await dialog.getByRole("spinbutton", { name: "واحد مقدار" })
    .and(page.locator('[aria-valuetext="گرم"]')).waitFor();
  const rowLabel = amount.getByText(label, { exact: true });
  await rowLabel.waitFor();
  const [wheelBox, labelBox] = await Promise.all([
    amount.boundingBox(),
    rowLabel.boundingBox(),
  ]);
  assert.ok(wheelBox && labelBox);
  assert.ok(
    labelBox.x >= wheelBox.x - 1 &&
      labelBox.x + labelBox.width <= wheelBox.x + wheelBox.width + 1,
    `The exact ${grams} g label must fit inside the wheel`,
  );
  assert.ok(
    Math.abs(labelBox.y + labelBox.height / 2 - (wheelBox.y + wheelBox.height / 2)) <= 5,
    `The exact ${grams} g label must be centered on the selected row`,
  );
  return amount;
}

async function verifyAndEdit(page, grain, oil, nextGrain) {
  const dialog = page.getByRole("dialog");
  const amount = await verifyGrams(page, grain);
  await amount.press("ArrowUp");
  await verifyGrams(page, nextGrain);
  await dialog.getByRole("button", { name: "Test oil", exact: true }).press("Enter");
  await verifyGrams(page, oil);
  await dialog.getByRole("button", { name: "Test grain", exact: true }).press("Enter");
  await verifyGrams(page, nextGrain);
}

async function verifyPlanOrder(page, oil, hasSpice = false) {
  const ingredients = page.getByRole("group", { name: "اجزای غذا" });
  await ingredients.waitFor();
  const labels = await ingredients.getByRole("button").evaluateAll(
    (buttons) => buttons.map((button) => button.getAttribute("aria-label")),
  );
  assert.deepEqual(labels, ["Test oil", "Test grain", ...(hasSpice ? ["Plan-only spice"] : [])]);
  await verifyGrams(page, oil);
  if (hasSpice) {
    await ingredients.getByRole("button", { name: "Plan-only spice" }).press("Enter");
    await verifyGrams(page, 0.1875);
  }
  await ingredients.getByRole("button", { name: "Test grain" }).press("Enter");
}

await server.listen();
let browser;
const releaseFailedSave = Promise.withResolvers();
try {
  browser = await chromium.launch({
    headless: true,
    channel: process.env.BROWSER_CHANNEL || "msedge",
  });
  const page = await browser.newPage({
    viewport: { width: 320, height: 850 },
    reducedMotion: "reduce",
  });
  const errors = [];
  const submissions = [];
  const planSubmissions = [];
  let refreshFoodInfo = false;
  let refreshedRequests = 0;
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/diet/v2/plan?diet=zistpa", (route) => route.fulfill({ json: plan }));
  await page.route("**/diet/v2/plan/meals", async (route) => {
    planSubmissions.push({
      method: route.request().method(),
      payload: route.request().postDataJSON(),
    });
    if (planSubmissions.length === 1) {
      await releaseFailedSave.promise;
      return route.fulfill({
        status: 422,
        json: { success: false, error: { message: "Could not save Sunday lunch" } },
      });
    }
    sundayLunch.title = "Saved Sunday lunch";
    return route.fulfill({ json: { success: true } });
  });
  await page.route("**/dashboard/food-info", (route) => {
    const data = foodInfo(route.request().postDataJSON().id);
    if (refreshFoodInfo) {
      refreshedRequests++;
      data.ingredients = data.ingredients.map((part) => ({
        ...part,
        grams: part.grams + 10,
      })).reverse();
    }
    return route.fulfill({ json: { success: true, data } });
  });
  await page.route("**/dashboard/meal-search", (route) => route.fulfill({
    json: {
      success: true,
      items: [41, 42].map((id) => ({
        id, type: "recipe", name: `Recipe ${id}`, serving_unit: "gram", nutrition,
      })),
    },
  }));
  await page.route("**/dashboard/meal-logs", (route) => {
    submissions.push(route.request().postDataJSON());
    return route.fulfill({ json: { success: true } });
  });
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  const start = (flow) => page.goto(`${origin}/__separated-logging?flow=${flow}`);

  await start("quick");
  await page.getByRole("button", { name: "Open quick add" }).click();
  await page.getByRole("button", { name: "صبحانه", exact: true }).click();
  await page.getByRole("searchbox", { name: "جستجوی غذا" }).fill("recipe");
  await page.getByText("Recipe 41", { exact: true }).click();
  await detailedButton(page).click();
  await verifyAndEdit(page, 18.12345, 0, 18.5);
  const back = page.getByRole("button", { name: "بازگشت", exact: true });
  await back.click();
  await detailedButton(page).waitFor();
  await back.click();
  await page.getByText("Recipe 42", { exact: true }).click();
  await detailedButton(page).click();
  await verifyAndEdit(page, 63.125, 7.375, 63.5);
  await page.getByRole("button", { name: "ثبت غذا", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  assert.deepEqual(submissions.at(-1)?.separatedItems, [
    { ingredient_id: 11, value: 63.5 },
    { ingredient_id: 22, value: 7.375 },
    { ingredient_id: 44, value: 3.25 },
  ]);
  console.log("PASS quick-add-meal initialized from food-info and submitted edited grams");

  await start("suggested");
  await page.getByRole("button", { name: "نمایش جزئیات Plan breakfast" }).click();
  await detailedButton(page).click();
  await verifyPlanOrder(page, 0, true);
  await verifyAndEdit(page, 25.12345, 0, 25.5);
  await closeDrawer(page);
  await page.getByRole("tab", { name: "جایگزین اول" }).click();
  await detailedButton(page).click();
  await verifyPlanOrder(page, 5.875);
  await verifyAndEdit(page, 14.625, 5.875, 15);
  await page.getByRole("button", { name: "ثبت غذا", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  assert.deepEqual(submissions.at(-1)?.separatedItems, [
    { ingredient_id: 22, value: 5.875 },
    { ingredient_id: 11, value: 15 },
  ]);
  console.log("PASS SuggestedMealsCard switched plan options with the same recipe ID");

  await start("weekly");
  const settings = page.getByRole("button", { name: "تنظیمات وعده شنبه" });
  await settings.click();
  await verifyPlanOrder(page, 0, true);
  await verifyAndEdit(page, 25.12345, 0, 25.5);
  refreshFoodInfo = true;
  await page.evaluate(() => window.refreshTestFoodInfo());
  assert.equal(refreshedRequests, 1);
  await verifyGrams(page, 25.5);
  await page.getByRole("button", { name: "Test oil", exact: true }).press("Enter");
  await verifyGrams(page, 0);
  await closeDrawer(page);
  await page.getByRole("button", { name: "ناهار", exact: true }).click();
  await settings.click();
  await verifyPlanOrder(page, 0);
  await verifyAndEdit(page, 49.54321, 0, 50);
  await closeDrawer(page);
  await page.getByRole("button", { name: "صبحانه", exact: true }).click();
  await settings.click();
  await verifyPlanOrder(page, 0, true);
  await verifyGrams(page, 25.12345);
  await closeDrawer(page);

  await page.getByRole("button", { name: "ناهار", exact: true }).click();
  await page.getByRole("button", { name: "تنظیمات وعده یکشنبه" }).click();
  await verifyPlanOrder(page, 0, true);
  await verifyAndEdit(page, 49.54321, 0, 50);
  const confirm = page.getByRole("button", { name: "تایید", exact: true });
  await confirm.click();
  const pending = page.getByRole("button", { name: "در حال ثبت...", exact: true });
  await pending.and(page.locator(":disabled")).waitFor();
  releaseFailedSave.resolve();
  await page.getByText("Could not save Sunday lunch", { exact: true }).waitFor();
  await verifyGrams(page, 50);
  const expectedSave = {
    method: "POST",
    payload: {
      diet: "zistpa",
      meals: [{
        day: 2,
        meal: "lunch",
        id: 43,
        type: "recipe",
        value: 123.75,
        separatedItems: [
          { ingredient_id: 22, value: 0 },
          { ingredient_id: 11, value: 50 },
          { ingredient_id: 33, value: 0.1875 },
        ],
      }],
    },
  };
  assert.deepEqual(planSubmissions, [expectedSave]);
  await confirm.click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.getByRole("heading", { name: "Saved Sunday lunch" }).waitFor();
  assert.deepEqual(planSubmissions, [expectedSave, expectedSave]);
  assert.equal(submissions.length, 2, "Weekly confirmation must use the diet API");
  assert.deepEqual(errors, []);
  console.log("PASS WeeklyMealCard saved the exact ingredients after retry and refreshed the plan");
} finally {
  releaseFailedSave.resolve();
  await browser?.close();
  await server.close();
}
