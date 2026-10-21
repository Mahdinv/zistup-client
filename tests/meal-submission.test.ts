import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createSubmission,
  quantityToGrams,
} from "../src/features/dashboard/lib/quick-add-meal/meal-submission.ts";
import { initialFlow } from "../src/features/dashboard/lib/quick-add-meal/quick-add-meal.state.ts";
import { TEST_FOODS } from "./fixtures/quick-add-meal.fixture.ts";
import { MealType } from "../src/features/dashboard/api/types/add-meal.types.ts";

const food = {
  ...TEST_FOODS[0],
  id: "123",
  defaultUnitId: "serving",
  servingWeightGrams: 350,
  parts: [36, 81].map((id) => ({ ...TEST_FOODS[0].parts[0], id: String(id) })),
};
const state = {
  ...initialFlow,
  mealId: MealType.Lunch,
  selectedFoodId: 123,
  quantity: { amount: 2, unitId: "serving" },
};

test("general units convert to grams using fixed or backend weights", () => {
  for (const [unitId, amount, expected] of [
    ["palm", 4, 120],
    ["bite", 3, 105],
    ["spoon", 2, 30],
    ["gram", 80, 80],
    ["serving", 2, 700],
  ] as const)
    assert.equal(quantityToGrams({ unitId, amount }, food), expected);
  assert.equal(
    quantityToGrams(
      { unitId: "spoon", amount: 2 },
      { ...food, defaultUnitId: "spoon" },
    ),
    30,
  );
  assert.equal(
    quantityToGrams(
      { unitId: "serving", amount: 2 },
      { ...food, servingWeightGrams: 350.25 },
    ),
    700.5,
  );
});

test("general payload has numeric food id and no separated items", () => {
  assert.deepEqual(createSubmission(state, food), {
    foodId: 123,
    value: 700,
    meal: "lunch",
    separatedItems: [],
  });
});

test("detailed payload snapshots each edited ingredient without mutating state", () => {
  const detailedState = {
    ...state,
    detailed: {
      "36": { amount: 40, unitId: "gram" },
      "81": { amount: 75, unitId: "gram" },
    },
  };
  const before = structuredClone(detailedState);
  const payload = createSubmission(detailedState, food)!;
  assert.deepEqual(payload, {
    foodId: 123,
    value: 700,
    meal: "lunch",
    separatedItems: [
      { ingredient_id: 36, value: 40 },
      { ingredient_id: 81, value: 75 },
    ],
  });
  payload.separatedItems[0].value = 99;
  assert.deepEqual(detailedState, before);
});

test("invalid conversion and stale food cannot produce a payload", () => {
  assert.equal(createSubmission(initialFlow, food), null);
  assert.equal(createSubmission(state, { ...food, id: "124" }), null);
  assert.equal(quantityToGrams({ amount: 2, unitId: "unknown" }, food), null);
  assert.equal(quantityToGrams({ amount: NaN, unitId: "gram" }, food), null);
  assert.equal(
    quantityToGrams(state.quantity, { ...food, servingWeightGrams: 0 }),
    null,
  );
  assert.equal(createSubmission({ ...state, detailed: {} }, food), null);
});
