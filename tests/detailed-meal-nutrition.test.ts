import assert from "node:assert/strict";
import { test } from "node:test";
import { mapFoodInfo } from "../src/features/dashboard/api/mappers/food-info.mapper.ts";
import type { FoodInfoResponse } from "../src/features/dashboard/api/types/food-info.types.ts";
import type {
  DetailedSelection,
  Nutrition,
} from "../src/features/dashboard/api/types/quick-add-meal.types.ts";
import {
  calculateIngredientNutrition,
  calculateMealNutrition,
} from "../src/features/dashboard/lib/quick-add-meal/meal-nutrition.ts";
import { INGREDIENT_UNITS } from "../src/features/dashboard/lib/quick-add-meal/ingredient-grams.ts";
import {
  flowReducer,
  initialFlow,
} from "../src/features/dashboard/lib/quick-add-meal/quick-add-meal.state.ts";
import { createSubmission } from "../src/features/dashboard/lib/quick-add-meal/meal-submission.ts";

const response: FoodInfoResponse = {
  success: true,
  data: {
    food_id: 4,
    type: "recipe",
    name: "غذا",
    serving_unit: "gram",
    serving_weight_g: 100,
    amount_g: 100,
    nutrition: {
      calories_kcal: 200,
      protein_g: 10,
      fiber_g: 5,
      carbohydrate_g: 20,
      ghg_kg_co2eq: 0.1,
      ef_single_score_mpt: 0.2,
      water_l: 15,
    },
    ingredients: [
      {
        ingredient_id: 1,
        name: "بخش اول",
        grams: 10.5,
        nutrition: {
          calories_kcal: 42,
          protein_g: 1.05,
          fiber_g: 0.21,
          carbohydrate_g: 5.25,
          ghg_kg_co2eq: 0.0105,
          ef_single_score_mpt: 0.021,
          water_l: 1.575,
        },
      },
      {
        ingredient_id: 2,
        name: "بخش دوم",
        grams: 80,
        nutrition: {
          calories_kcal: 120,
          protein_g: 8,
          fiber_g: 4,
          carbohydrate_g: 16,
          ghg_kg_co2eq: 0.08,
          ef_single_score_mpt: 0.16,
          water_l: 12,
        },
      },
    ],
  },
};
const quantity = { unitId: "gram", amount: 150 };
const selection: DetailedSelection = {
  "1": { unitId: "spoon", amount: 1 },
  "2": { unitId: "gram", amount: 40 },
};
function assertNutrition(actual: Nutrition, expected: Nutrition) {
  for (const key of Object.keys(expected) as (keyof Nutrition)[]) {
    if (expected[key] === null) assert.equal(actual[key], null, key);
    else {
      assert.notEqual(actual[key], null, key);
      assert.ok(Math.abs(actual[key]! - expected[key]!) < 1e-10, key);
    }
  }
}

test("maps every raw ingredient metric and sums scaled contributions using original API grams", () => {
  const food = mapFoodInfo(response);
  assert.deepEqual(food.parts[0].nutrition, {
    kcal: 42,
    protein: 1.05,
    fiber: 0.21,
    carbohydrates: 5.25,
    greenhouseGas: 0.0105,
    environmentalImpact: 0.021,
    water: 1.575,
  });
  assert.equal(calculateIngredientNutrition(undefined, food.parts[0]).kcal, 40);
  assertNutrition(calculateMealNutrition(quantity, food, selection), {
    kcal: 120,
    protein: 5.5,
    fiber: 2.3,
    carbohydrates: 15.5,
    greenhouseGas: 0.055,
    environmentalImpact: 0.11,
    water: 8.25,
  });
});

test("all ingredient units scale every metric through the existing gram mappings", () => {
  const part = mapFoodInfo(response).parts[0];
  for (const unit of INGREDIENT_UNITS) {
    const expected = calculateIngredientNutrition(
      { unitId: "gram", amount: unit.grams * 2 },
      part,
    );
    assertNutrition(
      calculateIngredientNutrition({ unitId: unit.id, amount: 2 }, part),
      expected,
    );
  }
});

test("repeated quantity and unit edits recalculate from immutable API values without drift", () => {
  const food = mapFoodInfo(response);
  const original = structuredClone(food);
  const expected = calculateMealNutrition(quantity, food, selection);
  for (let index = 0; index < 100; index++) {
    calculateMealNutrition(quantity, food, {
      ...selection,
      "1": { unitId: "cup", amount: 3 },
    });
    assertNutrition(
      calculateMealNutrition(quantity, food, {
        ...selection,
        "1": {
          unitId: index % 2 ? "gram" : "cube",
          amount: index % 2 ? 15 : 3,
        },
      }),
      expected,
    );
  }
  assert.deepEqual(food, original);
  assertNutrition(calculateMealNutrition(quantity, food), {
    kcal: 300,
    protein: 15,
    fiber: 7.5,
    carbohydrates: 30,
    greenhouseGas: 0.15,
    environmentalImpact: 0.3,
    water: 22.5,
  });
});

test("missing metrics stay unavailable unless the ingredient contributes zero grams", () => {
  const food = mapFoodInfo(response);
  food.parts[0].nutrition.water = null;
  const totals = calculateMealNutrition(quantity, food, selection);
  assert.equal(totals.water, null);
  assert.equal(totals.kcal, 120);
  assertNutrition(
    calculateMealNutrition(quantity, food, {
      ...selection,
      "1": { unitId: "gram", amount: 0 },
    }),
    {
      kcal: 60,
      protein: 4,
      fiber: 2,
      carbohydrates: 8,
      greenhouseGas: 0.04,
      environmentalImpact: 0.08,
      water: 6,
    },
  );
  const zero = calculateIngredientNutrition(
    { unitId: "gram", amount: 0 },
    food.parts[0],
  );
  assert.ok(Object.values(zero).every((value) => value === 0));
});

test("invalid units and missing original weights cannot produce misleading totals", () => {
  const part = mapFoodInfo(response).parts[0];
  for (const selection of [
    { unitId: "unknown", amount: 1 },
    { unitId: "gram", amount: -1 },
    { unitId: "gram", amount: Infinity },
  ]) {
    assert.ok(
      Object.values(calculateIngredientNutrition(selection, part)).every(
        (value) => value === null,
      ),
    );
  }
  for (const initialAmount of [0, null, undefined, NaN]) {
    assert.ok(
      Object.values(
        calculateIngredientNutrition(
          { unitId: "gram", amount: 10 },
          { ...part, initialAmount },
        ),
      ).every((value) => value === null),
    );
  }
});

test("detailed reducer edits update totals while preserving submission payloads and general quantities", () => {
  const food = mapFoodInfo(response);
  let state = flowReducer(
    {
      ...initialFlow,
      step: "details",
      mealId: "breakfast",
      selectedFoodId: 4,
      quantity,
    },
    { type: "detailed", food },
  );
  for (const [partId, quantity] of Object.entries(selection)) {
    state = flowReducer(state, { type: "detail", partId, quantity });
  }
  const before = createSubmission(state, food);
  assertNutrition(
    calculateMealNutrition(state.quantity, food, state.detailed),
    {
      kcal: 120,
      protein: 5.5,
      fiber: 2.3,
      carbohydrates: 15.5,
      greenhouseGas: 0.055,
      environmentalImpact: 0.11,
      water: 8.25,
    },
  );
  assert.deepEqual(createSubmission(state, food), before);
  assert.deepEqual(before?.separatedItems, [
    { ingredient_id: 1, value: 15 },
    { ingredient_id: 2, value: 40 },
  ]);
  state = flowReducer(state, { type: "back" });
  assert.deepEqual(state.quantity, quantity);
  assert.equal(
    calculateMealNutrition(state.quantity, food, state.detailed).kcal,
    300,
  );
});
