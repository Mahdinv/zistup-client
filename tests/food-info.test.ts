import assert from "node:assert/strict";
import { test } from "node:test";
import { mapFoodInfo } from "../src/features/dashboard/api/mappers/food-info.mapper.ts";
import { formatMealNumber } from "../src/features/dashboard/lib/quick-add-meal/format-meal-number.ts";
import { calculateMealNutrition } from "../src/features/dashboard/lib/quick-add-meal/meal-nutrition.ts";
import {
  flowReducer,
  initialFlow,
} from "../src/features/dashboard/lib/quick-add-meal/quick-add-meal.state.ts";
const ingredients = [
  { ingredient_id: 36, name: "روغن نباتی", grams: 35 },
  { ingredient_id: 81, name: "شانه بره", grams: 70 },
  { ingredient_id: 353, name: "کشمش", grams: 10.5 },
  { ingredient_id: 416, name: "پودر کاری", grams: 7 },
  { ingredient_id: 927, name: "پیاز", grams: 17.5 },
  { ingredient_id: 1181, name: "برنج سفید دانه بلند", grams: 210 },
].map((item) => ({
  ...item,
  nutrition: {
    calories_kcal: 301.7,
    protein_g: 19.39,
    carbohydrate_g: 0,
    fiber_g: 0,
  },
}));
const response = {
  success: true,
  data: {
    food_id: 4,
    name: "غذای واقعی",
    serving_unit: "bowl",
    serving_weight_g: 400,
    amount_g: 400,
    nutrition: {
      calories_kcal: 588.3487,
      protein_g: 30.8769,
      carbohydrate_g: 62.8784,
      fiber_g: null,
    },
    ingredients,
  },
};
test("calories use API amount and current quantity across unit switches", () => {
  const food = mapFoodInfo({
    ...response,
    data: {
      ...response.data,
      amount_g: 100,
      serving_weight_g: 250,
      serving_unit: "serving",
    },
  });
  for (const [unitId, grams] of [
    ["serving", 250],
    ["gram", 1],
    ["palm", 30],
    ["bite", 35],
    ["spoon", 15],
    ["serving", 250],
  ] as const) {
    for (const amount of [1, 2, 3]) {
      const calories = calculateMealNutrition({ unitId, amount }, food).kcal;
      assert.ok(Math.abs(calories! - (response.data.nutrition.calories_kcal * (grams * amount)) / 100) < 1e-9);
      assert.equal(
        formatMealNumber(calories),
        new Intl.NumberFormat("fa-IR").format(Math.round(calories!)),
      );
    }
  }
  assert.equal(
    calculateMealNutrition(
      { unitId: "gram", amount: 1 },
      { ...food, amountGrams: 0 },
    ).kcal,
    null,
  );
  assert.equal(
    calculateMealNutrition(
      { unitId: "gram", amount: 1 },
      { ...food, nutrition: { ...food.nutrition, kcal: null } },
    ).kcal,
    null,
  );
});
test("all metrics scale together while preserving missing values and display precision", () => {
  const food = mapFoodInfo({
    ...response,
    data: {
      ...response.data,
      amount_g: 100,
      serving_unit: "serving",
      serving_weight_g: 250,
      nutrition: {
        ...response.data.nutrition,
        protein_g: 10,
        fiber_g: 0,
        carbohydrate_g: 20,
        ghg_kg_co2eq: 0.1234,
        ef_single_score_mpt: 0.5678,
        water_l: 12.75,
      },
    },
  });
  const original = structuredClone(food);
  for (const [unitId, grams] of [
    ["serving", 250], ["gram", 1], ["palm", 30], ["bite", 35], ["spoon", 15],
  ] as const) {
    for (const amount of [1, 3]) {
      const nutrition = calculateMealNutrition({ unitId, amount }, food);
      for (const key of Object.keys(nutrition) as (keyof typeof nutrition)[]) {
        assert.ok(Math.abs(nutrition[key]! - food.nutrition[key]! * grams * amount / 100) < 1e-9);
      }
    }
  }
  const nutrition = calculateMealNutrition({ unitId: "serving", amount: 1 }, food);
  assert.equal(formatMealNumber(nutrition.protein), "۲۵");
  assert.equal(formatMealNumber(nutrition.fiber), "۰");
  assert.equal(formatMealNumber(nutrition.greenhouseGas, 3), "۰٫۳۰۹");
  assert.equal(formatMealNumber(nutrition.environmentalImpact, 2), "۱٫۴۲");
  assert.equal(formatMealNumber(nutrition.water), "۳۲");
  const missing = calculateMealNutrition({ unitId: "gram", amount: 100 }, {
    ...food, nutrition: { ...food.nutrition, water: null, fiber: null },
  });
  assert.equal(missing.water, null);
  assert.equal(missing.fiber, null);
  assert.equal(missing.protein, 10);
  const invalid = calculateMealNutrition({ unitId: "gram", amount: 1 }, { ...food, amountGrams: 0 });
  assert.ok(Object.values(invalid).every((value) => value === null));
  assert.deepEqual(food, original);
});

test("exact ingredient contract preserves IDs and raw nutrition/grams", () => {
  const food = mapFoodInfo(response);
  assert.equal(food.title, response.data.name);
  assert.equal(food.defaultUnitId, "bowl");
  assert.equal(food.generalUnits[0].label, "کاسه");
  assert.equal(food.parts.length, 6);
  assert.deepEqual(
    food.parts.map((p) => p.id),
    ingredients.map((i) => String(i.ingredient_id)),
  );
  assert.deepEqual(
    food.parts.map((p) => p.initialAmount),
    ingredients.map((i) => i.grams),
  );
  assert.equal(formatMealNumber(food.parts[0].kcal), "۳۰۲");
  assert.equal(formatMealNumber(food.nutrition.kcal), "۵۸۸");
  assert.equal(formatMealNumber(food.nutrition.protein), "۳۱");
  assert.equal(formatMealNumber(food.nutrition.fiber), "—");
  assert.equal(formatMealNumber(NaN), "—");
});
test("six ingredients initialize independently to nearest 5g and retain edits", () => {
  const food = mapFoodInfo(response);
  const quantity = { amount: 6, unitId: "bowl" };
  let state = flowReducer(
    { ...initialFlow, step: "details", selectedFoodId: 4 },
    { type: "detailed", food, quantity },
  );
  assert.deepEqual(
    food.parts.map((p) => state.detailed?.[p.id]?.amount),
    [35, 70, 10, 5, 20, 210],
  );
  state = flowReducer(state, {
    type: "detail",
    partId: "36",
    quantity: { unitId: "gram", amount: 45 },
  });
  state = flowReducer(state, { type: "part", partId: "81" });
  assert.equal(state.detailed?.["81"].amount, 70);
  state = flowReducer(state, { type: "part", partId: "36" });
  assert.equal(state.detailed?.["36"].amount, 45);
  assert.equal(ingredients[0].grams, 35);
  assert.equal(ingredients[2].grams, 10.5);
  state = flowReducer(state, { type: "back" });
  assert.deepEqual(state.quantity, quantity);
  assert.equal(state.detailed, null);
});
test("central serving unit mapping handles unknowns", async () => {
  const { ServingUnit, formatServingUnit } =
    await import("../src/features/dashboard/api/types/serving-unit.ts");
  assert.deepEqual(Object.values(ServingUnit).map(formatServingUnit), [
    "برش",
    "پرس",
    "کاسه",
    "تکه",
    "ساندویچ",
    "سیخ",
    "تعداد",
    "قاشق",
    "کاسه کوچک",
    "لقمه",
    "لیوان",
  ]);
  assert.equal(formatServingUnit("unknown"), "واحد نامشخص");
});

test("environmental metrics preserve API precision and format integers safely", () => {
  const nutrition = {
    ...response.data.nutrition,
    ghg_kg_co2eq: 2.7804,
    ef_single_score_mpt: 0.2807,
    water_l: 405.86,
  };
  const food = mapFoodInfo({
    ...response,
    data: { ...response.data, nutrition },
  });
  assert.equal(food.nutrition.greenhouseGas, 2.7804);
  assert.equal(food.nutrition.environmentalImpact, 0.2807);
  assert.equal(food.nutrition.water, 405.86);
  assert.equal(formatMealNumber(food.nutrition.greenhouseGas), "۳");
  assert.equal(formatMealNumber(food.nutrition.environmentalImpact), "۰");
  assert.equal(formatMealNumber(food.nutrition.water), "۴۰۶");
  const unavailable = mapFoodInfo({
    ...response,
    data: { ...response.data, nutrition: { ...nutrition, water_l: null } },
  });
  assert.equal(formatMealNumber(unavailable.nutrition.water), "—");
  assert.equal(nutrition.water_l, 405.86);
});

test("only requested metrics use decimal display precision", () => {
  assert.equal(formatMealNumber(0.4175, 2), "۰٫۴۲");
  assert.equal(formatMealNumber(2.2663, 3), "۲٫۲۶۶");
  assert.equal(formatMealNumber(2.2, 3), "۲٫۲");
  assert.equal(formatMealNumber(30.8769), "۳۱");
  assert.equal(formatMealNumber(null, 2), "—");
});
