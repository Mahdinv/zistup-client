import assert from "node:assert/strict";
import { test } from "node:test";
import {
  roundIngredientGrams,
  getIngredientGramValues,
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
  assert.equal(roundIngredientGrams(0), 5);
  const values = getIngredientGramValues(1232);
  assert.ok(values.includes(1230));
  assert.ok(values.every((value, index) => value === 5 * (index + 1)));
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
