import assert from "node:assert/strict";
import { test } from "node:test";
import {
  roundIngredientGrams,
  getIngredientGramValues,
  ingredientQuantityToGrams,
  INGREDIENT_UNITS,
} from "../src/features/dashboard/lib/quick-add-meal/ingredient-grams.ts";
import { getGeneralUnits } from "../src/features/dashboard/lib/quick-add-meal/quantity-units.ts";
import {
  flowReducer,
  initialFlow,
} from "../src/features/dashboard/lib/quick-add-meal/quick-add-meal.state.ts";
import { mapFoodInfo } from "../src/features/dashboard/api/mappers/food-info.mapper.ts";
const data = {
  food_id: 4,
  name: "غذا",
  serving_unit: "serving",
  serving_weight_g: 400,
  amount_g: 400,
  nutrition: {
    calories_kcal: 100,
    protein_g: null,
    fiber_g: null,
    carbohydrate_g: null,
  },
  ingredients: [
    {
      ingredient_id: 1,
      name: "نان",
      grams: 80,
      nutrition: {
        calories_kcal: 123,
        protein_g: 0,
        carbohydrate_g: 0,
        fiber_g: 0,
      },
    },
    {
      ingredient_id: 2,
      name: "روغن",
      grams: 15,
      nutrition: {
        calories_kcal: 123,
        protein_g: 0,
        carbohydrate_g: 0,
        fiber_g: 0,
      },
    },
    {
      ingredient_id: 3,
      name: "گوشت",
      grams: 120,
      nutrition: {
        calories_kcal: 123,
        protein_g: 0,
        carbohydrate_g: 0,
        fiber_g: 0,
      },
    },
  ],
};
test("plan quantities preserve zero and skip legacy or unknown weights", () => {
  const response = { success: true, data };
  assert.equal(mapFoodInfo(response, null).planParts, undefined);
  assert.equal(mapFoodInfo(response, ["Legacy ingredient"]).planParts, undefined);
  const food = mapFoodInfo(response, [
    "Legacy ingredient",
    { name: "No ingredient ID", id: 9, grams: 20 },
    { name: "Unknown", ingredient_id: 7, grams: null },
    { name: "Missing", ingredient_id: 8 },
    { name: "Invalid", ingredient_id: 9, grams: NaN },
    { name: "Negative", ingredient_id: 4, grams: -1 },
    { name: "Infinite", ingredient_id: 5, grams: Infinity },
    { name: "Zero", ingredient_id: 6, grams: 0 },
    { name: "Oil", ingredient_id: 2, grams: null },
  ]);
  assert.deepEqual(
    food.planParts?.map(({ id, plannedGrams, initialAmount }) => ({
      id, plannedGrams, initialAmount,
    })),
    [
      { id: "6", plannedGrams: 0, initialAmount: undefined },
      { id: "2", plannedGrams: undefined, initialAmount: 15 },
    ],
  );
  assert.equal(food.planParts?.[0].nutrition.kcal, null);
});
test("four fixed units precede the unique localized server unit", () => {
  for (const [unit, label] of [
    ["serving", "پرس"],
    ["spoon", "قاشق"],
  ]) {
    const food = mapFoodInfo({
      success: true,
      data: { ...data, serving_unit: unit },
    });
    const labels = getGeneralUnits(food).map((unit) => unit.label);
    assert.deepEqual(labels.slice(0, 4), ["کف دست", "لقمه", "قاشق", "گرم"]);
    assert.equal(labels.filter((value) => value === label).length, 1);
    assert.equal(labels.length, unit === "spoon" ? 4 : 5);
  }
});
test("5g wheel rounds predictably and ingredient edits stay independent", () => {
  assert.equal(roundIngredientGrams(32), 30);
  assert.equal(roundIngredientGrams(33), 35);
  assert.equal(roundIngredientGrams(0), 0);
  const values = getIngredientGramValues(1232);
  assert.ok(values.includes(1230));
  assert.ok(values.every((value, index) => value === 5 * index));
  const food = mapFoodInfo({ success: true, data });
  let state = flowReducer(
    { ...initialFlow, step: "details" },
    { type: "detailed", food },
  );
  state = flowReducer(state, { type: "part", partId: "2" });
  state = flowReducer(state, {
    type: "detail",
    partId: "2",
    quantity: { amount: 25, unitId: "gram" },
  });
  state = flowReducer(state, { type: "part", partId: "3" });
  assert.equal(state.detailed?.["3"].amount, 120);
  state = flowReducer(state, { type: "part", partId: "2" });
  assert.equal(state.detailed?.["2"].amount, 25);
  assert.equal(food.parts[1].initialAmount, 15);
  assert.equal(data.ingredients[1].grams, 15);
});

test("ingredient units convert item counts and preserve zero", () => {
  const weights = [1, 15, 4, 240, 30, 45, 150, 40, 120, 200, 35, 5];
  INGREDIENT_UNITS.forEach((unit, index) => {
    assert.equal(ingredientQuantityToGrams({ unitId: unit.id, amount: 2 }), weights[index] * 2);
    assert.equal(ingredientQuantityToGrams({ unitId: unit.id, amount: 0 }), 0);
  });
  assert.equal(ingredientQuantityToGrams({ unitId: "unknown", amount: 2 }), null);
  assert.equal(ingredientQuantityToGrams({ unitId: "gram", amount: -1 }), null);
});
